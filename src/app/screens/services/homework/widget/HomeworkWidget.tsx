import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { Homework } from "@/dto";
import { useHomework } from "@/hooks/useHomework";
import type { AppStackParamList } from "@/services/storage/types";
import { HomeworkWidgetItem } from "./HomeworkWidgetItem";
import { HomeworkWidgetLoading } from "./HomeworkWidgetLoading";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const HomeworkWidget = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { upcomingHomeworks, isPending, error } = useHomework();

  if (isPending) return <HomeworkWidgetLoading />;

  if (error || !upcomingHomeworks?.length) {
    return (
      <View className="flex flex-col gap-2 mr-2">
        <Text style={{ color: theme.text }} className="h3 ml-4">
          {t("services.homework.title")}
        </Text>
        <Text className="text-base ml-4 italic" style={{ color: theme.text }}>
          {t("services.homework.noHomework")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-2">
      <Text style={{ color: theme.text }} className="h3 ml-4">
        {t("services.homework.title")}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Homework")}
        className="rounded-lg flex flex-col gap-3"
      >
        {upcomingHomeworks.slice(0, 3).map((hw: Homework) => (
          <HomeworkWidgetItem key={hw.id} homework={hw} />
        ))}
      </TouchableOpacity>
    </View>
  );
};
