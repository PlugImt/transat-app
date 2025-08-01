import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import HomeworkCard from "@/components/custom/card/HomeworkCard";
import { Page } from "@/components/page/Page";

export const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("services.homework.title")}
      header={
        <AboutModal
          title={t("services.homework.title")}
          description={t("services.homework.about")}
          openingHours="TEMP"
          location={t("services.homework.location")}
          price={t("services.homework.price")}
          additionalInfo={t("services.homework.additionalInfo")}
        />
      }
    >
      <View className="flex flex-col gap-4 mt-6 px-4">
        <Text className="italic text-center">
          {t("services.homework.loading")}
        </Text>
        <View className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <HomeworkCard
              key={i}
              homework={{
                id: i,
                author: 1,
                course_name: t("services.homework.loadingCourse"),
                title: t("services.homework.loadingTitle"),
                description: t("services.homework.loadingDescription"),
                deadline: new Date(),
                done: false,
                created_at: new Date(),
                updated_at: new Date(),
              }}
            />
          ))}
        </View>
      </View>
    </Page>
  );
};
