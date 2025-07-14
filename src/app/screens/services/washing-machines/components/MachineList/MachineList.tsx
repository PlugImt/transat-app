import { View } from "react-native";
import { Text } from "@/components/common/Text";
import WashingMachineCard from "@/components/custom/card/WashingMachineCard";
import type { MachineData } from "@/dto";

interface MachineProps {
  title: string;
  items: MachineData[];
  icon: "WASHING MACHINE" | "DRYER";
}

export const MachineList = ({ title, items, icon }: MachineProps) => {
  if (items.length === 0) return null;

  return (
    <View className="flex-col gap-4">
      <Text className="ml-4" variant="h3">
        {title}
      </Text>
      {items.map((item) => (
        <WashingMachineCard
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
