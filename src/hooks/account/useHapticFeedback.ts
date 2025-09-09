import { useCallback, useEffect, useState } from "react";
import {
  getHapticFeedbackEnabled,
  setHapticFeedbackEnabled,
} from "@/services/storage/hapticFeedback";
import { updateHapticFeedbackState } from "@/utils/haptics.utils";

export const useHapticFeedback = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const loadHapticFeedbackPreference = useCallback(async () => {
    try {
      const enabled = await getHapticFeedbackEnabled();
      setIsEnabled(enabled);
      updateHapticFeedbackState(enabled);
    } catch (error) {
      console.error("Error loading haptic feedback preference:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHapticFeedbackPreference();
  }, [loadHapticFeedbackPreference]);

  const toggleHapticFeedback = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    updateHapticFeedbackState(newValue);

    try {
      await setHapticFeedbackEnabled(newValue);
    } catch (error) {
      console.error("Error toggling haptic feedback:", error);
      setIsEnabled(!newValue);
      updateHapticFeedbackState(!newValue);
    }
  };

  const setHapticFeedback = async (enabled: boolean) => {
    setIsEnabled(enabled);
    updateHapticFeedbackState(enabled);

    try {
      await setHapticFeedbackEnabled(enabled);
    } catch (error) {
      console.error("Error setting haptic feedback:", error);
      setIsEnabled(!enabled);
      updateHapticFeedbackState(!enabled);
    }
  };

  return {
    isEnabled,
    isLoading,
    toggleHapticFeedback,
    setHapticFeedback,
  };
};
