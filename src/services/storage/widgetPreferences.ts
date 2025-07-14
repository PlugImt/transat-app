import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";
import type { ImageSourcePropType } from "react-native";

export type WidgetType =
  | "weather"
  | "restaurant"
  | "timetable"
  | "homework"
  | "washingMachine";
export type ServiceType =
  | "washingMachine"
  | "restaurant"
  | "timetable"
  | "homework"
  | "traq"
  | "olimtpe";

export type PreferenceId = WidgetType | ServiceType;

export interface Preference {
  id: PreferenceId;
  name: string;
  enabled: boolean;
  order: number;
  image?: ImageSourcePropType;
  screen?: string;
  description?: string;
}

const HOME_WIDGETS_KEY = "home_widgets_preferences";
const SERVICES_KEY = "services_preferences";

const getDefaultHomeWidgets = (): Preference[] => [
  { id: "weather", name: t("services.weather.title"), enabled: true, order: 0 },
  {
    id: "restaurant",
    name: t("services.restaurant.title"),
    enabled: true,
    order: 1,
  },
  {
    id: "washingMachine",
    name: t("services.washingMachine.title"),
    enabled: true,
    order: 3,
  },
];

const getDefaultServices = (): Preference[] => [
  {
    id: "washingMachine",
    name: t("services.washingMachine.title"),
    enabled: true,
    order: 0,
    image: require("@/assets/images/services/washing_machine_dark.png"),
    screen: "WashingMachine",
    description: t("services.washingMachine.description"),
  },
  {
    id: "restaurant",
    name: t("services.restaurant.title"),
    enabled: true,
    order: 1,
    image: require("@/assets/images/services/restaurant.png"),
    screen: "Restaurant",
    description: t("services.restaurant.description"),
  },
  {
    id: "traq",
    name: t("services.traq.title"),
    enabled: true,
    order: 4,
    image: require("@/assets/images/services/traq.png"),
    screen: "Traq",
    description: t("services.traq.description"),
  },
];

const getPreferences = async (
  key: string,
  getDefaultPrefs: () => Preference[],
): Promise<Preference[]> => {
  try {
    const stored = await AsyncStorage.getItem(key);
    const parsed: Preference[] = JSON.parse(stored || "[]");
    const defaultPrefs = getDefaultPrefs();
    const newPrefs = defaultPrefs.filter(
      (pref) => !parsed.some((p: Preference) => p.id === pref.id),
    );
    return [...parsed, ...newPrefs];
  } catch (error) {
    console.error(`Error getting preferences for ${key}:`, error);
    return getDefaultPrefs();
  }
};

const savePreferences = async (
  key: string,
  preferences: Preference[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.error(`Error saving preferences for ${key}:`, error);
  }
};

export const getHomeWidgetPreferences = async (): Promise<Preference[]> =>
  getPreferences(HOME_WIDGETS_KEY, getDefaultHomeWidgets);

export const saveHomeWidgetPreferences = async (
  preferences: Preference[],
): Promise<void> => savePreferences(HOME_WIDGETS_KEY, preferences);

export const getServicePreferences = async (): Promise<Preference[]> =>
  getPreferences(SERVICES_KEY, getDefaultServices);

export const saveServicePreferences = async (
  preferences: Preference[],
): Promise<void> => savePreferences(SERVICES_KEY, preferences);

export const resetToDefault = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([HOME_WIDGETS_KEY, SERVICES_KEY]);
  } catch (error) {
    console.error("Error resetting preferences:", error);
  }
};
