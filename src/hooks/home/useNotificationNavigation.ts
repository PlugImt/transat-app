import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import {
  declineWaitlist,
  reserveFromWaitlist,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { useToast } from "@/components/common/Toast";
import { QUERY_KEYS } from "@/constants";
import { useIsAcademics } from "@/hooks/account";
import { notificationLog } from "@/services/notifications/log";
import { openNotification } from "@/services/notifications/navigation";
import {
  isWaitlistAction,
  runWaitlistAction,
} from "@/services/notifications/waitlistActions";

/**
 * Opens the destination of a tapped push notification. Mount it where the app
 * navigator is ready (signed in, onboarding done): it covers taps made while the
 * app is open, in background, or closed (the response is queued until mounted).
 */
export const useNotificationNavigation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isAcademics = useIsAcademics();
  const response = Notifications.useLastNotificationResponse();
  const handledId = useRef<string | null>(null);
  const latestTap = useRef(0);
  const mounted = useRef(false);

  // Leaving the navigator (sign-out) makes any tap still being resolved obsolete.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!response) {
      handledId.current = null;
      return;
    }
    const actionId = response.actionIdentifier;
    const isDefaultTap = actionId === Notifications.DEFAULT_ACTION_IDENTIFIER;
    if (!isDefaultTap && !isWaitlistAction(actionId)) {
      return;
    }

    const { identifier, content } = response.notification.request;
    if (handledId.current === identifier) return;
    handledId.current = identifier;

    const tap = ++latestTap.current;
    const isCurrent = () => mounted.current && latestTap.current === tap;
    const open = async () => {
      try {
        if (isWaitlistAction(actionId)) {
          await runWaitlistAction(actionId, content.data, {
            reserve: reserveFromWaitlist,
            decline: declineWaitlist,
            refresh: () =>
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.reservation.all,
              }),
            notify: (message, tone) => toast(message, tone),
            translate: (key) => t(key),
            navigate: (target) => router.push(target),
            isCurrent,
          });
          return;
        }
        await openNotification(content.data, {
          queryClient,
          access: { isAcademics },
          navigate: (target) => router.push(target),
          openUrl: (url) => Linking.openURL(url),
          notifyUnavailable: () =>
            toast(t("common.errors.notificationUnavailable"), "info"),
          isCurrent,
        });
      } catch (error) {
        notificationLog.warn("failed to open notification destination", error);
      } finally {
        if (isCurrent()) {
          await Notifications.clearLastNotificationResponseAsync();
        }
      }
    };
    open();
  }, [response, router, queryClient, toast, t, isAcademics]);
};
