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
import { ReservationDialog } from "@/components/custom/ReservationDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account";
import type { AppStackParamList } from "@/types";

interface ReservationCardProps {
  onPress?: () => void;
  title: string;
  slot?: boolean;
  type: "category" | "item";
  id: number;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    [key: string]: any;
  };
}

const ReservationCard = ({
  onPress,
  title,
  slot,
  type,
  id,
  user,
}: ReservationCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const auth = useAuth();

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

  const disabled = !!user && user.email !== auth.user?.email;
  const canBeFreed = !!user && user.email === auth.user?.email;

  const handleReservePress = () => {
    if (slot) {
      console.log("slot to be implemented");
    }
  };

  return (
    <Card
      onPress={type === "category" ? handlePress : undefined}
      className={`flex-row items-center gap-4 ${disabled ? "opacity-60" : ""}`}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text variant="h3" numberOfLines={1}>
            {title}
          </Text>
        </View>
        {user ? (
          <View className="flex-row items-center gap-2">
            <Text variant="sm" numberOfLines={1}>
              {`${t("services.reservation.reservedBy")} ${user.first_name} ${user.last_name}`}
            </Text>
          </View>
        ) : null}
      </View>
      {type === "category" ? (
        <ChevronRight color={theme.muted} />
      ) : slot ? (
        <Button
          label={
            canBeFreed
              ? t("services.reservation.returnItem")
              : t("services.reservation.reserve")
          }
          variant="secondary"
          className="ml-auto"
          onPress={handleReservePress}
          disabled={disabled}
        />
      ) : (
        <ReservationDialog
          itemId={id}
          itemTitle={title}
          isReturning={canBeFreed}
        >
          <Button
            label={
              canBeFreed
                ? t("services.reservation.returnItem")
                : t("services.reservation.reserve")
            }
            variant="secondary"
            className="ml-auto"
            disabled={disabled}
          />
        </ReservationDialog>
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
