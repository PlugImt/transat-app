const path = require("node:path");
const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = withNativeWind(getSentryExpoConfig(__dirname), {
  input: "./src/app/global.css",
});

const routerStoreShim = path.resolve(
  __dirname,
  "metro/expo-router-router-store.js",
);
const resolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "expo-router/build/global-state/router-store") {
    return { type: "sourceFile", filePath: routerStoreShim };
  }
  if (resolveRequest) {
    return resolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
