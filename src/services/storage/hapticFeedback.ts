import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./constants";

const HAPTIC_FEEDBACK_KEY = STORAGE_KEYS.HAPTIC_FEEDBACK;

export const getHapticFeedbackEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(HAPTIC_FEEDBACK_KEY);
    if (value === null) {
      await AsyncStorage.setItem(HAPTIC_FEEDBACK_KEY, JSON.stringify(true));
      return true;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error("Error getting haptic feedback preference:", error);
    return true;
  }
};

export const setHapticFeedbackEnabled = async (
  enabled: boolean,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(HAPTIC_FEEDBACK_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error("Error setting haptic feedback preference:", error);
  }
};

export const toggleHapticFeedback = async (): Promise<boolean> => {
  try {
    const currentValue = await getHapticFeedbackEnabled();
    const newValue = !currentValue;
    await setHapticFeedbackEnabled(newValue);
    return newValue;
  } catch (error) {
    console.error("Error toggling haptic feedback preference:", error);
    return true;
  }
};
