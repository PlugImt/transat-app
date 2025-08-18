import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import Image from "@/components/common/Image";
import LinkCard, { LinkCardLoading } from "@/components/custom/card/LinkCard";
import { PreferenceCustomizationButton } from "@/components/custom/PreferenceCustomizationModal";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useServicePreferences } from "@/hooks/services/usePreferences";
import type { Preference } from "@/services/storage/preferences";
import { resetServicePreferences } from "@/services/storage/preferences";
import type { AppNavigation } from "@/types";

export const Services = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { scrollHandler } = useAnimatedHeader();
  const { actualTheme } = useTheme();
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
    <Page className="gap-2" title={t("services.title")} asChildren>
      <Animated.FlatList
        data={enabledServices}
        renderItem={({ item }) => renderServiceCard(item)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator
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
            onReset={async () => resetServicePreferences(t, actualTheme)}
          >
            <Button
              label={t("common.customizeServices")}
              variant="ghost"
              size="sm"
              className="mt-3"
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
