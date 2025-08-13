import { CalendarClock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { ReservationDialog } from "@/components/custom/ReservationDialog";
import { useTheme } from "@/contexts/ThemeContext";
import type { MyReservationItem } from "@/dto/reservation";
import {
  formatDateTimeRange,
  formatTimeRange,
  generateReservationKey,
} from "@/utils/reservation.utils";

// Component prop types
interface ReservationCardBaseProps {
  id: number;
  name: string;
  variant?: "default" | "compact";
  showActions?: boolean;
}

export interface MyReservationCardProps extends ReservationCardBaseProps {
  item: MyReservationItem;
  action?: "cancel" | "return";
  showFullDate?: boolean;
}

export const ReservationCard = ({
  item,
  action,
  showFullDate = false,
  variant = "default",
  showActions = true,
}: MyReservationCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const startDate = new Date(item.start_date);
  const endDate = item.end_date ? new Date(item.end_date) : null;

  const getTimeDisplay = () => {
    if (showFullDate && endDate) {
      return formatDateTimeRange(startDate, endDate);
    }

    if (endDate) {
      return formatTimeRange(item.start_date, item.end_date);
    }

    return formatTimeRange(item.start_date, item.start_date);
  };

  const isCompact = variant === "compact";

  return (
    <Card
      className={`flex-row items-center gap-4 ${isCompact ? "py-3" : ""}`}
      key={generateReservationKey(item)}
    >
      <View className="flex-1">
        <Text
          variant={isCompact ? "default" : "h3"}
          numberOfLines={1}
          className={isCompact ? "font-semibold" : ""}
        >
          {item.name}
        </Text>

        <View className="flex-row items-center gap-2 mt-1">
          <CalendarClock size={isCompact ? 14 : 16} color={theme.muted} />
          <Text variant="sm" color="muted" numberOfLines={1}>
            {getTimeDisplay()}
          </Text>
        </View>
      </View>

      {showActions && action === "cancel" && (
        <ReservationDialog
          itemId={item.id}
          itemTitle={item.name}
          isActionCancel
          startDate={item.start_date}
        >
          <Button
            label={t("common.cancel")}
            variant="secondary"
            size={isCompact ? "sm" : "default"}
          />
        </ReservationDialog>
      )}

      {showActions && action === "return" && (
        <ReservationDialog itemId={item.id} itemTitle={item.name} isReturning>
          <Button
            label={t("services.reservation.returnItem")}
            variant="secondary"
            size={isCompact ? "sm" : "default"}
          />
        </ReservationDialog>
      )}
    </Card>
  );
};
