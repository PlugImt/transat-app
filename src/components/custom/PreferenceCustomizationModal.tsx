import { GripVertical } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Switch, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  type DragEndParams,
  type RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { Preference } from "@/services/storage/preferences";

import { hapticFeedback } from "@/utils/haptics.utils";

interface PreferenceCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  items: Preference[];
  title: string;
  onUpdate: (items: Preference[]) => void;
  onReset?: () => Promise<Preference[]>;
}

const PreferenceCustomizationModal = ({
  visible,
  onClose,
  onUpdate,
  items: initialItems = [],
  title,
  onReset,
}: PreferenceCustomizationModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [localItems, setLocalItems] = useState<Preference[]>(initialItems);

  useEffect(() => {
    if (visible) {
      setLocalItems(initialItems);
    }
  }, [visible, initialItems]);

  const handleClose = () => {
    setLocalItems(initialItems);
    onClose();
  };

  const handleSave = () => {
    const orderedItems: Preference[] = localItems
      .map((item, index) => ({ ...item, order: index }))
      .sort((a, b) => a.order - b.order);
    onUpdate(orderedItems);
    setLocalItems(orderedItems);
    onClose();
  };

  const toggleEnabled = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const handleDragMove = () => {
    hapticFeedback.light();
  };

  const handleDragStart = () => {
    hapticFeedback.medium();
  };

  const handleDragEnd = (data: DragEndParams<Preference>) => {
    setLocalItems(data.data);
    hapticFeedback.medium();
  };

  const handleReset = async () => {
    try {
      if (!onReset) return;
      const defaultPreferences = await onReset();
      onUpdate(defaultPreferences);
      setLocalItems(defaultPreferences);

      hapticFeedback.medium();
    } catch (error) {
      console.error("Error resetting preferences:", error);
    }
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Preference>) => (
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
            backgroundColor: theme.card,
            opacity: item.enabled ? 1 : 0.5,
          }}
        >
          <View className="flex-row items-center gap-2">
            <GripVertical size={20} color={theme.muted} />
            <Text color="text">{item.name}</Text>
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
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView>
        <Page disableScroll title={title} className="py-4 flex-1">
          <Text className="px-2">{t("common.customizeHint")}</Text>

          <View className="justify-between flex-1">
            <DraggableFlatList
              data={localItems}
              onDragBegin={handleDragStart}
              onDragEnd={handleDragEnd}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              onPlaceholderIndexChange={handleDragMove}
              className="overflow-visible"
              ListFooterComponent={() =>
                onReset && (
                  <Button
                    label={t("common.reset")}
                    onPress={handleReset}
                    size="sm"
                    variant="ghost"
                  />
                )
              }
            />
            <View className="flex-row items-center gap-2">
              <Button
                label={t("common.cancel")}
                variant="secondary"
                onPress={handleClose}
                className="flex-1"
              />
              <Button
                label={t("common.save")}
                onPress={handleSave}
                className="flex-1"
              />
            </View>
          </View>
        </Page>
      </GestureHandlerRootView>
    </Modal>
  );
};

interface PreferenceCustomizationButtonProps {
  items: Preference[];
  title: string;
  children: React.ReactElement<{ onPress?: () => void }>;
  onUpdate: (items: Preference[]) => void;
  onReset?: () => Promise<Preference[]>;
}

export const PreferenceCustomizationButton = ({
  items,
  title,
  children,
  onUpdate,
  onReset,
}: PreferenceCustomizationButtonProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement(children, { onPress: () => setVisible(true) })}
      <PreferenceCustomizationModal
        visible={visible}
        onClose={() => setVisible(false)}
        items={items}
        title={title}
        onUpdate={onUpdate}
        onReset={onReset}
      />
    </>
  );
};

export default PreferenceCustomizationModal;
