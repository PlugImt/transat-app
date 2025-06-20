import WashingMachineCard from "@/components/custom/card/WashingMachineCard";
import { useTheme } from "@/contexts/ThemeContext";
import { MachineData } from "@/dto";
import { View, Text } from "react-native";

interface MachineProps {
    title: string;
    items: MachineData[];
    icon: "WASHING MACHINE" | "DRYER";
};

export const MachineList = ({ title, items, icon } : MachineProps) => {
    const { theme } = useTheme();

    if (items.length === 0) return null;

    return (
        <View className="flex-col gap-4">
        <Text style={{ color: theme.text }} className="text-xl font-bold ml-4">
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
}