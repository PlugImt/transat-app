import RestaurantWidget from "@/components/custom/widget/RestaurantWidget";
import EmploiDuTempsWidget from "@/components/custom/widget/EmploiDuTempsWidget";
import WashingMachineWidget from "@/components/custom/widget/WashingMachineWidget";
import { WeatherWidget } from "@/app/screens/home/components";

export const getWidgetComponent = (id: string) => {
  switch (id) {
    case "weather":
      return <WeatherWidget />;
    case "restaurant":
      return <RestaurantWidget />;
    case "emploiDuTemps":
      return <EmploiDuTempsWidget />;
    case "washingMachine":
      return <WashingMachineWidget />;
    default:
      return null;
  }
};