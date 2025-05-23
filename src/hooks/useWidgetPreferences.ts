import {
  type ServicePreference,
  type ServiceSize,
  type WidgetPreference,
  getHomeWidgetPreferences,
  getServicePreferences,
  saveHomeWidgetPreferences,
  saveServicePreferences,
} from "@/services/storage/widgetPreferences";
import { useEffect, useState } from "react";

export const useHomeWidgetPreferences = () => {
  const [widgets, setWidgets] = useState<WidgetPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences().then((r) => r);
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const preferences = await getHomeWidgetPreferences();
      setWidgets(preferences.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error loading widget preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (newOrder: WidgetPreference[]) => {
    const updatedWidgets = newOrder.map((widget, index) => ({
      ...widget,
      order: index,
    }));
    setWidgets(updatedWidgets);
    await saveHomeWidgetPreferences(updatedWidgets);
  };

  const toggleWidget = async (widgetId: string) => {
    const updated = widgets.map((widget) =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget,
    );
    setWidgets(updated);
    await saveHomeWidgetPreferences(updated);
  };

  const enabledWidgets = widgets.filter((widget) => widget.enabled);

  return {
    widgets,
    enabledWidgets,
    loading,
    updateOrder,
    toggleWidget,
    refreshPreferences: loadPreferences,
  };
};

export const useServicePreferences = () => {
  const [services, setServices] = useState<ServicePreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences().then((r) => r);
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const preferences = await getServicePreferences();
      setServices(preferences.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error loading service preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (newOrder: ServicePreference[]) => {
    const updatedServices = newOrder.map((service, index) => ({
      ...service,
      order: index,
    }));
    setServices(updatedServices);
    await saveServicePreferences(updatedServices);
  };

  const toggleService = async (serviceId: string) => {
    const updated = services.map((service) =>
      service.id === serviceId
        ? { ...service, enabled: !service.enabled }
        : service,
    );
    setServices(updated);
    await saveServicePreferences(updated);
  };

  const toggleServiceSize = async (serviceId: string) => {
    const updated = services.map((service) =>
      service.id === serviceId
        ? {
            ...service,
            size: (service.size === "full" ? "half" : "full") as ServiceSize,
          }
        : service,
    );
    setServices(updated);
    await saveServicePreferences(updated);
  };

  const enabledServices = services.filter((service) => service.enabled);

  return {
    services,
    enabledServices,
    loading,
    updateOrder,
    toggleService,
    toggleServiceSize,
    refreshPreferences: loadPreferences,
  };
};
