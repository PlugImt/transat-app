import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { CookingPot, Star, Utensils } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import {
  LoadingState,
  ReviewItem,
} from "@/app/screens/services/restaurant/components";
import { ReviewDialog } from "@/app/screens/services/restaurant/components/Reviews/ReviewDialog";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { AboutModal } from "@/components/custom/AboutModal";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import {
  usePostRestaurantReview,
  userMenuRating,
} from "@/hooks/useMenuRestaurant";
import type { AppStackParamList } from "@/types";
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

        <Button
          label={t("services.restaurant.reviews.rate")}
          onPress={() => setShowReviewDialog(true)}
          variant="secondary"
        />
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
      {reviewData.recent_reviews && reviewData.recent_reviews.length > 0 ? (
        <FlatList
          data={reviewData.recent_reviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex items-center justify-center py-12  mx-4">
          <View className="mb-6">
            <CookingPot size={50} color={theme.primary} />
          </View>
          <Text variant="lg" className="text-center mb-2">
            {t("services.restaurant.reviews.noReviewsTitle")}
          </Text>
          <Text color="muted" className="text-center mb-6">
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
