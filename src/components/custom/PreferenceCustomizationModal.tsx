import { GripVertical } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Switch, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { Preference } from "@/services/storage/preferences";

interface PreferenceCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  items: Preference[];
  title: string;
  onUpdate: (items: Preference[]) => void;
}

const PreferenceCustomizationModal = ({
  visible,
  onClose,
  onUpdate,
  items: initialItems = [],
  title,
}: PreferenceCustomizationModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [localItems, setLocalItems] = useState<Preference[]>(initialItems);

  const handleSave = () => {
    const orderedItems: Preference[] = localItems
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
            backgroundColor: item.enabled ? theme.card : theme.backdrop,
          }}
        >
          <View className="flex-row items-center gap-2">
            <GripVertical size={20} color={theme.muted} />
            <Text color={item.enabled ? "text" : "muted"}>{item.name}</Text>
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
        <Page disableScroll title={title} className="py-4 flex-1">
          <Text className="px-2">{t("common.customizeHint")}</Text>

          <View className="justify-between flex-1">
            <DraggableFlatList
              data={localItems}
              onDragEnd={({ data }) => setLocalItems(data)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
            <View className="gap-2">
              <Button label={t("common.save")} onPress={handleSave} />
              <Button
                label={t("common.cancel")}
                variant="secondary"
                onPress={onClose}
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
}

export const PreferenceCustomizationButton = ({
  items,
  title,
  children,
  onUpdate,
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
      />
    </>
  );
};

export default PreferenceCustomizationModal;
