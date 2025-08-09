import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";

export const Reservation = () => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();

  return (
    <Page
      title={t("services.reservation.title")}
      onRefresh={() => {}}
      refreshing={false}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={() => ""}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
      />
        <Animated.View className="flex-1 items-center justify-center">
            <Animated.Text className="text-lg font-semibold">
            {t("services.reservation.noData")}
            </Animated.Text>
        </Animated.View>

    </Page>
  );
};
