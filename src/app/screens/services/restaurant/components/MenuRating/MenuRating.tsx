import { Text, View } from "react-native";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Star } from "@/components/common/Star";
import { useTheme } from "@/contexts/ThemeContext";
import type { Review } from "@/dto";
import { getTimeAgo } from "@/utils";

export const ReviewItem = ({ review }: { review: Review }) => {
  const { theme } = useTheme();
  const timeAgo = getTimeAgo(review.date);

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
          <Text
            className="font-semibold text-base"
            style={{ color: theme.text }}
          >
            {review.first_name} {review.last_name}
          </Text>
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            {timeAgo}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2 mb-2">
          <View className="flex flex-row">
            <Star showValue={false} max={5} value={review.rating} />
          </View>
          <Text className="text-sm" style={{ color: theme.textSecondary }}>
            ({review.rating})
          </Text>
        </View>

        <Text className="text-sm leading-5" style={{ color: theme.text }}>
          {review.comment}
        </Text>
      </View>
    </View>
  );
};
