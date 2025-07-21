import { ChevronRight } from "lucide-react-native";
import { cloneElement, isValidElement } from "react";
import { type ImageStyle, type StyleProp, View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { AvatarSkeleton, TextSkeleton } from "../Skeleton";

const ImageContainer = ({ children }: { children: React.ReactNode }) => {
  if (!isValidElement(children)) {
    return null;
  }

  return (
    <View className="h-16 w-16">
      {cloneElement(
        children as React.ReactElement<{ style: StyleProp<ImageStyle> }>,
        {
          style: { width: "100%", height: "100%", resizeMode: "contain" },
        },
      )}
    </View>
  );
};

interface LinkCardProps {
  onPress?: () => void;
  image?: React.ReactNode;
  title: string;
  description: string;
}

const LinkCard = ({ onPress, image, title, description }: LinkCardProps) => {
  const { theme } = useTheme();
  return (
    <Card onPress={onPress}>
      <View className="flex-row items-center gap-4">
        <ImageContainer>{image}</ImageContainer>
        <View className="flex-1">
          <Text variant="h3" numberOfLines={2}>
            {title}
          </Text>
          <Text variant="sm" color="muted" numberOfLines={3}>
            {description}
          </Text>
        </View>
        {onPress && <ChevronRight color={theme.muted} />}
      </View>
    </Card>
  );
};

export default LinkCard;

export const LinkCardLoading = () => {
  const { theme } = useTheme();
  return (
    <Card>
      <View className="flex-row items-center gap-4">
        <AvatarSkeleton size={64} />
        <View className="flex-1">
          <TextSkeleton variant="h3" lastLineWidth={100} />
          <TextSkeleton variant="sm" width={175} lines={2} />
        </View>
        <ChevronRight color={theme.muted} />
      </View>
    </Card>
  );
};
