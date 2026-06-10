const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withUniwindConfig } = require("uniwind/metro");

const config = getSentryExpoConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/app/global.css",
  dtsFile: "./src/app/uniwind-types.d.ts",
  polyfills: {
    rem: 14,
  },
});
