import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";

export const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("services.timetable.title")}
      header={
        <AboutModal
          title={t("services.timetable.title")}
          description={t("services.timetable.about")}
          additionalInfo={t("services.timetable.additionalInfo")}
        />
      }
    >
      <View className="flex-col">
        <Text className="text-center">{t("services.timetable.loading")}</Text>
      </View>
    </Page>
  );
};
