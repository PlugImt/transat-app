import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationGroups, setNotificationPreference } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { NotificationGroup, NotificationType } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";

const STORAGE_KEY = "notification-groups";

const withEnabled = (
  groups: NotificationGroup[],
  service: NotificationType,
  enabled: boolean,
): NotificationGroup[] =>
  groups.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.service === service ? { ...item, enabled } : item,
    ),
  }));

const useNotification = () => {
  const queryClient = useQueryClient();

  /**
   * Récupérer les catégories de notification (liste pilotée par le serveur)
   */
  const notificationsQuery = useQuery<NotificationGroup[]>({
    queryKey: [QUERY_KEYS.notification],
    queryFn: async () => {
      try {
        const groups = await getNotificationGroups();
        await storage.set(STORAGE_KEY, groups);
        return groups;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return ((await storage.get(STORAGE_KEY)) as NotificationGroup[]) || [];
      }
    },
  });

  /**
   * Active ou désactive une catégorie de notification
   * @param service Catégorie à modifier
   */
  const toggleNotification = useMutation({
    mutationFn: async ({
      service,
      enabled,
    }: {
      service: NotificationType;
      enabled: boolean;
    }) => setNotificationPreference(service, enabled),

    // Mise à jour optimiste
    onMutate: async ({ service, enabled }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.notification] });

      const previous =
        queryClient.getQueryData<NotificationGroup[]>([
          QUERY_KEYS.notification,
        ]) ?? [];

      queryClient.setQueryData(
        [QUERY_KEYS.notification],
        withEnabled(previous, service, enabled),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData([QUERY_KEYS.notification], context.previous);
      }
    },
    onSuccess: async ({ service, enabled }) => {
      const current =
        queryClient.getQueryData<NotificationGroup[]>([
          QUERY_KEYS.notification,
        ]) ?? [];
      const next = withEnabled(current, service, enabled);

      await storage.set(STORAGE_KEY, next);
      queryClient.setQueryData([QUERY_KEYS.notification], next);
    },
  });

  return {
    data: notificationsQuery.data,
    isPending: notificationsQuery.isPending,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,

    toggleNotification: toggleNotification.mutate,
    isToggling: toggleNotification.isPending,
  };
};

export default useNotification;
