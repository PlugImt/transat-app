import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { HomeworkWidget } from "@/app/screens/services/homework/widget/HomeworkWidget";
import LaundryWidget from "@/app/screens/services/laundry/widget/LaundryWidget";
import { RestaurantWidget } from "@/app/screens/services/restaurant/widget/RestaurantWidget";
import TimetableWidget from "@/app/screens/services/schedule/widget/TimetableWidget";
import { WeatherWidget } from "@/app/screens/services/weather/widget/WeatherWidget";

const widgetComponents: { [key: string]: () => ReactElement } = {
  weather: () => React.createElement(WeatherWidget),
  restaurant: () => React.createElement(RestaurantWidget),
  timetable: () => React.createElement(TimetableWidget),
  homework: () => React.createElement(HomeworkWidget),
  laundry: () => React.createElement(LaundryWidget),
};

export function useWidgetComponents() {
  const getWidgetComponent = useCallback(
    (widgetId: string): ReactElement | null => {
      const Comp = widgetComponents[widgetId];
      return Comp ? Comp() : null;
    },
    [],
  );

  return { getWidgetComponent };
}
