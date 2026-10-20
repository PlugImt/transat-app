import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { paths } from "@/navigation/paths";

export const TimetableLoadingWidget = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <View className="flex flex-col gap-2">
      <TextSkeleton lastLineWidth={128} />
      <TouchableOpacity
        onPress={() => router.push(paths.timetable)}
        className="px-6 py-4 rounded-lg flex flex-col gap-6"
        style={{ backgroundColor: theme.card }}
      >
        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton key={index} />
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
