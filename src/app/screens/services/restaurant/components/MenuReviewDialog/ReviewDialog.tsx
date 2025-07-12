import { X } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Star } from "@/components/common/Star";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface ReviewDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment?: string) => void;
  isLoading?: boolean;
}

export const ReviewDialog = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}: ReviewDialogProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating >= 1 && rating <= 5) {
      onSubmit(rating, comment.trim() || undefined);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  const isValid = rating >= 1 && rating <= 5;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View
          className="w-full max-w-sm p-6 rounded-2xl"
          style={{ backgroundColor: theme.card }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text variant="h3">
              {t("services.restaurant.reviews.dialog.title")}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-1"
              disabled={isLoading}
            >
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Star Rating */}
          <View className="items-center mb-6">
            <Star
              mode="review"
              value={rating}
              max={5}
              size="lg"
              showValue={false}
              onRatingChange={setRating}
              disabled={isLoading}
            />
          </View>

          {/* Comment Input */}
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder={t(
              "services.restaurant.reviews.dialog.commentPlaceholder",
            )}
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isLoading}
            className="p-4 mb-6 text-base rounded-lg"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              borderWidth: 1,
              borderColor: theme.border,
              minHeight: 100,
            }}
          />

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Button
              label={t("common.cancel")}
              variant="outlined"
              onPress={handleClose}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              label={t("services.restaurant.reviews.dialog.submit")}
              onPress={handleSubmit}
              disabled={!isValid || isLoading}
              loading={isLoading}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
