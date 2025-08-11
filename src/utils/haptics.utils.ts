import * as Haptics from "expo-haptics";
import { getHapticFeedbackEnabled } from "@/services/storage/hapticFeedback";

let hapticEnabled = true;

getHapticFeedbackEnabled().then((enabled) => {
  hapticEnabled = enabled;
});

export const hapticFeedback = {
  light: () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  medium: () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  heavy: () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  success: () => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  error: () => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
  warning: () => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
};

export const updateHapticFeedbackState = (enabled: boolean) => {
  hapticEnabled = enabled;
};

export const isHapticFeedbackEnabled = () => hapticEnabled;
