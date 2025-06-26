import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import Page from "@/components/common/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppStackParamList } from "@/services/storage/types";

type HomeworkDetailsRouteProp = RouteProp<AppStackParamList, "HomeworkDetails">;

export default function HomeworkDetails() {
  const route = useRoute<HomeworkDetailsRouteProp>();
  const { homework } = route.params;
  const { i18n, t } = useTranslation();
  const { theme } = useTheme();

  const locale = i18n.language === "fr" ? fr : enUS;

  const deadline = format(new Date(homework.deadline), "PPP '—' p", { locale });
  const createdAt = format(new Date(homework.created_at), "PPP '—' p", {
    locale,
  });
  const updatedAt = format(new Date(homework.updated_at), "PPP '—' p", {
    locale,
  });

  const isEdited = homework.created_at !== homework.updated_at;

  return (
    <Page title={t("services.homework.title")} goBack>
      <ScrollView
        className="flex-1 p-4"
        style={{ backgroundColor: theme.background }}
      >
        <View className="flex flex-col gap-4">
          <Text className="text-xl font-bold" style={{ color: theme.text }}>
            {homework.title}
          </Text>

          <Text className="text-base italic" style={{ color: theme.text }}>
            {homework.course_name}
          </Text>

          <Text className="text-base" style={{ color: theme.text }}>
            {homework.description}
          </Text>

          <Text
            className="text-sm mt-4 italic"
            style={{ color: theme.primary }}
          >
            📅 {t("services.homework.deadline")} : {deadline}
          </Text>

          <View className="h-[1px] bg-gray-400 my-3" />

          <Text className="text-sm" style={{ color: theme.text }}>
            🧑‍🏫 {t("services.homework.author")} : {homework.author}
          </Text>

          <Text className="text-sm" style={{ color: theme.text }}>
            🕒 {t("services.homework.createdAt")} : {createdAt}
          </Text>

          {isEdited && (
            <Text className="text-sm" style={{ color: theme.text }}>
              ✏️ {t("services.homework.updatedAt")} : {updatedAt}
            </Text>
          )}
        </View>
      </ScrollView>
    </Page>
  );
}
