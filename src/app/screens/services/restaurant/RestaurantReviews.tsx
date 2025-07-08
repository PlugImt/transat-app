import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import {
  LoadingState,
  RestaurantMenu,
} from "@/app/screens/services/restaurant/components";
import { Page } from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useMenuRestaurant, userMenuRating } from '@/hooks/useMenuRestaurant';
import type { AppStackParamList } from "@/services/storage/types";
import { getOpeningHoursData, isWeekend, outOfService } from "@/utils";

type RestaurantReviewsRouteProp = RouteProp<AppStackParamList, "RestaurantReviews">;

export const RestaurantReviews = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const route = useRoute<RestaurantReviewsRouteProp>();
  const { id } = route.params;
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);

  const { rating: reviewData, isPending, refetch, isError, error } = userMenuRating(id);

  if (isPending || !reviewData) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <Page
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.restaurant.title")}
        about={
          <AboutModal
            title={t("services.restaurant.title")}
            description={t("services.restaurant.about")}
            openingHours={openingHoursData}
            location={t("services.restaurant.location")}
            price={t("services.restaurant.price")}
            additionalInfo={t("services.restaurant.additionalInfo")}
          />
        }
      >
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      goBack
      title={t("services.restaurant.title")}
      about={
        <AboutModal
          title={t("services.restaurant.title")}
          description={t("services.restaurant.about")}
          openingHours={openingHoursData}
          location={t("services.restaurant.location")}
          price={t("services.restaurant.price")}
          additionalInfo={t("services.restaurant.additionalInfo")}
        />
      }
    >
        <View className="flex flex-col gap-6 p-4">
          <View className="flex flex-col gap-2">
            <Text className="text-2xl font-bold" style={{ color: theme.text }}>
              {reviewData.name}
            </Text>
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
              {t("services.restaurant.reviews.menuItem", "Menu Item ID:")} {id}
            </Text>
          </View>

          <View className="flex flex-col gap-4">
            <Text className="text-xl font-semibold" style={{ color: theme.text }}>
              {t("services.restaurant.reviews.title", "Rating & Reviews")}
            </Text>
            
            <View className="flex flex-row items-center gap-3">
              <Text className="text-3xl font-bold" style={{ color: theme.primary }}>
                {reviewData.average_rating ? reviewData.average_rating.toFixed(1) : "N/A"}
              </Text>
              <View className="flex flex-col">
                <Text className="text-base" style={{ color: theme.text }}>
                  / 5.0
                </Text>
                <Text className="text-sm" style={{ color: theme.textSecondary }}>
                  {reviewData.total_ratings} {t("services.restaurant.reviews.ratings", "ratings")}
                </Text>
              </View>
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-base font-medium" style={{ color: theme.text }}>
                {t("services.restaurant.reviews.servingInfo", "Serving Information")}
              </Text>
              <Text className="text-sm" style={{ color: theme.textSecondary }}>
                {t("services.restaurant.reviews.timesServed", "Times served:")} {reviewData.times_served}
              </Text>
              {reviewData.first_time_served && (
                <Text className="text-sm" style={{ color: theme.textSecondary }}>
                  {t("services.restaurant.reviews.firstServed", "First served:")} {new Date(reviewData.first_time_served).toLocaleDateString()}
                </Text>
              )}
              {reviewData.last_time_served && (
                <Text className="text-sm" style={{ color: theme.textSecondary }}>
                  {t("services.restaurant.reviews.lastServed", "Last served:")} {new Date(reviewData.last_time_served).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>
    </Page>
  );
};

export default RestaurantReviews;
