import { View } from "react-native";
import { Text } from "@/components/common/Text";
import LaundryCard from "@/components/custom/card/LaundryCard";
import type { LaundryData } from "@/dto";

interface LaundryProps {
  title: string;
  items: LaundryData[];
  icon: "WASHING MACHINE" | "DRYER";
}

export const LaundryList = ({ title, items, icon }: LaundryProps) => {
  if (items.length === 0) return null;

  return (
    <View className="flex-col gap-4">
      <Text variant="h3">{title}</Text>
      {items.map((item) => (
        <LaundryCard
          key={item.number}
          number={item.number.toString()}
          type={title}
          initialTimeLeft={item.time_left}
          icon={icon}
        />
      ))}
    </View>
  );
};
