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
  service: ServicePreference;
}

export const Services = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { enabledServices, services, updateOrder, loading } = useServicePreferences();
  
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  // Memoize the services prop for the modal
  const memoizedServicesForModal = useMemo(() => services, [services]);

  const draggableServices: DraggableServiceItem[] = useMemo(() => {
    return enabledServices.map(service => ({
      id: service.id,
      key: service.id,
      service: service,
    }));
  }, [enabledServices]);

  const renderService = ({ item, drag, isActive }: RenderItemParams<DraggableServiceItem>) => {
    return (
      <ScaleDecorator>
        <View
          style={{
            opacity: isActive ? 0.8 : 1,
            transform: [{ scale: isActive ? 1.02 : 1 }],
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate(item.service.screen as any)}
            onLongPress={drag}
            delayLongPress={200}
            activeOpacity={0.7}
          >
            <Card
              image={item.service.image}
              onPress={() => {}} // Empty function since we handle press in TouchableOpacity
            />
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = async ({ data }: { data: DraggableServiceItem[] }) => {
    const reorderedServices = data.map((item, index) => {
      return { ...item.service, order: index };
    });

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
            className="mb-4 mx-5"
          />
        }
        disableScroll
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <DraggableFlatList
            data={draggableServices}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.key}
            renderItem={renderService}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingTop: 10, paddingBottom: 50 }}
          />
        </GestureHandlerRootView>
      </Page>

      <WidgetCustomizationModal
        visible={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        widgets={[]}
        services={memoizedServicesForModal || []}
        onUpdateServices={handleCustomizationSave}
        title={t("common.customizeServices")}
        type="services"
      />
    </>
  );
};

export default Services;
