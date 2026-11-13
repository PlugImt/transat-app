import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { reloadAppAsync } from "expo";
import * as Device from "expo-device";
import { useFocusEffect } from "expo-router";
import {
  Bomb,
  Bug,
  Check,
  FileClock,
  RefreshCw,
  Server,
  Share2,
  Trash2,
} from "lucide-react-native";
import { useCallback, useState, useSyncExternalStore } from "react";
import { Platform, Share, View } from "react-native";
import Card from "@/components/common/Card";
import { Dialog, DialogContent } from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import {
  API_ENVIRONMENTS,
  type ApiEnvironment,
  getApiBaseUrl,
  getCurrentApiEnvironment,
  setApiEnvironment,
} from "@/services/dev/apiEnvironment";
import {
  type CrashReport,
  clearLogs,
  formatCrash,
  formatLogs,
  formatLogTime,
  getCurrentLogs,
  getLastCrash,
  getPreviousRunLogs,
  type LogEntry,
  subscribeToLogs,
} from "@/services/dev/logCapture";
import { getInstallationId } from "@/services/devices/installationId";
import { getAppVersionInfo } from "@/utils";
import SettingCategory from "./components/SettingCategory";
import SettingsItem from "./components/SettingsItem";

// The developer menu is internal tooling, so its texts are not translated.

const ENVIRONMENT_LABELS: Record<ApiEnvironment, string> = {
  production: "Production",
  development: "Development",
};

const VISIBLE_LOG_LINES = 40;

const useLiveLogs = () => useSyncExternalStore(subscribeToLogs, getCurrentLogs);

const shareText = async (title: string, message: string) => {
  try {
    await Share.share({ title, message });
  } catch (error) {
    console.warn("[DevMenu] Share failed", error);
  }
};

