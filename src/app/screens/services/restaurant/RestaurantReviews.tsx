import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { CookingPot, Star, Utensils } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import { LoadingState } from "@/app/screens/services/restaurant/components";
import { ReviewItem } from "@/app/screens/services/restaurant/components/MenuRating";
import { ReviewDialog } from "@/app/screens/services/restaurant/components/MenuReviewDialog/ReviewDialog";
import { Button } from "@/components/common/Button";
import { useToast } from "@/components/common/Toast";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import {
  usePostRestaurantReview,
  userMenuRating,
} from "@/hooks/useMenuRestaurant";
import type { AppStackParamList } from "@/services/storage/types";
import { getOpeningHoursData } from "@/utils";

type RestaurantReviewsRouteProp = RouteProp<
  AppStackParamList,
  "RestaurantReviews"
>;

export const RestaurantReviews = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { toast } = useToast();
  const route = useRoute<RestaurantReviewsRouteProp>();
  const { id } = route.params;
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const {
    rating: reviewData,
    isPending,
    refetch,
    isError,
    error,
  } = userMenuRating(id);

  const postReviewMutation = usePostRestaurantReview(id);

  const handleSubmitReview = async (rating: number, comment?: string) => {
    try {
      await postReviewMutation.mutateAsync({ rating, comment });
      setShowReviewDialog(false);
      toast(t("services.restaurant.reviews.dialog.successMessage"), "success");
    } catch (_error) {
      toast(
        t("services.restaurant.reviews.dialog.errorMessage"),
        "destructive",
      );
    }
  };

  if (isPending || !reviewData) {
    return <LoadingState />;
  }

  if (isError) {
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
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  const averageRating = reviewData.average_rating || 0;
  const totalReviews = reviewData.total_ratings;

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      goBack
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
      <View className="flex flex-col gap-6">
        <View className="flex flex-row justify-between items-start">
          <View className="flex-1 flex-col mr-3">
            <Text
              className="text-2xl font-bold flex-wrap"
              style={{ color: theme.text }}
            >
              {reviewData.name}
            </Text>
            <View className="flex flex-row items-center gap-2 mt-1">
              <Utensils size={16} color={theme.textSecondary} />
              <Text
                className="text-sm flex-wrap"
                style={{ color: theme.textSecondary }}
                numberOfLines={2}
              >
                {t("services.restaurant.reviews.servicesCount", {
                  count: reviewData.times_served,
                })}
              </Text>
            </View>
          </View>

          <Button
            label={t("services.restaurant.reviews.rate")}
            size="sm"
            className="px-4 py-2"
            style={{ backgroundColor: theme.primary, borderRadius: 8 }}
            labelClasses="text-sm"
            onPress={() => setShowReviewDialog(true)}
          />
        </View>

        {/* Overall Rating */}
        <View className="flex flex-row items-center gap-3">
          <Star size={20} color={theme.text} fill={theme.text} />
          <Text className="text-xl font-bold" style={{ color: theme.text }}>
            {t("services.restaurant.reviews.averageRating", {
              rating: averageRating.toFixed(1),
              count: totalReviews,
            })}
          </Text>
        </View>

        {/* Reviews List */}
        {reviewData.recent_reviews && reviewData.recent_reviews.length > 0 ? (
          <FlatList
            data={reviewData.recent_reviews}
            keyExtractor={(_, index) => `review-${index}`}
            renderItem={({ item }) => <ReviewItem review={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex items-center justify-center py-12  mx-4">
            <View className="mb-6">
              <CookingPot size={50} color={theme.primary} />
            </View>
            <Text
              className="text-lg font-semibold text-center mb-2"
              style={{ color: theme.text }}
            >
              {t("services.restaurant.reviews.noReviewsTitle")}
            </Text>
            <Text
              className="text-center mb-6"
              style={{ color: theme.textSecondary }}
            >
              {t("services.restaurant.reviews.noReviewsSubtitle")}
            </Text>
            <Button
              label={t("services.restaurant.reviews.rate")}
              onPress={() => setShowReviewDialog(true)}
              className="px-8 py-3 w-full"
              style={{ backgroundColor: theme.primary, borderRadius: 12 }}
              labelClasses="text-base font-medium"
            />
          </View>
        )}
      </View>

      <ReviewDialog
        visible={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        onSubmit={handleSubmitReview}
        isLoading={postReviewMutation.isPending}
      />
    </Page>
  );
};

export default RestaurantReviews;
