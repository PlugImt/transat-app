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

export interface WidgetPreference {
  id: WidgetType;
  name: string;
  enabled: boolean;
  order: number;
}

export interface ServicePreference {
  id: ServiceType;
  name: string;
  enabled: boolean;
  order: number;
  image: ImageSourcePropType;
  screen: string;
}

const HOME_WIDGETS_KEY = "home_widgets_preferences";
const SERVICES_KEY = "services_preferences";

const defaultHomeWidgets: WidgetPreference[] = [
  { id: "weather", name: "Weather", enabled: true, order: 0 },
  { id: "restaurant", name: "Restaurant", enabled: true, order: 1 },
  { id: "timetable", name: "Timetable", enabled: true, order: 2 },
  { id: "washingMachine", name: "Washing Machine", enabled: true, order: 3 },
  { id: "homework", name: "Homework", enabled: true, order: 4 },
];

const defaultServices: ServicePreference[] = [
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

export const getHomeWidgetPreferences = async (): Promise<
  WidgetPreference[]
> => {
  try {
    const stored = await AsyncStorage.getItem(HOME_WIDGETS_KEY);
    const parsed: WidgetPreference[] = JSON.parse(stored || "[]");

    const newWidgets = defaultHomeWidgets.filter(
      (widget) => !parsed.some((w: WidgetPreference) => w.id === widget.id),
    );

    return [...parsed, ...newWidgets];
  } catch (error) {
    console.error("Error getting home widget preferences:", error);
    return defaultHomeWidgets;
  }
};

export const saveHomeWidgetPreferences = async (
  preferences: WidgetPreference[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving home widget preferences:", error);
  }
};

export const getServicePreferences = async (): Promise<ServicePreference[]> => {
  try {
    const stored = await AsyncStorage.getItem(SERVICES_KEY);
    const parsed: ServicePreference[] = JSON.parse(stored || "[]");

    const newServices = defaultServices.filter(
      (service) => !parsed.some((s: ServicePreference) => s.id === service.id),
    );

    return [...parsed, ...newServices];
  } catch (error) {
    console.error("Error getting service preferences:", error);
    return defaultServices;
  }
};

export const saveServicePreferences = async (
  preferences: ServicePreference[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(SERVICES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving service preferences:", error);
  }
};

export const resetToDefault = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HOME_WIDGETS_KEY);
    await AsyncStorage.removeItem(SERVICES_KEY);
  } catch (error) {
    console.error("Error resetting preferences:", error);
  }
};
