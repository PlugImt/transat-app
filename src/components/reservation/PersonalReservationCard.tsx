import { CalendarClock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { ReservationDialog } from "@/components/custom/ReservationDialog";
import { useTheme } from "@/contexts/ThemeContext";
import type { PersonalReservationItem } from "@/dto/reservation";
import {
  formatTimeRange,
  generateReservationKey,
} from "@/utils/reservation.utils";

export interface PersonalReservationCardProps {
  item: PersonalReservationItem;
  action?: "cancel" | "return";
}

export const PersonalReservationCard = ({
  item,
  action,
}: PersonalReservationCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const endDate = item.end_date ? new Date(item.end_date) : null;

  const getTimeDisplay = () => {
    if (endDate) {
      return formatTimeRange(item.start_date, String(item.end_date));
    }

    return formatTimeRange(item.start_date, item.start_date);
  };

  const isUpcoming = new Date(item.start_date) > new Date();

  return (
    <Card
      className="flex-row items-center gap-4"
      key={generateReservationKey(item)}
    >
      <View className="flex-1 gap-1">
        <Text variant="h3" numberOfLines={1} className="font-semibold">
          {item.name}
        </Text>

        <View className="flex-row items-center gap-1">
          <CalendarClock size={14} color={theme.muted} />
          <Text variant="sm" color="muted" numberOfLines={1}>
            {getTimeDisplay()}
          </Text>
        </View>
      </View>

      {isUpcoming && action === "cancel" && (
        <ReservationDialog
          itemId={item.id}
          itemTitle={item.name}
          isActionCancel
          startDate={item.start_date}
        >
          <Button label={t("common.cancel")} variant="secondary" />
        </ReservationDialog>
      )}

      {isUpcoming && action === "return" && (
        <ReservationDialog itemId={item.id} itemTitle={item.name} isReturning>
          <Button
            label={t("services.reservation.returnItem")}
            variant="secondary"
          />
        </ReservationDialog>
      )}
    </Card>
  );
};
