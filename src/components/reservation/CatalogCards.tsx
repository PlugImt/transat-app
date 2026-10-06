import { useNavigation } from "expo-router/react-navigation";
import { ChevronRight, FolderOpen } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { ReservationCategory, ReservationItem } from "@/dto/reservation";
import {
  useReservationFeedback,
  useReturnItem,
  useTakeItem,
} from "@/hooks/services/reservation";
import type { AppNavigation } from "@/types";
import {
  formatUserName,
  type ItemAvailability,
} from "@/utils/reservation.utils";
import { ActionPill } from "./ActionPill";
import { ConfirmAction } from "./ConfirmAction";

export const CategoryCard = ({
  category,
}: {
  category: ReservationCategory;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();

  return (
    <Card
      className="flex-row items-center gap-4"
      accessibilityLabel={category.name}
      onPress={() =>
        navigation.push("ReservationCategory", {
          id: category.id,
          title: category.name,
        })
      }
    >
      <FolderOpen color={theme.secondary} size={22} />
      <Text variant="h3" numberOfLines={1} className="flex-1">
        {category.name}
      </Text>
      <ChevronRight color={theme.muted} />
    </Card>
  );
};

const StatusLine = ({
  item,
  availability,
}: {
  item: ReservationItem;
  availability: ItemAvailability;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (availability === "slot") {
    return (
      <Text variant="sm" color="muted" numberOfLines={1}>
        {t("services.reservation.status.perSlot")}
      </Text>
    );
  }

  const dot =
    availability === "free"
      ? theme.success
      : availability === "mine"
        ? theme.primary
        : theme.warning;

  const label =
    availability === "free"
      ? t("services.reservation.status.available")
      : availability === "mine"
        ? t("services.reservation.status.mine")
        : t("services.reservation.status.takenBy", {
            name: item.user ? formatUserName(item.user) : "",
          });

  return (
    <View className="flex-row items-center gap-2">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
      <Text variant="sm" color="muted" numberOfLines={1} className="flex-1">
        {label}
      </Text>
    </View>
  );
};

export const ItemCard = ({
  item,
  availability,
}: {
  item: ReservationItem;
  availability: ItemAvailability;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();
  const feedback = useReservationFeedback();
  const takeItem = useTakeItem();
  const returnItem = useReturnItem();

  const isMine = availability === "mine";
  const isTaken = availability === "taken";

  const content = (
    <Card
      className={`flex-row items-center gap-4 ${isTaken ? "opacity-60" : ""}`}
      accessibilityLabel={item.name}
      onPress={
        availability === "slot"
          ? () =>
              navigation.navigate("ReservationCalendar", {
                id: item.id,
                title: item.name,
              })
          : undefined
      }
    >
      <View className="flex-1 gap-0.5">
        <Text variant="h3" numberOfLines={1}>
          {item.name}
        </Text>
        <StatusLine item={item} availability={availability} />
      </View>
      {availability === "slot" && <ChevronRight color={theme.muted} />}
      {availability === "free" && (
        <ActionPill label={t("services.reservation.reserve")} />
      )}
      {isMine && (
        <ActionPill
          label={t("services.reservation.returnItem")}
          tone="primary"
        />
      )}
    </Card>
  );

  if (availability === "slot" || isTaken) return content;

  const handleConfirm = () => {
    if (isMine) {
      returnItem.mutate(item.id, {
        onSuccess: () =>
          feedback.success(t("services.reservation.returnSuccess")),
        onError: (error) =>
          feedback.failure(error, t("services.reservation.errors.returnError")),
      });
      return;
    }

    takeItem.mutate(item.id, {
      onSuccess: () =>
        feedback.success(
          item.confirmation_message ?? t("services.reservation.reserveSuccess"),
        ),
      onError: (error) =>
        feedback.failure(error, t("services.reservation.errors.reserveError")),
    });
  };

  return (
    <ConfirmAction
      title={
        isMine
          ? t("services.reservation.returnItem")
          : t("services.reservation.reserve")
      }
      description={
        isMine
          ? t("services.reservation.returnConfirmDesc")
          : t("services.reservation.reserveConfirmDesc")
      }
      details={
        !isMine && item.warning_message ? (
          <Text>{item.warning_message}</Text>
        ) : undefined
      }
      confirmLabel={
        isMine
          ? t("services.reservation.confirmReturn")
          : t("services.reservation.confirmReserve")
      }
      onConfirm={handleConfirm}
      isPending={takeItem.isPending || returnItem.isPending}
    >
      {content}
    </ConfirmAction>
  );
};

export const RowSkeleton = () => (
  <Card>
    <TextSkeleton variant="h3" lastLineWidth="55%" />
    <TextSkeleton variant="sm" lastLineWidth="35%" />
  </Card>
);
