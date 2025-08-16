import { ChevronRight } from "lucide-react-native";
import type React from "react";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import { useTheme } from "@/contexts/ThemeContext";

interface LinkCardProps {
  onPress?: () => void;
  image?: React.ReactNode;
  title: string;
  description: string;
}

const LinkCard = ({ onPress, image, title, description }: LinkCardProps) => {
  const { theme } = useTheme();
  return (
    <Card onPress={onPress} className="h-[100px] flex-row items-center gap-4">
      {image}
      <View className="flex-1">
        <Text variant="h3" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="sm" color="muted" numberOfLines={2}>
          {description}
        </Text>
      </View>
      {onPress && <ChevronRight color={theme.muted} />}
    </Card>
  );
};

export default LinkCard;

export const LinkCardLoading = () => {
  const { theme } = useTheme();
  return (
    <Card>
      <View className="flex-row items-center gap-4">
        <ImageSkeleton size={64} />
        <View className="flex-1">
          <TextSkeleton variant="h3" lastLineWidth={100} />
          <TextSkeleton variant="sm" width={175} lines={2} />
        </View>
        <ChevronRight color={theme.muted} />
      </View>
    </Card>
  );
};
