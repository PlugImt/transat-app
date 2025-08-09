import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getHomeWidgetPreferences,
  getServicePreferences,
  type Preference,
  saveHomeWidgetPreferences,
  saveServicePreferences,
} from "@/services/storage/preferences";

const usePreferences = (
  baseQueryKey: string[],
  getFn: (
    t: (key: string) => string,
    theme?: "light" | "dark",
  ) => Promise<Preference[]>,
  saveFn: (prefs: Preference[]) => Promise<void>,
) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { actualTheme } = useTheme();

  // On inclut le theme pour que le hook se réexécute quand le thème change
  const queryKey = [...baseQueryKey, i18n.language, actualTheme].filter(
    Boolean,
  );

  const { data: preferences = [], isPending } = useQuery({
    queryKey,
    queryFn: () => getFn(t, actualTheme),
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
    isPending,
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
  return usePreferences(
    QUERY_KEYS.servicePreferences,
    getServicePreferences,
    saveServicePreferences,
  );
};
