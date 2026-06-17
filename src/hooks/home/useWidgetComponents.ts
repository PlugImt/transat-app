import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { EventWidget } from "@/screens/services/events/widget/EventWidget";
import { HomeworkWidget } from "@/screens/services/homework/widget/HomeworkWidget";
import LaundryWidget from "@/screens/services/laundry/widget/LaundryWidget";
import { RestaurantWidget } from "@/screens/services/restaurant/widget/RestaurantWidget";
import TimetableWidget from "@/screens/services/schedule/widget/TimetableWidget";
import { WeatherWidget } from "@/screens/services/weather/widget/WeatherWidget";
import { DepartureWidget } from "@/screens/services/departure/widget/DepartureWidget";
import type { PreferenceId, WidgetType } from "@/services/storage/preferences";

export function useWidgetComponents() {
  const widgetComponents = React.useMemo(
    () => ({
      weather: () => React.createElement(WeatherWidget),
      departure: () => React.createElement(DepartureWidget),
      restaurant: () => React.createElement(RestaurantWidget),
      timetable: () => React.createElement(TimetableWidget),
      homework: () => React.createElement(HomeworkWidget),
      events: () => React.createElement(EventWidget),
      laundry: () => React.createElement(LaundryWidget),
    }),
    [],
  );
  const getWidgetComponent = useCallback(
    (widgetId: PreferenceId): ReactElement | null => {
      const Comp = widgetComponents[widgetId as WidgetType];
      return Comp ? Comp() : null;
    },
    [widgetComponents],
  );

  return { getWidgetComponent };
}
