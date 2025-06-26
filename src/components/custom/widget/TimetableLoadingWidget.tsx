import { TextSkeleton } from "@/components/Skeleton";
import type { AppScreenNavigationProp } from "@/components/custom/widget/TimetableWidget";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";

export const TimetableLoadingWidget = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <View className="flex flex-col gap-2">
      <TextSkeleton lines={1} lastLineWidth={128} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Timetable")}
        className="px-6 py-4 rounded-lg flex flex-col gap-6"
        style={{ backgroundColor: theme.card }}
      >
        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};
