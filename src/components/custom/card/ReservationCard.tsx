import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppStackParamList } from "@/types";

interface ReservationCardProps {
  onPress?: () => void;
  title: string;
  slot?: boolean;
  type: "category" | "item";
  id: number;
}

const ReservationCard = ({
  onPress,
  title,
  slot,
  type,
  id,
}: ReservationCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const handlePress = () => {
    if (type === "category") {
      if (onPress) onPress();
      navigation.push("ReservationCategory", {
        id,
        type: "category",
        title,
      });
    }
  };

  const handleReservePress = () => {
    if (slot) {
      console.log("slot to be implemented");
    } else {
      console.log("dialog to be implemented");
    }
  };
  return (
    <Card
      onPress={type === "category" ? handlePress : undefined}
      className="flex-row items-center gap-4"
    >
      <View className="flex-1">
        <Text variant="h3" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {type === "category" ? (
        <ChevronRight color={theme.muted} />
      ) : (
        <Button
          label={t("services.reservation.reserve")}
          variant="secondary"
          className="ml-auto"
          onPress={handleReservePress}
        />
      )}
    </Card>
  );
};

export default ReservationCard;

export const ReservationCardLoading = () => {
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
