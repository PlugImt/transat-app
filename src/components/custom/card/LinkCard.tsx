import { ChevronRight } from "lucide-react-native";
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
  size?: "sm" | "default";
}

const LinkCard = ({
  onPress,
  image,
  title,
  description,
  size = "default",
}: LinkCardProps) => {
  const { theme } = useTheme();
  return (
    <Card onPress={onPress} className="flex-row items-center gap-4">
      {image}
      <View className="flex-1">
        <Text
          variant={size === "sm" ? "default" : "h3"}
          className="font-bold"
          numberOfLines={1}
        >
          {title}
        </Text>
        {size === "default" && (
          <Text variant="sm" color="muted" numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      {onPress && <ChevronRight color={theme.muted} />}
    </Card>
  );
};

export default LinkCard;

interface LinkCardLoadingProps {
  size?: "sm" | "default";
}

export const LinkCardLoading = ({ size = "default" }: LinkCardLoadingProps) => {
  return (
    <Card className="flex-row items-center gap-4">
      <View className="flex-row items-center gap-4">
        <ImageSkeleton size={size === "sm" ? 36 : 64} />
        <View className="flex-1">
          <TextSkeleton
            variant={size === "sm" ? "default" : "h3"}
            lastLineWidth={100}
          />
          {size === "default" && (
            <TextSkeleton variant="sm" width={175} lines={2} />
          )}
        </View>
      </View>
    </Card>
  );
};
