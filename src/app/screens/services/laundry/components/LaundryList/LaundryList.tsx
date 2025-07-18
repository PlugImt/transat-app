import { View } from "react-native";
import { Text } from "@/components/common/Text";
import LaundryCard from "@/components/custom/card/LaundryCard";
import type { MachineData } from "@/dto";

interface LaundryProps {
  title: string;
  items: MachineData[];
  icon: "WASHING MACHINE" | "DRYER";
}

export const LaundryList = ({ title, items, icon }: LaundryProps) => {
  if (items.length === 0) return null;

  return (
    <View className="flex-col gap-4">
      <Text className="ml-4" variant="h3">
        {title}
      </Text>
      {items.map((item) => (
        <LaundryCard
          key={item.number}
          number={item.number.toString()}
          type={title}
          status={item.time_left}
          icon={icon}
        />
      ))}
    </View>
  );
};
