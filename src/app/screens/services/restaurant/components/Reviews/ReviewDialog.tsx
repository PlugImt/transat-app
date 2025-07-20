import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RestaurantReviewsRouteProp } from "@/app/screens/services/restaurant/components/Reviews";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Textarea } from "@/components/common/Textarea";
import { useToast } from "@/components/common/Toast";
import { Stars } from "@/components/custom/star/Stars";
import { usePostRestaurantReview } from "@/hooks/useMenuRestaurant";

interface ReviewDialogProps {
  children: React.ReactElement<{ onPress?: () => void }>;
}

export const ReviewDialog = ({ children }: ReviewDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const route = useRoute<RestaurantReviewsRouteProp>();
  const { id } = route.params;

  const { mutate: postReview, isPending: isPostingReview } =
    usePostRestaurantReview(id);

  const handleClose = () => {
    setRating(0);
    setComment("");
  };

  const isValid = rating >= 1 && rating <= 5;

  const handleSubmitReview = (rating: number, comment?: string) => {
    postReview(
      { rating, comment },
      {
        onSuccess: () => {
          toast(
            t("services.restaurant.reviews.dialog.successMessage"),
            "success",
          );
          handleClose();
        },
        onError: () => {
          toast(
            t("services.restaurant.reviews.dialog.errorMessage"),
            "destructive",
          );
        },
      },
    );
  };

  const handleSubmit = () => {
    if (rating >= 1 && rating <= 5) {
      handleSubmitReview(rating, comment.trim() || undefined);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        title={t("services.restaurant.reviews.dialog.title")}
        className="gap-4 items-center"
        cancelLabel={t("common.cancel")}
        confirmLabel={t("services.restaurant.reviews.dialog.submit")}
        isPending={isPostingReview}
        disableConfirm={!isValid}
        onConfirm={handleSubmit}
        onCancel={handleClose}
      >
        <Stars
          value={rating}
          onRatingChange={setRating}
          disabled={isPostingReview}
          size="lg"
        />
        <Textarea
          value={comment}
          onChangeText={setComment}
          placeholder={t(
            "services.restaurant.reviews.dialog.commentPlaceholder",
          )}
          disabled={isPostingReview}
        />
      </DialogContent>
    </Dialog>
  );
};
