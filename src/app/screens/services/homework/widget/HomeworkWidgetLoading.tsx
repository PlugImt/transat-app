import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import type { AppScreenNavigationProp } from "@/app/screens/services/schedule/widget/TimetableWidget";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";

export const HomeworkWidgetLoading = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <View className="flex flex-col gap-2">
      <TextSkeleton lastLineWidth={128} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Homework")}
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
            <TextSkeleton key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton key={index} />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};
