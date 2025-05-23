import { Button } from "@/components/common/Button";
import { useTheme } from "@/themes/useThemeProvider";
import type { WidgetPreference, ServicePreference } from "@/services/storage/widgetPreferences";
import { BlurView } from "expo-blur";
import { Check, Settings, X, Plus, Minus } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Switch,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface WidgetCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  widgets: WidgetPreference[];
  services: ServicePreference[];
  onUpdateWidgets?: (widgets: WidgetPreference[]) => void;
  onUpdateServices?: (services: ServicePreference[]) => void;
  title: string;
  type: 'widgets' | 'services';
}

const WidgetCustomizationModal = ({
  visible,
  onClose,
  widgets: initialWidgets = [],
  services: initialServices = [],
  onUpdateWidgets,
  onUpdateServices,
  title,
  type,
}: WidgetCustomizationModalProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [localWidgets, setLocalWidgets] = useState<WidgetPreference[]>([]);
  const [localServices, setLocalServices] = useState<ServicePreference[]>([]);
  const { height: screenHeight } = Dimensions.get("window");
  const statusBarHeight = Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0;
  
  // This ref tracks if the modal was previously visible
  const wasPreviouslyVisible = useRef(false);

  useEffect(() => {
    // If the modal is now visible AND it was not previously visible, then it's just been opened.
    if (visible && !wasPreviouslyVisible.current) {
      setLocalWidgets([...initialWidgets].sort((a, b) => a.order - b.order));
      setLocalServices([...initialServices].sort((a, b) => a.order - b.order));
    }
    // Update the ref to the current visibility state for the next render.
    wasPreviouslyVisible.current = visible;
  }, [visible, initialWidgets, initialServices]);

  const handleSave = () => {
    if (type === 'widgets' && onUpdateWidgets) {
      // Reorder the widgets based on their order property
      const orderedWidgets = localWidgets
        .map((widget, index) => ({ ...widget, order: index }))
        .sort((a, b) => a.order - b.order);
      onUpdateWidgets(orderedWidgets);
    } else if (type === 'services' && onUpdateServices) {
      // Reorder the services based on their order property
      const orderedServices = localServices
        .map((service, index) => ({ ...service, order: index }))
        .sort((a, b) => a.order - b.order);
      onUpdateServices(orderedServices);
    }
    onClose();
  };

  const toggleWidgetEnabled = (id: string) => {
    if (type === 'widgets') {
      setLocalWidgets(prev => 
        prev.map(widget => 
          widget.id === id 
            ? { ...widget, enabled: !widget.enabled }
            : widget
        )
      );
    } else {
      setLocalServices(prev => 
        prev.map(service => 
          service.id === id 
            ? { ...service, enabled: !service.enabled }
            : service
        )
      );
    }
  };

  const handleReorder = (newData: WidgetPreference[] | ServicePreference[]) => {
    if (type === 'widgets') {
      setLocalWidgets(newData as WidgetPreference[]);
    } else {
      setLocalServices(newData as ServicePreference[]);
    }
  };

  const getDisplayName = (item: WidgetPreference | ServicePreference) => {
    if (type === 'widgets') {
      switch (item.id) {
        case 'weather':
          return t('services.weather') || 'Weather';
        case 'restaurant':
          return t('services.restaurant.title');
        case 'washingMachine':
          return t('services.washingMachine.title');
        default:
          return item.name;
      }
    } else {
      switch (item.id) {
        case 'washingMachine':
          return t('services.washingMachine.title');
        case 'restaurant':
          return t('services.restaurant.title');
        case 'traq':
          return t('services.traq.title');
        default:
          return item.name;
      }
    }
  };

  const renderWidgetItem = ({ item, drag, isActive }: RenderItemParams<WidgetPreference>) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={200}
        style={{
          opacity: isActive ? 0.8 : 1,
          transform: [{ scale: isActive ? 1.02 : 1 }],
        }}
      >
        <View className={`flex-row items-center justify-between p-4 rounded-lg mb-2 ${
          item.enabled ? 'bg-card' : 'bg-card opacity-60'
        }`}>
          <View className="flex-row items-center flex-1">
            <Settings size={20} color={theme.foreground} style={{ marginRight: 12 }} />
            <Text className={`font-medium flex-1 ${
              item.enabled ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {getDisplayName(item)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => toggleWidgetEnabled(item.id)}
              style={{ marginRight: 8 }}
            >
              {item.enabled ? (
                <Minus size={20} color="#F44336" />
              ) : (
                <Plus size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleWidgetEnabled(item.id)}
              trackColor={{ false: theme.muted, true: theme.primary }}
              thumbColor={item.enabled ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  const renderServiceItem = ({ item, drag, isActive }: RenderItemParams<ServicePreference>) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={200}
        style={{
          opacity: isActive ? 0.8 : 1,
          transform: [{ scale: isActive ? 1.02 : 1 }],
        }}
      >
        <View className={`flex-row items-center justify-between p-4 rounded-lg mb-2 ${
          item.enabled ? 'bg-card' : 'bg-card opacity-60'
        }`}>
          <View className="flex-row items-center flex-1">
            <Settings size={20} color={theme.foreground} style={{ marginRight: 12 }} />
            <Text className={`font-medium flex-1 ${
              item.enabled ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {getDisplayName(item)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => toggleWidgetEnabled(item.id)}
              style={{ marginRight: 8 }}
            >
              {item.enabled ? (
                <Minus size={20} color="#F44336" />
              ) : (
                <Plus size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleWidgetEnabled(item.id)}
              trackColor={{ false: theme.muted, true: theme.primary }}
              thumbColor={item.enabled ? "#fff" : "#f4f3f4"}
            />
          </View>
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
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <BlurView
          intensity={50}
          tint="dark"
          style={{
            paddingTop: statusBarHeight + 10,
            paddingBottom: 10,
            paddingHorizontal: 20,
            backgroundColor: "#030202E5",
          }}
        >
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose}>
              <X color={theme.foreground} size={24} />
            </TouchableOpacity>
            <Text className="h2 text-foreground">{title}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Check color={theme.primary} size={24} />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Content */}
        <View style={{ flex: 1, padding: 20, marginTop: 10 }}>
          <Text className="text-foreground mb-4">
            {t("common.customizeHint")}
          </Text>
          
          <GestureHandlerRootView style={{ flex: 1 }}>
            {type === 'widgets' ? (
              <DraggableFlatList
                data={localWidgets}
                onDragEnd={({ data }) => handleReorder(data)}
                keyExtractor={(item) => item.id}
                renderItem={renderWidgetItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            ) : (
              <DraggableFlatList
                data={localServices}
                onDragEnd={({ data }) => handleReorder(data)}
                keyExtractor={(item) => item.id}
                renderItem={renderServiceItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </GestureHandlerRootView>
        </View>

        {/* Footer */}
        <View className="p-5 border-t border-muted">
          <Button
            label={t("common.save")}
            onPress={handleSave}
            className="mb-2"
          />
          <Button
            label={t("common.cancel")}
            variant="outlined"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

export default WidgetCustomizationModal; 