import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppNavigation } from "@/types";

export const TimetableLoadingWidget = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <CardGroup title={t("services.timetable.title")}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Timetable")}
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
    </CardGroup>
  );
};
