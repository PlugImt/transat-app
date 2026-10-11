const { withAppDelegate, withInfoPlist } = require("expo/config-plugins");

module.exports = function withSceneLifecycle(config) {
  const sceneConfig = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: "EXExpoAppSceneDelegate",
          },
        ],
      },
    };
    return config;
  });

  return withAppDelegate(sceneConfig, (config) => {
    if (config.modResults.language !== "swift") {
      throw new Error("Scene lifecycle requires the Expo Swift AppDelegate");
    }
    let contents = config.modResults.contents;
    contents = contents.replace(
      "class AppDelegate: ExpoAppDelegate {",
      "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {",
    );
    const legacyWindow =
      /#if os\(iOS\) \|\| os\(tvOS\)\s+window = UIWindow\(frame: UIScreen\.main\.bounds\)[\s\S]*?factory\.startReactNative\([\s\S]*?launchOptions: launchOptions\)\s*#endif/;
    contents = contents.replace(legacyWindow, "");
    if (
      !contents.includes("ExpoReactNativeFactoryProvider") ||
      contents.includes("window = UIWindow(frame: UIScreen.main.bounds)")
    ) {
      throw new Error(
        "Unexpected Expo AppDelegate template for scene lifecycle",
      );
    }
    config.modResults.contents = contents;
    return config;
  });
};
