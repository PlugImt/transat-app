import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { Stars } from "@/components/custom/star/Stars";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import type { Review } from "@/dto";
import { getTimeAgo } from "@/utils";

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  const { t } = useTranslation();
  const timeAgo = getTimeAgo(review.date, t);

  return (
    <Card>
      <View className="flex-row gap-2">
        <Avatar className="h-14 w-14">
          <AvatarImage source={{ uri: review.profile_picture || undefined }} />
          <AvatarFallback textClassname="text-lg">
            {review.first_name?.charAt(0) || ""}
            {review.last_name?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>

        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-4">
            <Text variant="lg" numberOfLines={1} className="flex-1">
              {review.first_name} {review.last_name}
            </Text>
            <Text variant="sm" color="muted">
              {timeAgo}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Stars value={review.rating} size="sm" />
            <Text color="muted">({review.rating})</Text>
          </View>
        </View>
      </View>

      <Text>{review.comment}</Text>
    </Card>
  );
};

export const ReviewItemSkeleton = () => {
  const rating = useMemo(() => Math.floor(Math.random() * 5) + 1, []);
  const lines = useMemo(() => Math.floor(Math.random() * 5) + 1, []);
  return (
    <Card>
      <View className="flex-row gap-2">
        <AvatarSkeleton size={56} />

        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-4">
            <TextSkeleton variant="lg" className="flex-1" lastLineWidth={130} />
            <TextSkeleton variant="sm" lastLineWidth={80} />
          </View>

          <View className="flex-row items-center gap-1">
            <Stars value={rating} size="sm" />
            <Text color="muted">({rating})</Text>
          </View>
        </View>
      </View>

      <TextSkeleton lines={lines} />
    </Card>
  );
};
