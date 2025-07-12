import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Pencil } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { IconButton } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { PreferenceCustomizationButton } from "@/components/custom/PreferenceCustomizationModal";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimatedHeader } from "@/hooks/useAnimatedHeader";
import { useServicePreferences } from "@/hooks/usePreferences";
import type { AppStackParamList } from "@/services/storage/types";
import type { Preference } from "@/services/storage/widgetPreferences";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { scrollHandler } = useAnimatedHeader();
  const {
    enabledPreferences: enabledServices,
    preferences: services,
    loading,
    updateOrder,
  } = useServicePreferences();

  const handleServicePress = (service: Preference) => {
    // biome-ignore lint/suspicious/noExplicitAny: Service screen typing needs to be fixed properly
    navigation.navigate(service.screen as any);
  };

  const renderServiceCard = (item: Preference) => (
    <Card
      image={item.image}
      title={item.name}
      onPress={() => handleServicePress(item)}
    />
  );

  if (loading) {
    return (
      <Page title={t("services.title")}>
        <View />
      </Page>
    );
  }

  return (
    <Page
      asChildren
      title={t("services.title")}
      header={
        <PreferenceCustomizationButton
          items={services}
          title={t("common.customizeServices")}
          onUpdate={updateOrder}
        >
          <IconButton
            icon={<Pencil color={theme.text} size={20} />}
            variant="link"
          />
        </PreferenceCustomizationButton>
      }
    >
      <Animated.FlatList
        data={enabledServices}
        renderItem={({ item }) => renderServiceCard(item)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        onScroll={scrollHandler}
        ListEmptyComponent={
          <Empty
            title={t("services.noServicesEnabled")}
            description={t("services.noServicesEnabledDescription")}
          />
        }
      />
    </Page>
  );
};

export default Services;
