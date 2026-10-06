import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getNotificationPreferences,
  setNotificationPreference,
} from "@/api/endpoints/notification";
import { useToast } from "@/components/common/Toast";
import { QUERY_KEYS } from "@/constants";
import type { NotificationPreferences, NotificationType } from "@/dto";

/** Per-category notification choices, stored on the server per user. */
const useNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const query = useQuery({
    queryKey: QUERY_KEYS.notification,
    queryFn: getNotificationPreferences,
  });

  const mutation = useMutation({
    mutationFn: ({
      service,
      enabled,
    }: {
      service: NotificationType;
      enabled: boolean;
    }) => setNotificationPreference(service, enabled),
    onMutate: async ({ service, enabled }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notification });
      const previous = queryClient.getQueryData<NotificationPreferences>(
        QUERY_KEYS.notification,
      );
      queryClient.setQueryData<NotificationPreferences>(
        QUERY_KEYS.notification,
        { ...previous, [service]: enabled },
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(QUERY_KEYS.notification, context?.previous);
      toast(t("settings.notifications.updateError"), "destructive");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification }),
  });

  return {
    data: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    setPreference: (service: NotificationType, enabled: boolean) =>
      mutation.mutate({ service, enabled }),
    /** Category whose change is being saved, to disable only its switch. */
    savingService: mutation.isPending ? mutation.variables.service : null,
  };
};

export default useNotification;
