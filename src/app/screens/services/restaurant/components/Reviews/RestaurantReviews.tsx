import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { CookingPot, Star, Utensils } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import {
  ReviewItem,
  ReviewItemSkeleton,
} from "@/app/screens/services/restaurant/components";
import { ReviewDialog } from "@/app/screens/services/restaurant/components/Reviews/ReviewDialog";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { userMenuRating } from "@/hooks/useMenuRestaurant";
import type { AppStackParamList } from "@/types";
import { getOpeningHoursData } from "@/utils";

export type RestaurantReviewsRouteProp = RouteProp<
  AppStackParamList,
  "RestaurantReviews"
>;

export const RestaurantReviews = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const route = useRoute<RestaurantReviewsRouteProp>();
  const { id } = route.params;
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);

  const {
    rating: reviewData,
    isPending,
    refetch,
    isError,
    error,
  } = userMenuRating(id);

  if (isPending) {
    return <RestaurantReviewSkeleton />;
  }

  if (isError || !reviewData) {
    return (
      <ErrorPage
        title={t("services.restaurant.title")}
        error={error}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  const averageRating = reviewData.average_rating || 0;
  const totalReviews = reviewData.total_ratings;
  const hasReview =
    reviewData.recent_reviews && reviewData.recent_reviews.length > 0;

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      title={t("services.restaurant.title")}
      header={
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
      <View className="flex-row justify-between items-end gap-8">
        <View className="flex-1 gap-1">
          <Text variant="h3">{reviewData.name}</Text>
          <View className="flex flex-row items-center gap-2">
            <Utensils size={16} color={theme.muted} />
            <Text color="muted" numberOfLines={2}>
              {t("services.restaurant.reviews.servicesCount", {
                count: reviewData.times_served,
              })}
            </Text>
          </View>
        </View>

        {hasReview && (
          <ReviewDialog>
            <Button
              label={t("services.restaurant.reviews.rate")}
              variant="secondary"
            />
          </ReviewDialog>
        )}
      </View>

      {/* Note global */}
      <View className="flex-row items-center gap-1">
        <Star size={20} color={theme.text} fill={theme.text} />
        <Text variant="h3">
          {t("services.restaurant.reviews.averageRating", {
            rating: averageRating.toFixed(1),
            count: totalReviews,
          })}
        </Text>
      </View>

      {/* Liste des avis */}
      <FlatList
        data={reviewData.recent_reviews}
        renderItem={({ item }) => <ReviewItem review={item} />}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-2"
        ListEmptyComponent={
          <Empty
            icon={<CookingPot size={50} color={theme.primary} />}
            title={t("services.restaurant.reviews.noReviewsTitle")}
            description={t("services.restaurant.reviews.noReviewsSubtitle")}
          >
            <ReviewDialog>
              <Button
                label={t("services.restaurant.reviews.rate")}
                className="w-full"
              />
            </ReviewDialog>
          </Empty>
        }
      />
    </Page>
  );
};

export default RestaurantReviews;

const RestaurantReviewSkeleton = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);

  return (
    <Page
      title={t("services.restaurant.title")}
      header={
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
      <View className="flex-row justify-between items-end gap-8">
        <View className="flex-1 gap-1">
          <TextSkeleton variant="h3" />
          <View className="flex flex-row items-center gap-2">
            <Utensils size={16} color={theme.muted} />
            <TextSkeleton />
          </View>
        </View>

        <Button
          label={t("services.restaurant.reviews.rate")}
          variant="secondary"
          disabled
        />
      </View>

      <View className="flex-row items-center gap-1">
        <Star size={20} color={theme.text} fill={theme.text} />
        <TextSkeleton variant="h3" lastLineWidth={130} />
      </View>

      <FlatList
        data={Array.from({ length: 5 })}
        renderItem={() => <ReviewItemSkeleton />}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-2"
      />
    </Page>
  );
};
