import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { SplashScreen } from "@/components/animations/SplashScreen";
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
import { resetHomeWidgetPreferences } from "@/services/storage/preferences";
import type { AppNavigation, BottomTabParamList } from "@/types";
import { isNight } from "@/utils";

export const Home = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const navigation = useNavigation<AppNavigation>();
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
  const {
    preferences: widgets,
    enabledPreferences: enabledWidgets,
    isPending,
    updateOrder,
  } = useHomeWidgetPreferences();
  const { isFetching, refetch } = useHomeWidgetsFetching();
  const { getWidgetComponent } = useWidgetComponents();

  if (isPending) {
    return <SplashScreen />;
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
            {isNight() ? t("common.goodEvening") : t("common.hello")}
          </Text>
          {user?.first_name && (
            <Text
              variant="h1"
              color="primary"
              numberOfLines={1}
              onPress={() => tabNavigation?.navigate("AccountScreen")}
            >
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
            onReset={async () => resetHomeWidgetPreferences(t)}
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
