import { View } from "react-native";
import { Text } from "@/components/common/Text";
import type { MyReservationItem } from "@/dto/reservation";
import {
  generateReservationKey,
  getReservationAction,
} from "@/utils/reservation.utils";
import { ReservationCard } from "./ReservationCard";

interface ReservationGroupProps {
  title?: string;
  items: MyReservationItem[];
  showActions?: boolean;
  showFullDate?: boolean;
  variant?: "default" | "compact";
  emptyMessage?: string;
}

export const ReservationGroup = ({
  title,
  items,
  showActions = true,
  showFullDate = false,
  variant = "default",
  emptyMessage,
}: ReservationGroupProps) => {
  if (!items.length && !emptyMessage) {
    return null;
  }

  return (
    <View className="gap-3">
      {title && (
        <Text variant="h3" className="text-lg font-semibold">
          {title}
        </Text>
      )}

      {items.length > 0 ? (
        <View className="gap-2">
          {items.map((item) => (
            <ReservationCard
              key={generateReservationKey(item)}
              item={item}
              action={showActions ? getReservationAction(item) : undefined}
              showFullDate={showFullDate}
              showActions={showActions}
              variant={variant}
            />
          ))}
        </View>
      ) : (
        emptyMessage && (
          <Text color="muted" className="text-center py-4">
            {emptyMessage}
          </Text>
        )
      )}
    </View>
  );
};
