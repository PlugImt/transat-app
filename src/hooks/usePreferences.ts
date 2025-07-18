import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getHomeWidgetPreferences,
  getServicePreferences,
  type Preference,
  saveHomeWidgetPreferences,
  saveServicePreferences,
} from "@/services/storage/widgetPreferences";

const usePreferences = (
  queryKey: string[],
  getFn: () => Promise<Preference[]>,
  saveFn: (prefs: Preference[]) => Promise<void>,
) => {
  const queryClient = useQueryClient();
  const { data: preferences = [], isPending: loading } = useQuery({
    queryKey,
    queryFn: getFn,
    select: (prefs) => prefs.sort((a, b) => a.order - b.order),
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (newOrder: Preference[]) => {
      const updated = newOrder.map((pref, index) => ({
        ...pref,
        order: index,
      }));
      await saveFn(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (prefId: string) => {
      const updated = preferences.map((pref) =>
        pref.id === prefId ? { ...pref, enabled: !pref.enabled } : pref,
      );
      await saveFn(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const enabledPreferences = preferences.filter((pref) => pref.enabled);

  return {
    preferences,
    enabledPreferences,
    loading,
    updateOrder: updateOrderMutation.mutateAsync,
    toggle: toggleMutation.mutateAsync,
    refreshPreferences: () => queryClient.invalidateQueries({ queryKey }),
  };
};

export const useHomeWidgetPreferences = () =>
  usePreferences(
    QUERY_KEYS.homeWidgetPreferences,
    getHomeWidgetPreferences,
    saveHomeWidgetPreferences,
  );

export const useServicePreferences = () => {
  const { actualTheme } = useTheme();

  return usePreferences(
    QUERY_KEYS.servicePreferences,
    () => getServicePreferences(actualTheme),
    saveServicePreferences,
  );
};
