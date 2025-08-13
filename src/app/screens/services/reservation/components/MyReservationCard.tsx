import { CalendarClock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { ReservationDialog } from "@/components/custom/ReservationDialog";
import { useTheme } from "@/contexts/ThemeContext";
import type { MyReservationItem } from "@/dto/reservation";
import { formatDateTime, isoToHourString } from "@/utils/date.utils";

interface MyReservationCardProps {
  item: MyReservationItem;
  action?: "cancel" | "return";
  fullDateRange?: boolean;
}

export const MyReservationCard = ({
  item,
  action,
  fullDateRange = false,
}: MyReservationCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const startDate = new Date(item.start_date);
  const endDate = item.end_date ? new Date(item.end_date) : undefined;
  const start = isoToHourString(item.start_date);
  const end = item.end_date ? isoToHourString(item.end_date) : undefined;

  return (
    <Card className="flex-row items-center gap-4">
      <View className="flex-1">
        <Text variant="h3" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex-row items-center gap-2 mt-1">
          <CalendarClock size={16} color={theme.muted} />
          <Text variant="sm" color="muted">
            {fullDateRange && endDate
              ? `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`
              : end
                ? `${start} - ${end}`
                : start}
          </Text>
        </View>
      </View>
      {action === "cancel" && (
        <ReservationDialog
          itemId={item.id}
          itemTitle={item.name}
          isActionCancel
          startDate={item.start_date}
        >
          <Button label={t("common.cancel")} variant="secondary" size="sm" />
        </ReservationDialog>
      )}
      {action === "return" && (
        <ReservationDialog itemId={item.id} itemTitle={item.name} isReturning>
          <Button
            label={t("services.reservation.returnItem")}
            variant="secondary"
            size="sm"
          />
        </ReservationDialog>
      )}
    </Card>
  );
};

export default MyReservationCard;
