import { View } from "react-native";
import { Text } from "@/components/common/Text";
import type { PersonalReservationItem } from "@/dto/reservation";
import {
  generateReservationKey,
  getReservationAction,
} from "@/utils/reservation.utils";
import { PersonalReservationCard } from "./PersonalReservationCard";

interface PersonalReservationGroupProps {
  title?: string;
  items: PersonalReservationItem[];
  emptyMessage?: string;
}

export const PersonalReservationGroup = ({
  title,
  items,
  emptyMessage,
}: PersonalReservationGroupProps) => {
  if (!items.length && !emptyMessage) {
    return null;
  }

  return (
    <View className="gap-2">
      {title && (
        <Text variant="lg" className="font-semibold">
          {title}
        </Text>
      )}

      {items.length > 0 ? (
        <View className="gap-2">
          {items.map((item) => (
            <PersonalReservationCard
              key={generateReservationKey(item)}
              action={getReservationAction(item)}
              item={item}
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
