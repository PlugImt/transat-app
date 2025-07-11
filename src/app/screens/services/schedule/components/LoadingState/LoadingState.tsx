import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

export const LoadingState = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Page
      goBack
      title={t("services.timetable.title")}
      about={
        <AboutModal
          title={t("services.timetable.title")}
          description={t("services.timetable.about")}
          additionalInfo={t("services.timetable.additionalInfo")}
        />
      }
    >
      <View className="flex-col">
        <Text className="text-center" style={{ color: theme.text }}>
          {t("services.timetable.loading")}
        </Text>
      </View>
    </Page>
  );
};
