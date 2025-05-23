import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import FlexibleGrid from "@/components/common/FlexibleGrid";
import Page from "@/components/common/Page";
import WidgetCustomizationModal from "@/components/common/WidgetCustomizationModal";
import { useServicePreferences } from "@/hooks/useWidgetPreferences";
import type { AppStackParamList } from "@/services/storage/types";
import type { ServicePreference } from "@/services/storage/widgetPreferences";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { enabledServices, services, updateOrder, loading } =
    useServicePreferences();

  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  // Memoize the services prop for the modal
  const memoizedServicesForModal = useMemo(() => services, [services]);

  const handleServicePress = (service: ServicePreference) => {
    console.log("Service card pressed:", service.screen);
    // biome-ignore lint/suspicious/noExplicitAny: Service screen typing needs to be fixed properly
    navigation.navigate(service.screen as any);
  };

  const renderServiceCard = (item: ServicePreference, width: number) => (
    <Card
      image={item.image}
      width={width}
      onPress={() => handleServicePress(item)}
    />
  );

  const handleCustomizationSave = async (
    updatedServices: ServicePreference[],
  ) => {
    await updateOrder(updatedServices);
    setShowCustomizationModal(false);
  };

  if (loading) {
    return (
      <Page title={t("services.title")}>
        <View />
      </Page>
    );
  }

  return (
    <>
      <Page title={t("services.title")}>
        <FlexibleGrid
          data={enabledServices}
          onPress={handleServicePress}
          renderCard={renderServiceCard}
        />
        <View style={{ alignItems: "center", width: "100%" }}>
          <Button
            label={t("common.customizeServices")}
            variant="ghost"
            onPress={() => setShowCustomizationModal(true)}
            className="mb-4"
            size="sm"
          />
        </View>
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
