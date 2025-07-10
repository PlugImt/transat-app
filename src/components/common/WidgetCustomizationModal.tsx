import { GripVertical } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Switch, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/common/Button";
import { Page } from "@/components/common/Page";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type {
  ServicePreference,
  WidgetPreference,
} from "@/services/storage/widgetPreferences";

type CustomizableItem = WidgetPreference | ServicePreference;

interface WidgetCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  items: CustomizableItem[];
  onUpdate: (items: CustomizableItem[]) => void;
  title: string;
}

const WidgetCustomizationModal = ({
  visible,
  onClose,
  items: initialItems = [],
  onUpdate,
  title,
}: WidgetCustomizationModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [localItems, setLocalItems] =
    useState<CustomizableItem[]>(initialItems);

  const handleSave = () => {
    const orderedItems = localItems
      .map((item, index) => ({ ...item, order: index }))
      .sort((a, b) => a.order - b.order);
    onUpdate(orderedItems);
    onClose();
  };

  const toggleEnabled = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const getDisplayName = (item: CustomizableItem) => {
    const translations: Record<string, string> = {
      weather: t("services.weather") || "Weather",
      restaurant: t("services.restaurant.title"),
      timetable: t("services.timetable.title"),
      homework: t("services.homework.title"),
      washingMachine: t("services.washingMachine.title"),
      traq: t("services.traq.title"),
      olimtpe: t("services.olimtpe.title"),
    };
    return translations[item.id] || item.name;
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<CustomizableItem>) => (
    <ScaleDecorator key={item.id}>
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={200}
        style={{
          opacity: isActive ? 0.5 : 1,
          transform: [{ scale: isActive ? 1.02 : 1 }],
        }}
      >
        <View
          className="flex-row items-center justify-between p-4 rounded-lg mb-2"
          style={{
            backgroundColor: item.enabled ? theme.card : theme.backdrop,
          }}
        >
          <View className="flex-row items-center gap-2">
            <GripVertical size={20} color={theme.muted} />
            <Text
              style={{
                color: item.enabled ? theme.text : theme.textSecondary,
              }}
            >
              {getDisplayName(item)}
            </Text>
          </View>
          <Switch
            value={item.enabled}
            onValueChange={() => toggleEnabled(item.id)}
            trackColor={{ false: theme.backdrop, true: theme.primary }}
            thumbColor={item.enabled ? theme.background : theme.muted}
          />
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView>
        <Page disableScroll={true} title={title} className="py-4">
          <Text
            style={{
              color: theme.text,
            }}
            className="px-2"
          >
            {t("common.customizeHint")}
          </Text>

          <View className="justify-between flex-1">
            <DraggableFlatList
              data={localItems}
              onDragEnd={({ data }) => setLocalItems(data)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              className="overflow-visible"
            />
            <View className="gap-2">
              <Button label={t("common.save")} onPress={handleSave} />
              <Button
                label={t("common.cancel")}
                variant="outlined"
                onPress={onClose}
              />
            </View>
          </View>
        </Page>
      </GestureHandlerRootView>
    </Modal>
  );
};

// Composant wrapper avec bouton intégré
interface WidgetCustomizationButtonProps {
  items: CustomizableItem[];
  onUpdate: (items: CustomizableItem[]) => void;
  title: string;
  buttonLabel: string;
  variant?: "ghost" | "outlined" | "default";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const WidgetCustomizationButton = ({
  items,
  onUpdate,
  title,
  buttonLabel,
  variant = "ghost",
  size = "sm",
  className,
}: WidgetCustomizationButtonProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        label={buttonLabel}
        variant={variant}
        size={size}
        onPress={() => setVisible(true)}
        className={className}
      />
      <WidgetCustomizationModal
        visible={visible}
        onClose={() => setVisible(false)}
        items={items}
        onUpdate={onUpdate}
        title={title}
      />
    </>
  );
};

export default WidgetCustomizationModal;
