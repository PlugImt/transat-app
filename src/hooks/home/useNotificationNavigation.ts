import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import {
  type NavigationProp,
  useNavigation,
} from "expo-router/react-navigation";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import { useToast } from "@/components/common/Toast";
import {
  isExternalLink,
  resolveNotificationRoute,
  toNavbarParams,
} from "@/services/notifications/navigation";
import type { AppStackParamList } from "@/types";

/**
 * Opens the destination of a tapped push notification. Mount it where the app
 * navigator is ready (signed in, onboarding done): it covers taps made while the
 * app is open, in background, or closed (the response is queued until mounted).
 */
export const useNotificationNavigation = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const response = Notifications.useLastNotificationResponse();
  const handledId = useRef<string | null>(null);

  useEffect(() => {
    if (!response) {
      handledId.current = null;
      return;
    }
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
      return;
    }

    const { identifier, content } = response.notification.request;
    if (handledId.current === identifier) return;
    handledId.current = identifier;

    const open = async () => {
      try {
        const route = await resolveNotificationRoute(content.data, queryClient);
        if (route?.target) {
          if (isExternalLink(route.target)) {
            await Linking.openURL(route.target.url);
          } else {
            navigation.navigate("Navbar", toNavbarParams(route.target));
          }
        }
        if (route?.unavailable) {
          toast(t("common.errors.notificationUnavailable"), "info");
        }
      } catch (error) {
        console.warn("[Notifications] Failed to open destination", error);
      } finally {
        // Consumed: it must not replay when this navigator remounts.
        await Notifications.clearLastNotificationResponseAsync();
      }
    };
    open();
  }, [response, navigation, queryClient, toast, t]);
};
