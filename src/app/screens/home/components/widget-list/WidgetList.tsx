import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "@/components/common/Button";
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from "react-native-draggable-flatlist";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { DraggableWidgetItem } from "@/types/widget";

interface WidgetListProps {
    data: DraggableWidgetItem[];
    onDragEnd: (params: { data: DraggableWidgetItem[] }) => void;
    onCustomize: () => void;
};

export const WidgetList = ({ data, onDragEnd, onCustomize }: WidgetListProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const renderItem = ({ item, drag, isActive }: RenderItemParams<DraggableWidgetItem>) => (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                delayLongPress={200}
                style={{
                opacity: isActive ? 0.8 : 1,
                transform: [{ scale: isActive ? 1.02 : 1 }],
                }}
                activeOpacity={1}
            >
                {item.component}
            </TouchableOpacity>
        </ScaleDecorator>
    );

    return (
        <DraggableFlatList
            data={data}
            onDragEnd={onDragEnd}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            showsVerticalScrollIndicator
            contentContainerStyle={{ gap: 24, paddingTop: 10, paddingBottom: 12 }}
            ListEmptyComponent={
                <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
                <Text style={{ fontSize: 16, color: theme.text }}>{t("common.noWidgetsEnabled")}</Text>
                <Button label={t("common.customizeWidgets")} onPress={onCustomize} variant="link" className="mt-4" />
                </View>
            }
            ListFooterComponent={
                <View style={{ alignItems: "center", width: "100%", marginVertical: 20 }}>
                <Button label={t("common.customizeWidgets")} variant="ghost" onPress={onCustomize} size="sm" />
                </View>
            }
        />
    );
};