import AsyncStorage from "@react-native-async-storage/async-storage";

export type WidgetType =
  | "weather"
  | "restaurant"
  | "emploiDuTemps"
  | "washingMachine";
export type ServiceType =
  | "washingMachine"
  | "restaurant"
  | "emploiDuTemps"
  | "traq"
  | "olimtpe";
export type ServiceSize = "full" | "half";

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
  size: ServiceSize;
  // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
  image: any;
  screen: string;
}

const HOME_WIDGETS_KEY = "home_widgets_preferences";
const SERVICES_KEY = "services_preferences";

const defaultHomeWidgets: WidgetPreference[] = [
  { id: "weather", name: "Weather", enabled: true, order: 0 },
  { id: "restaurant", name: "Restaurant", enabled: true, order: 1 },
  { id: "emploiDuTemps", name: "Emploi du Temps", enabled: true, order: 2 },
  { id: "washingMachine", name: "Washing Machine", enabled: true, order: 3 },
];

const defaultServices: ServicePreference[] = [
  {
    id: "washingMachine",
    name: "Washing Machine",
    enabled: true,
    order: 0,
    size: "full",
    image: require("@/assets/images/Logos/machine_large.png"),
    screen: "WashingMachine",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    enabled: true,
    order: 1,
    size: "full",
    image: require("@/assets/images/Logos/restaurant_large.png"),
    screen: "Restaurant",
  },
  {
    id: "emploiDuTemps",
    name: "Emploi du Temps",
    enabled: true,
    order: 2,
    size: "full",
    image: require("@/assets/images/Logos/restaurant_large.png"),
    screen: "EmploiDuTemps",
  },
  {
    id: "traq",
    name: "Traq",
    enabled: true,
    order: 3,
    size: "full",
    image: require("@/assets/images/Logos/traq_large.png"),
    screen: "Traq",
  },
  {
    id: "olimtpe",
    name: "OL'IMT'PE",
    enabled: true,
    order: 4,
    size: "full",
    image: require("@/assets/images/Logos/olimtpe.png"),
    screen: "Olimtpe",
  },
];

export const getHomeWidgetPreferences = async (): Promise<
  WidgetPreference[]
> => {
  try {
    const stored = await AsyncStorage.getItem(HOME_WIDGETS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultHomeWidgets;
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
    if (stored) {
      const storedServices = JSON.parse(stored);
      // Check if the new olimtpe service exists, if not add it
      const hasOlimtpe = storedServices.some(
        (service: ServicePreference) => service.id === "olimtpe",
      );
      if (!hasOlimtpe) {
        const olimtpeService = defaultServices.find(
          (service) => service.id === "olimtpe",
        );
        if (olimtpeService) {
          storedServices.push(olimtpeService);
          // Save the updated services back to storage
          await AsyncStorage.setItem(
            SERVICES_KEY,
            JSON.stringify(storedServices),
          );
        }
      }
      return storedServices;
    }
    return defaultServices;
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
