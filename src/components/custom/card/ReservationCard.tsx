import { useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { ReservationDialog } from "@/components/custom/ReservationDialog";
import { TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { useAuth } from "@/hooks/account";
import type { AppNavigation } from "@/types";

interface ReservationCardProps {
  onPress?: () => void;
  title: string;
  slot?: boolean;
  type: "category" | "item";
  id: number;
  user?: User;
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
  const navigation = useNavigation<AppNavigation>();
  const auth = useAuth();

  const handlePress = () => {
    onPress?.();
    navigation.push("ReservationCategory", {
      id,
      type: "category",
      title,
    });
  };

  const disabled = !!user && user.email !== auth.user?.email;
  const canBeFreed = !!user && user.email === auth.user?.email;

  const handleReservePress = () => {
    if (slot) {
      // @ts-ignore
      navigation.push("ReservationItem", { id, title });
    }
  };

  return (
    <Card
      onPress={type === "category" ? handlePress : undefined}
      className={`flex-row items-center gap-4 ${disabled ? "opacity-60" : ""}`}
    >
      <View className="flex-1">
        <Text variant="h3" numberOfLines={1}>
          {title}
        </Text>
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
            variant={canBeFreed ? "default" : "secondary"}
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
