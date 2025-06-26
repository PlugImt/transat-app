import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import HomeworkCard from "@/components/custom/card/HomeworkCard";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useHomework } from "@/hooks/useHomework";
import type { Homework as HomeworkType } from "@/types/homework";

export const Homework = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const locale = i18n.language === "fr" ? fr : enUS;

  const { data, refetch, isPending, isError, error } = useHomework(
    user?.id_newf,
  );

  if (isPending) return <HomeworkLoading />;

  if (isError) {
    return (
      <Page
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.homework.title")}
        about={
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
        <View className="min-h-screen flex justify-center items-center">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  const groupedByDay = (data || []).reduce<Record<string, HomeworkType[]>>(
    (acc, hw) => {
      const dateKey = new Date(hw.deadline).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(hw);
      return acc;
    },
    {},
  );

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      goBack
      title={t("services.homework.title")}
      about={
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
      <View className="flex flex-col gap-8">
        {Object.entries(groupedByDay)
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .map(([dayKey, homeworks]) => (
            <View key={dayKey} className="flex flex-col gap-4">
              <View
                className="px-3 py-1 rounded-md self-start"
                style={{ backgroundColor: theme.secondary }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {/* Capitalise la première lettre manuellement */}
                  {format(new Date(dayKey), "EEEE dd MMMM", { locale }).replace(
                    /^./,
                    (c) => c.toUpperCase(),
                  )}
                </Text>
              </View>
              {homeworks.map((hw) => (
                <HomeworkCard key={hw.id} homework={hw} />
              ))}
            </View>
          ))}
      </View>
    </Page>
  );
};

export default Homework;

// Loading component identique
const HomeworkLoading = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("services.homework.title")}
      about={
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
        <Text className="text-base italic text-center">
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
