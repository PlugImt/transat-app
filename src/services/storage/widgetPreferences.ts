import AsyncStorage from "@react-native-async-storage/async-storage";
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
}

const HOME_WIDGETS_KEY = "home_widgets_preferences";
const SERVICES_KEY = "services_preferences";

const defaultHomeWidgets: Preference[] = [
  { id: "weather", name: "Weather", enabled: true, order: 0 },
  { id: "restaurant", name: "Restaurant", enabled: true, order: 1 },
  { id: "timetable", name: "Timetable", enabled: true, order: 2 },
  { id: "washingMachine", name: "Washing Machine", enabled: true, order: 3 },
  { id: "homework", name: "Homework", enabled: true, order: 4 },
];

const defaultServices: Preference[] = [
  {
    id: "washingMachine",
    name: "Washing Machine",
    enabled: true,
    order: 0,
    image: require("@/assets/images/Logos/machine_large.png"),
    screen: "WashingMachine",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    enabled: true,
    order: 1,
    image: require("@/assets/images/Logos/restaurant_large.png"),
    screen: "Restaurant",
  },
  {
    id: "timetable",
    name: "Timetable",
    enabled: true,
    order: 2,
    image: require("@/assets/images/Logos/edt_large.png"),
    screen: "Timetable",
  },
  {
    id: "homework",
    name: "Homework",
    enabled: true,
    order: 3,
    image: require("@/assets/images/Logos/devoirs_large.png"),
    screen: "Homework",
  },
  {
    id: "traq",
    name: "Traq",
    enabled: true,
    order: 4,
    image: require("@/assets/images/Logos/traq_large.png"),
    screen: "Traq",
  },
  {
    id: "olimtpe",
    name: "OL'IMT'PE",
    enabled: true,
    order: 5,
    image: require("@/assets/images/Logos/olimtpe.png"),
    screen: "Olimtpe",
  },
];

const getPreferences = async (
  key: string,
  defaultPrefs: Preference[],
): Promise<Preference[]> => {
  try {
    const stored = await AsyncStorage.getItem(key);
    const parsed: Preference[] = JSON.parse(stored || "[]");
    const newPrefs = defaultPrefs.filter(
      (pref) => !parsed.some((p: Preference) => p.id === pref.id),
    );
    return [...parsed, ...newPrefs];
  } catch (error) {
    console.error(`Error getting preferences for ${key}:`, error);
    return defaultPrefs;
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
  getPreferences(HOME_WIDGETS_KEY, defaultHomeWidgets);
export const saveHomeWidgetPreferences = async (
  preferences: Preference[],
): Promise<void> => savePreferences(HOME_WIDGETS_KEY, preferences);
export const getServicePreferences = async (): Promise<Preference[]> =>
  getPreferences(SERVICES_KEY, defaultServices);
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
