import type { LucideIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

type GameCardProps = {
  title: string;
  Icon: LucideIcon;
  onPress: () => void;
};

export const GameCard = ({ title, Icon, onPress }: GameCardProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity className="items-center gap-2" onPress={onPress}>
      <Card className="w-24 h-24 items-center justify-center">
        <Icon size={38} color={theme.primary} />
      </Card>
      <Text className="text-center font-bold">{title}</Text>
    </TouchableOpacity>
  );
};
