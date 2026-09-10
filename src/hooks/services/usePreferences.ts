import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsStaff } from "@/hooks/account";
import {
  filterStaffPreferences,
  getHomeWidgetPreferences,
  getServicePreferences,
  mergeStaffPreferences,
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

  const resetPreferencesMutation = useMutation({
    mutationFn: async () => {
      const defaultPrefs = await getFn(t, actualTheme);
      const resetPrefs = defaultPrefs.map((pref, index) => ({
        ...pref,
        enabled: true,
        order: index,
      }));
      await saveFn(resetPrefs);
      return resetPrefs;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    preferences,
    enabledPreferences,
    isPending,
    updateOrder: updateOrderMutation.mutateAsync,
    toggle: toggleMutation.mutateAsync,
    refreshPreferences: () => queryClient.invalidateQueries({ queryKey }),
    resetPreferences: resetPreferencesMutation.mutateAsync,
  };
};

export const useHomeWidgetPreferences = () =>
  useRoleAwarePreferences(
    QUERY_KEYS.homeWidgetPreferences,
    getHomeWidgetPreferences,
    saveHomeWidgetPreferences,
  );

export const useServicePreferences = () => {
  return useRoleAwarePreferences(
    QUERY_KEYS.servicePreferences,
    getServicePreferences,
    saveServicePreferences,
  );
};

const useRoleAwarePreferences = (
  baseQueryKey: string[],
  getFn: (
    t: (key: string) => string,
    theme?: "light" | "dark",
  ) => Promise<Preference[]>,
  saveFn: (prefs: Preference[]) => Promise<void>,
) => {
  const isStaff = useIsStaff();
  const result = usePreferences(baseQueryKey, getFn, saveFn);

  if (!isStaff) return result;

  return {
    ...result,
    preferences: filterStaffPreferences(result.preferences),
    enabledPreferences: filterStaffPreferences(result.enabledPreferences),
    updateOrder: (visiblePreferences: Preference[]) =>
      result.updateOrder(
        mergeStaffPreferences(visiblePreferences, result.preferences),
      ),
    resetPreferences: async () =>
      filterStaffPreferences(await result.resetPreferences()),
  };
};