export const DevMenu = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const logs = useLiveLogs();

  const [baseUrl, setBaseUrl] = useState("");
  const [environment, setEnvironment] = useState<ApiEnvironment | null>(null);
  const [installationId, setInstallationId] = useState("");
  const [lastCrash, setLastCrash] = useState<CrashReport | null>(null);
  const [previousLogs, setPreviousLogs] = useState<LogEntry[]>([]);
  const [pendingEnvironment, setPendingEnvironment] =
    useState<ApiEnvironment | null>(null);
  const [confirmCrash, setConfirmCrash] = useState(false);

  const versionInfo = getAppVersionInfo();

  // On focus, so a crash or a switch that happened since the screen was opened shows up.
  useFocusEffect(
    useCallback(() => {
      getApiBaseUrl().then(setBaseUrl);
      getCurrentApiEnvironment().then(setEnvironment);
      getInstallationId()
        .then(setInstallationId)
        .catch(() => {});
      getLastCrash().then(setLastCrash);
      getPreviousRunLogs().then(setPreviousLogs);
    }, []),
  );

  const deviceInfo = [
    ["App", versionInfo.fullVersion],
    ["OS", `${Platform.OS} ${Platform.Version}`],
    ["Device", `${Device.manufacturer ?? ""} ${Device.modelName ?? ""}`.trim()],
    ["API", baseUrl || "—"],
    ["Installation", installationId || "—"],
    ["JS mode", __DEV__ ? "development" : "release"],
  ] as const;

  const reportHeader = deviceInfo.map(([k, v]) => `${k}: ${v}`).join("\n");

  const switchEnvironment = async (next: ApiEnvironment) => {
    // Both backends sign tokens with the same key, so the session carries over: a reload is enough to drop
    // every cached answer and screen state from the old backend.
    await setApiEnvironment(next);
    try {
      await reloadAppAsync(`API switched to ${next}`);
    } catch (error) {
      console.warn("[DevMenu] Reload failed", error);
      queryClient.clear();
      setEnvironment(next);
      setBaseUrl(await getApiBaseUrl());
      toast(`API: ${ENVIRONMENT_LABELS[next]}. Restart the app.`, "info");
    }
  };

  const handleClearLogs = async () => {
    await clearLogs();
    setLastCrash(null);
    setPreviousLogs([]);
    toast("Logs cleared");
  };

  const handleSentryTest = () => {
    Sentry.captureException(new Error("Test error from the developer menu"));
    toast(
      __DEV__ ? "Sentry is disabled in development builds" : "Sent to Sentry",
    );
  };

  const triggerCrash = () => {
    // Outside React so it reaches the global handler like a real uncaught error.
    setTimeout(() => {
      throw new Error("Test crash from the developer menu");
    }, 0);
  };

  const iconProps = { color: theme.text, size: 22 };

  return (
    <Page title="Developer">
      <SettingCategory title="Device">
        {deviceInfo.map(([label, value]) => (
          <View key={label} className="flex-row justify-between gap-4 py-2">
            <Text color="muted" variant="sm">
              {label}
            </Text>
            <Text variant="sm" className="flex-1 text-right" selectable>
              {value}
            </Text>
          </View>
        ))}
      </SettingCategory>

      <SettingCategory title="API">
        {(Object.keys(API_ENVIRONMENTS) as ApiEnvironment[]).map((env) => (
          <SettingsItem
            key={env}
            icon={<Server {...iconProps} />}
            title={ENVIRONMENT_LABELS[env]}
            subtitle={API_ENVIRONMENTS[env]}
            onPress={
              env === environment ? undefined : () => setPendingEnvironment(env)
            }
            rightElement={
              env === environment ? (
                <Check color={theme.primary} size={22} />
              ) : undefined
            }
          />
        ))}
      </SettingCategory>

      <SettingCategory title="Logs">
        <SettingsItem
          icon={<Share2 {...iconProps} />}
          title="Share this session's logs"
          subtitle={`${logs.length} lines`}
          onPress={() =>
            shareText("Transat logs", `${reportHeader}\n\n${formatLogs(logs)}`)
          }
        />
        <SettingsItem
          icon={<FileClock {...iconProps} />}
          title="Share previous run's logs"
          subtitle={
            previousLogs.length
              ? `${previousLogs.length} lines — useful after a crash`
              : "Nothing recorded"
          }
          onPress={
            previousLogs.length
              ? () =>
                  shareText(
                    "Transat logs (previous run)",
                    `${reportHeader}\n\n${formatLogs(previousLogs)}`,
                  )
              : undefined
          }
        />
        <SettingsItem
          icon={<Bug {...iconProps} />}
          title="Share last crash"
          subtitle={
            lastCrash
              ? `${new Date(lastCrash.time).toLocaleString()} — ${lastCrash.message}`
              : "No crash recorded"
          }
          onPress={
            lastCrash
              ? () =>
                  shareText(
                    "Transat crash",
                    `${reportHeader}\n\n${formatCrash(lastCrash)}`,
                  )
              : undefined
          }
        />
        <SettingsItem
          icon={<Trash2 {...iconProps} />}
          title="Clear logs"
          onPress={handleClearLogs}
        />
      </SettingCategory>

      <Card className="gap-1 px-4 py-3">
        {logs.length === 0 ? (
          <Text color="muted" variant="sm">
            No logs yet
          </Text>
        ) : (
          logs
            .slice(-VISIBLE_LOG_LINES)
            .reverse()
            .map((entry) => (
              <Text
                key={entry.id}
                variant="sm"
                numberOfLines={4}
                style={{
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                  fontSize: 11,
                  color:
                    entry.level === "error"
                      ? theme.destructive
                      : entry.level === "warn"
                        ? theme.warning
                        : theme.text,
                }}
              >
                {formatLogTime(entry.time)} {entry.message}
              </Text>
            ))
        )}
      </Card>

      <SettingCategory title="Tools">
        <SettingsItem
          icon={<RefreshCw {...iconProps} />}
          title="Refetch all data"
          onPress={() => {
            queryClient.invalidateQueries();
            toast("Queries invalidated");
          }}
        />
        <SettingsItem
          icon={<Bug {...iconProps} />}
          title="Send a test error to Sentry"
          onPress={handleSentryTest}
        />
        <SettingsItem
          icon={<Bomb {...iconProps} />}
          title="Trigger a test crash"
          subtitle="Checks that crashes are recorded"
          onPress={() => setConfirmCrash(true)}
        />
      </SettingCategory>

      <Dialog
        open={pendingEnvironment !== null}
        onOpenChange={(open) => {
          if (!open) setPendingEnvironment(null);
        }}
      >
        <DialogContent
          title="Switch API"
          cancelLabel="Cancel"
          confirmLabel="Switch and reload"
          onConfirm={() => {
            if (pendingEnvironment) switchEnvironment(pendingEnvironment);
          }}
        >
          <Text>
            {pendingEnvironment
              ? `Requests will go to ${API_ENVIRONMENTS[pendingEnvironment]}. The app reloads and you stay signed in.`
              : ""}
          </Text>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCrash} onOpenChange={setConfirmCrash}>
        <DialogContent
          title="Trigger a test crash"
          cancelLabel="Cancel"
          confirmLabel="Crash"
          onConfirm={triggerCrash}
        >
          <Text>
            The app will throw an uncaught error. In a release build it closes;
            the report then shows under "Share last crash".
          </Text>
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default DevMenu;
