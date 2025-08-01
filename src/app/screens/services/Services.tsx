import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import Animated from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import LinkCard, { LinkCardLoading } from "@/components/custom/LinkCard";
import { PreferenceCustomizationButton } from "@/components/custom/PreferenceCustomizationModal";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useServicePreferences } from "@/hooks/usePreferences";
import type { Preference } from "@/services/storage/preferences";
import type { AppStackParamList } from "@/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { scrollHandler } = useAnimatedHeader();
  const {
    enabledPreferences: enabledServices,
    preferences: services,
    isPending,
    updateOrder,
  } = useServicePreferences();

  const handleServicePress = (service: Preference) => {
    // biome-ignore lint/suspicious/noExplicitAny: Service screen typing needs to be fixed properly
    navigation.navigate(service.screen as any);
  };

  const renderServiceCard = (item: Preference) => (
    <LinkCard
      title={item.name}
      description={item.description || ""}
      onPress={() => handleServicePress(item)}
      image={<Image source={item.image} />}
    />
  );

  if (isPending) {
    return <ServicesLoading />;
  }

  return (
    <Page asChildren title={t("services.title")}>
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
        ListFooterComponent={
          <PreferenceCustomizationButton
            items={services}
            title={t("common.customizeServices")}
            onUpdate={updateOrder}
          >
            <Button
              label={t("common.customizeServices")}
              variant="ghost"
              size="sm"
            />
          </PreferenceCustomizationButton>
        }
      />
    </Page>
  );
};

export default Services;

const ServicesLoading = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("services.title")}>
      {Array.from({ length: 5 }).map((_, index) => (
        <LinkCardLoading key={`service-loading-${index.toString()}`} />
      ))}
    </Page>
  );
};
