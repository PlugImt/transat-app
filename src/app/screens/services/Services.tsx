import Card from "@/components/common/Card";
import Page from "@/components/common/Page";
import WidgetCustomizationModal from "@/components/common/WidgetCustomizationModal";
import { Button } from "@/components/common/Button";
import { useServicePreferences } from "@/hooks/useWidgetPreferences";
import type { AppStackParamList } from "@/services/storage/types";
import type { ServicePreference } from "@/services/storage/widgetPreferences";
import { useTheme } from "@/themes/useThemeProvider";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Settings } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

interface DraggableServiceItem {
  id: string;
  key: string;
  component: React.ReactNode;
}

export const Services = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { enabledServices, services, updateOrder, loading } = useServicePreferences();
  
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  const getServiceComponent = (service: ServicePreference) => {
    return (
      <Card
        image={service.image}
        onPress={() => navigation.navigate(service.screen as any)}
      />
    );
  };

  const draggableServices: DraggableServiceItem[] = useMemo(() => {
    return enabledServices.map(service => ({
      id: service.id,
      key: service.id,
      component: getServiceComponent(service),
    }));
  }, [enabledServices, navigation]);

  const renderService = ({ item, drag, isActive }: RenderItemParams<DraggableServiceItem>) => {
    return (
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
  };

  const handleDragEnd = async ({ data }: { data: DraggableServiceItem[] }) => {
    const reorderedServices = data.map((item, index) => {
      const originalService = enabledServices.find(s => s.id === item.id);
      return originalService ? { ...originalService, order: index } : null;
    }).filter(Boolean) as ServicePreference[];

    await updateOrder(reorderedServices);
  };

  const handleCustomizationSave = async (updatedServices: ServicePreference[]) => {
    await updateOrder(updatedServices);
    setShowCustomizationModal(false);
  };

  const settingsButton = (
    <TouchableOpacity
      onPress={() => setShowCustomizationModal(true)}
    >
      <Settings color={theme.foreground} size={20} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Page title={t("services.title")}>
        <View />
      </Page>
    );
  }

  return (
    <>
      <Page 
        title={t("services.title")}
        about={settingsButton}
        footer={
          <Button
            label={t("common.customizeServices")}
            variant="outlined"
            onPress={() => setShowCustomizationModal(true)}
            className="mb-4"
          />
        }
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <DraggableFlatList
            data={draggableServices}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.key}
            renderItem={renderService}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 50 }}
          />
        </GestureHandlerRootView>
      </Page>

      <WidgetCustomizationModal
        visible={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        services={services}
        onUpdateServices={handleCustomizationSave}
        title={t("common.customizeServices")}
        type="services"
      />
    </>
  );
};

export default Services;
