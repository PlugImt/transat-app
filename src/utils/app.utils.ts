import * as Application from "expo-application";

export interface AppVersionInfo {
  version: string;
  buildNumber: string;
  fullVersion: string;
}

export const getAppVersionInfo = (): AppVersionInfo => {
  // Get user-facing version (visible in stores)
  const version = Application.nativeApplicationVersion || "1.0.0";

  // Get developer-facing build version
  const buildNumber = Application.nativeBuildVersion || "1";

  return {
    version,
    buildNumber,
    fullVersion: `${version} (${buildNumber})`,
  };
};
