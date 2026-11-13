import { storage } from "@/services/storage/asyncStorage";

export const API_ENVIRONMENTS = {
  production: "https://api.transat.dev",
  development: "https://develop.transat.dev",
} as const;

export type ApiEnvironment = keyof typeof API_ENVIRONMENTS;

// Set only from the hidden developer menu; without it the build's own EXPO_PUBLIC_API_URL is used.
const API_ENVIRONMENT_KEY = "devApiEnvironment";

const trimSlashes = (url: string) => url.replace(/\/+$/, "");

let overridePromise: Promise<ApiEnvironment | null> | null = null;

const loadOverride = async () => {
  const stored = await storage.get<string>(API_ENVIRONMENT_KEY);
  return stored && stored in API_ENVIRONMENTS
    ? (stored as ApiEnvironment)
    : null;
};

const getOverride = () => {
  overridePromise ??= loadOverride();
  return overridePromise;
};

/** The API base URL every request goes to, without a trailing slash. */
export const getApiBaseUrl = async () => {
  const override = await getOverride();
  return trimSlashes(
    override
      ? API_ENVIRONMENTS[override]
      : (process.env.EXPO_PUBLIC_API_URL ?? ""),
  );
};

/** Which known environment the current base URL points to, or null for anything else (e.g. localhost). */
export const getCurrentApiEnvironment =
  async (): Promise<ApiEnvironment | null> => {
    const base = await getApiBaseUrl();
    const match = Object.entries(API_ENVIRONMENTS).find(
      ([, url]) => trimSlashes(url) === base,
    );
    return (match?.[0] as ApiEnvironment | undefined) ?? null;
  };

export const setApiEnvironment = async (environment: ApiEnvironment) => {
  await storage.set(API_ENVIRONMENT_KEY, environment);
  overridePromise = Promise.resolve(environment);
};

/** Back to the URL the build was made with. */
export const resetApiEnvironment = async () => {
  await storage.remove(API_ENVIRONMENT_KEY);
  overridePromise = Promise.resolve(null);
};
