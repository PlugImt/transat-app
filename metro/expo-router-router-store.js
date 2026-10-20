const {
  navigationRef,
} = require("expo-router/build/global-state/navigationRef");
const {
  getRouteInfoFromState,
} = require("expo-router/build/global-state/getRouteInfoFromState");

// SDK 58 removed this module. Sentry still requires it for navigation tracing.
const store = {
  get navigationRef() {
    return navigationRef;
  },
  getRouteInfo() {
    if (!navigationRef.isReady()) return undefined;
    return getRouteInfoFromState(navigationRef.getRootState());
  },
};

module.exports = { store };
