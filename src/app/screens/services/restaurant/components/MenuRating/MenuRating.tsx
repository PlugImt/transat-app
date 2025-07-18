import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Star } from "@/components/common/Star";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Review } from "@/dto";
import { getTimeAgo } from "@/utils";

export const ReviewItem = ({ review }: { review: Review }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const timeAgo = getTimeAgo(review.date, t);

  return (
    <View
      className="flex flex-row gap-3 p-4 mb-3"
      style={{ backgroundColor: theme.card, borderRadius: 12 }}
    >
      <Avatar className="w-12 h-12">
        <AvatarImage source={{ uri: review.profile_picture || undefined }} />
        <AvatarFallback textClassname="text-lg">
          {review.first_name?.charAt(0) || ""}
          {review.last_name?.charAt(0) || ""}
        </AvatarFallback>
      </Avatar>

      <View className="flex-1 gap-1">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-semibold" variant="sm">
            {review.first_name} {review.last_name}
          </Text>
          <Text variant="sm" color="muted">
            {timeAgo}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2 mb-2">
          <View className="flex flex-row">
            <Star showValue={false} max={5} value={review.rating} />
          </View>
          <Text variant="sm" color="muted">
            ({review.rating})
          </Text>
        </View>

        <Text variant="sm">{review.comment}</Text>
      </View>
    </View>
  );
};
