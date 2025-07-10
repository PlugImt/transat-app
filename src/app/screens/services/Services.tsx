import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import FlexibleGrid from "@/components/common/FlexibleGrid";
import { Page } from "@/components/common/Page";
import { WidgetCustomizationButton } from "@/components/common/WidgetCustomizationModal";
import { useServicePreferences } from "@/hooks/useWidgetPreferences";
import type { AppStackParamList } from "@/services/storage/types";
import type { ServicePreference } from "@/services/storage/widgetPreferences";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { enabledServices, services, updateOrder, loading } =
    useServicePreferences();

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

  const handleCustomizationSave = async (updatedItems: any[]) => {
    await updateOrder(updatedItems as ServicePreference[]);
  };

  if (loading) {
    return (
      <Page title={t("services.title")}>
        <View />
      </Page>
    );
  }

  return (
    <Page title={t("services.title")}>
      <FlexibleGrid
        data={enabledServices}
        onPress={handleServicePress}
        renderCard={renderServiceCard}
      />
      <View style={{ alignItems: "center", width: "100%" }}>
        <WidgetCustomizationButton
          items={services}
          onUpdate={handleCustomizationSave}
          title={t("common.customizeServices")}
          buttonLabel={t("common.customizeServices")}
          variant="ghost"
          size="sm"
          className="mb-4"
        />
      </View>
    </Page>
  );
};

export default Services;
