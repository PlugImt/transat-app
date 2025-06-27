import { Avatar, AvatarImage } from "@/components/common/Avatar";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { View } from "react-native";

export const WeatherSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="p-6 rounded-lg flex-row justify-between gap-6"
    >
      <View className="gap-2">
        <TextSkeleton variant="h3" className="w-64" lines={1} />
        <TextSkeleton variant="h1" className="w-32" lines={1} />
        <TextSkeleton variant="h3" className="w-32" lines={1} />
      </View>
      <Avatar className="w-24 h-24">
        <AvatarImage loading />
      </Avatar>
    </View>
  );
};
