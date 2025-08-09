import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { LaundryWidgetLoading } from "@/app/screens/services/laundry/widget/LaundryWidget";
import { RestaurantWidgetLoading } from "@/app/screens/services/restaurant/widget/RestaurantWidget";
import { WeatherSkeleton } from "@/app/screens/services/weather/widget/WeatherWidget";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { PreferenceCustomizationButton } from "@/components/custom/PreferenceCustomizationModal";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { useUser } from "@/hooks/account";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useHomeWidgetsFetching } from "@/hooks/home/useHomeWidgetsFetching";
import { useWidgetComponents } from "@/hooks/home/useWidgetComponents";
import { useHomeWidgetPreferences } from "@/hooks/services/usePreferences";
import { isDinner, isLunch, isWeekend } from "@/utils";

export const Home = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const {
    preferences: widgets,
    enabledPreferences: enabledWidgets,
    isPending,
    updateOrder,
  } = useHomeWidgetPreferences();
  const { isFetching, refetch } = useHomeWidgetsFetching();
  const { getWidgetComponent } = useWidgetComponents();

  if (isPending) {
    return <HomeLoading />;
  }

  return (
    <Page
      asChildren
      refreshing={isFetching}
      className="gap-8"
      onRefresh={refetch}
      title={
        <View className="flex-row gap-2 items-center">
          <Text variant="h1" color="text">
            {t("common.welcome")}
          </Text>
          {user?.first_name && (
            <Text variant="h1" color="primary">
              {user.first_name}
            </Text>
          )}
        </View>
      }
    >
      <Animated.FlatList
        data={enabledWidgets}
        renderItem={({ item }) => getWidgetComponent(item.id)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        onScroll={scrollHandler}
        ListEmptyComponent={
          <Empty
            title={t("common.noWidgetsEnabled")}
            description={t("common.noWidgetsEnabledDescription")}
          />
        }
        ListFooterComponent={
          <PreferenceCustomizationButton
            items={widgets}
            title={t("common.customizeWidgets")}
            onUpdate={updateOrder}
          >
            <Button
              label={t("common.customizeWidgets")}
              variant="ghost"
              size="sm"
            />
          </PreferenceCustomizationButton>
        }
      />
    </Page>
  );
};

export default Home;

export const HomeLoading = () => {
  const { t } = useTranslation();
  return (
    <Page className="gap-8" title={t("common.welcome")}>
      <WeatherSkeleton />
      {!isWeekend() && !isLunch() && !isDinner() ? (
        <RestaurantWidgetLoading />
      ) : null}
      <LaundryWidgetLoading />
    </Page>
  );
};
