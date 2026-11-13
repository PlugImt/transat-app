import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Keeps the last console lines in memory and on disk, so the developer menu can show what happened before a
 * crash. The lines of the previous run are kept apart at start-up: after a native crash (which JS never sees)
 * they are the only trace left. A fatal JS error is also recorded with its stack.
 */

export type LogLevel = "log" | "info" | "warn" | "error";

export interface LogEntry {
  id: number;
  time: number;
  level: LogLevel;
  message: string;
}

export interface CrashReport {
  time: number;
  isFatal: boolean;
  message: string;
  stack?: string;
  logs: LogEntry[];
}

const MAX_ENTRIES = 500;
const MAX_MESSAGE_LENGTH = 2000;
const PERSIST_DELAY_MS = 1500;

// Raw AsyncStorage on purpose: the app's storage wrapper logs its own errors, which would loop back here.
const CURRENT_LOGS_KEY = "devLogs.current";
const PREVIOUS_LOGS_KEY = "devLogs.previous";
const LAST_CRASH_KEY = "devLogs.lastCrash";

let entries: LogEntry[] = [];
let nextId = 0;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
let installed = false;
const listeners = new Set<() => void>();
// What React sees. Updated a tick later: a component that logs while rendering must not re-render another one.
let published: LogEntry[] = [];
let notifyTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleNotify = () => {
  if (notifyTimer) return;
  notifyTimer = setTimeout(() => {
    notifyTimer = null;
    published = entries;
    for (const listener of listeners) listener();
  }, 0);
};

const stringify = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value instanceof Error)
    return value.stack ?? `${value.name}: ${value.message}`;
  try {
    const seen = new WeakSet<object>();
    return JSON.stringify(value, (_key, v) => {
      if (typeof v === "object" && v !== null) {
        if (seen.has(v)) return "[Circular]";
        seen.add(v);
      }
      return v;
    });
  } catch {
    return String(value);
  }
};

// console-style placeholders ("%s", "%d"…), as React's own warnings use them.
const formatArgs = (args: unknown[]) => {
  const [first, ...rest] = args;
  if (typeof first !== "string" || !/%[sdifoOjc]/.test(first)) {
    return args.map(stringify).join(" ");
  }
  const remaining = [...rest];
  const head = first.replace(/%([sdifoOjc%])/g, (match, type: string) => {
    if (type === "%") return "%";
    if (remaining.length === 0) return match;
    const value = remaining.shift();
    return type === "c" ? "" : stringify(value);
  });
  return [head, ...remaining.map(stringify)].join(" ");
};

const persist = async () => {
  persistTimer = null;
  try {
    await AsyncStorage.setItem(CURRENT_LOGS_KEY, JSON.stringify(entries));
  } catch {
    // Nothing to do: logging must never break the app.
  }
};

const schedulePersist = () => {
  if (persistTimer) return;
  persistTimer = setTimeout(persist, PERSIST_DELAY_MS);
};

const record = (level: LogLevel, args: unknown[]) => {
  let message = formatArgs(args);
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = `${message.slice(0, MAX_MESSAGE_LENGTH)}…`;
  }
  // A new array each time, so React can use it as a snapshot.
  entries = [
    ...entries.slice(-(MAX_ENTRIES - 1)),
    { id: nextId++, time: Date.now(), level, message },
  ];
  schedulePersist();
  scheduleNotify();
};

const installGlobalErrorHandler = () => {
  const errorUtils = (
    globalThis as unknown as {
      ErrorUtils?: {
        getGlobalHandler: () => (error: unknown, isFatal?: boolean) => void;
        setGlobalHandler: (
          handler: (error: unknown, isFatal?: boolean) => void,
        ) => void;
      };
    }
  ).ErrorUtils;
  if (!errorUtils) return;

  const previousHandler = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error, isFatal) => {
    const err = error instanceof Error ? error : new Error(stringify(error));
    const report: CrashReport = {
      time: Date.now(),
      isFatal: Boolean(isFatal),
      message: `${err.name}: ${err.message}`,
      stack: err.stack,
      logs: entries.slice(-200),
    };
    // Written before the previous handler runs, which may kill the app.
    AsyncStorage.setItem(LAST_CRASH_KEY, JSON.stringify(report)).catch(
      () => {},
    );
    previousHandler(error, isFatal);
  });
};

/** Call once, as early as possible. */
export const installLogCapture = () => {
  if (installed) return;
  installed = true;

  // The lines left by the last run become "previous run" before this run writes its own.
  AsyncStorage.getItem(CURRENT_LOGS_KEY)
    .then((previous) =>
      previous ? AsyncStorage.setItem(PREVIOUS_LOGS_KEY, previous) : undefined,
    )
    .catch(() => {});

  for (const level of ["log", "info", "warn", "error"] as const) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      try {
        record(level, args);
      } catch {
        // Never let capture swallow the original log.
      }
      original(...args);
    };
  }

  installGlobalErrorHandler();
};

/** Stable between notifications, so it works with useSyncExternalStore. */
export const getCurrentLogs = () => published;

export const subscribeToLogs = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getPreviousRunLogs = async (): Promise<LogEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(PREVIOUS_LOGS_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
};

export const getLastCrash = async (): Promise<CrashReport | null> => {
  try {
    const raw = await AsyncStorage.getItem(LAST_CRASH_KEY);
    return raw ? (JSON.parse(raw) as CrashReport) : null;
  } catch {
    return null;
  }
};

export const clearLogs = async () => {
  entries = [];
  scheduleNotify();
  await AsyncStorage.multiRemove([
    CURRENT_LOGS_KEY,
    PREVIOUS_LOGS_KEY,
    LAST_CRASH_KEY,
  ]).catch(() => {});
};

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

export const formatLogTime = (time: number) => {
  const d = new Date(time);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

export const formatLogs = (logs: LogEntry[]) =>
  logs
    .map(
      (entry) =>
        `${new Date(entry.time).toISOString()} [${entry.level.toUpperCase()}] ${entry.message}`,
    )
    .join("\n");

export const formatCrash = (crash: CrashReport) =>
  [
    `${crash.isFatal ? "FATAL" : "Non-fatal"} error at ${new Date(crash.time).toISOString()}`,
    crash.message,
    crash.stack ?? "",
    "",
    "--- Logs before the error ---",
    formatLogs(crash.logs),
  ].join("\n");
