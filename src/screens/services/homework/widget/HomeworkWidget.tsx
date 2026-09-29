import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { WidgetBoundary } from "@/components/query";
import type { Homework } from "@/dto";
import { useHomework } from "@/hooks/services/homework/useHomework";
import type { AppNavigation } from "@/types";
import { HomeworkWidgetItem } from "./HomeworkWidgetItem";
import { HomeworkWidgetLoading } from "./HomeworkWidgetLoading";

export const HomeworkWidget = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const {
    upcomingHomeworks,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useHomework();

  const emptyContent = (
    <View className="flex flex-col gap-2 mr-2">
      <Text className="ml-4" variant="h3">
        {t("services.homework.title")}
      </Text>
      <Text className="ml-4 italic">{t("services.homework.noHomework")}</Text>
    </View>
  );

  return (
    <WidgetBoundary
      title={t("services.homework.title")}
      query={{
        isPending,
        isFetching,
        isError,
        error,
        refetch,
      }}
      loading={<HomeworkWidgetLoading />}
      isEmpty={!upcomingHomeworks?.length}
      empty={emptyContent}
    >
      <View className="flex flex-col gap-2">
        <Text className="ml-4" variant="h3">
          {t("services.homework.title")}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Homework")}
          className="rounded-lg flex flex-col gap-3"
        >
          {upcomingHomeworks?.slice(0, 3).map((hw: Homework) => (
            <HomeworkWidgetItem key={hw.id} homework={hw} />
          ))}
        </TouchableOpacity>
      </View>
    </WidgetBoundary>
  );
};
