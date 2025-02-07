import { focusManager } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";

export const useOnlineManager = () => {
  const onAppStateChange = useCallback((status: AppStateStatus) => {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, [onAppStateChange]);
};
