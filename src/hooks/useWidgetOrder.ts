import { WidgetPreference } from "@/services/storage/widgetPreferences";
import { DraggableWidgetItem } from "@/types/widget";
import { useCallback, useMemo } from "react";

export const useWidgetOrder = (
	enabledWidgets: WidgetPreference[],
	updateOrder: (widgets: WidgetPreference[]) => Promise<void>,
	getWidgetComponent: (id: string) => React.ReactNode
) => {
	const items: DraggableWidgetItem[] = useMemo(() => {
		return enabledWidgets
			.map((widget) => ({
				id: widget.id,
				key: widget.id,
				component: getWidgetComponent(widget.id),
			}))
			.filter((item) => item.component !== null);
	}, [enabledWidgets, getWidgetComponent]);

	const reorder = useCallback(
		(data: DraggableWidgetItem[]) => {
		const reordered = data
			.map((item, index) => {
				const original = enabledWidgets.find((w) => w.id === item.id);
					return original ? { ...original, order: index } : null;
			})
			.filter(Boolean) as WidgetPreference[];

			return updateOrder(reordered);
		},
		[enabledWidgets, updateOrder]
	);

	return { items, reorder };
};
