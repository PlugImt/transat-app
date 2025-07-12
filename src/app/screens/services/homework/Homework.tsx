import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import HomeworkCard from "@/components/custom/card/HomeworkCard";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { Homework as HomeworkType } from "@/dto";
import { useHomework } from "@/hooks/useHomework";
import { ErrorState, LoadingState } from "./components";

export const Homework = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const locale = i18n.language === "fr" ? fr : enUS;

  const { data, isPending, refetch, error, isError } = useHomework();

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [showDone, setShowDone] = useState<null | boolean>(null); // null = tous, true = faits, false = non faits
  const [sortBy, setSortBy] = useState<"deadline" | "subject">("deadline");

  const uniqueSubjects = useMemo(() => {
    const allSubjects = (data || []).map((hw) => hw.course_name);
    return [...new Set(allSubjects)].sort();
  }, [data]);

  const filteredHomeworks = useMemo(() => {
    return (data || [])
      .filter((hw) => {
        const now = new Date();
        const deadline = new Date(hw.deadline);
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(now.getDate() - 15);

        const isLate = deadline < now && !hw.done;
        const isRecentLate = isLate && deadline >= fifteenDaysAgo;
        const isUpcoming = deadline >= now;

        // Exclure les devoirs en retard depuis plus de 15j sauf s'ils sont faits
        if (hw.done && deadline < now && deadline < fifteenDaysAgo)
          return false;
        if (!hw.done && !isUpcoming && !isRecentLate) return false;

        // Filtrage par matière
        if (selectedSubject && hw.course_name !== selectedSubject) return false;

        // Filtrage par fait / non fait
        if (showDone === true && !hw.done) return false;
        if (showDone === false && hw.done) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") {
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        }
        return a.course_name.localeCompare(b.course_name);
      });
  }, [data, showDone, sortBy, selectedSubject]);

  const groupedHomeworks = useMemo(() => {
    const groups: Record<string, HomeworkType[]> = {};
    filteredHomeworks.forEach((hw) => {
      const key =
        sortBy === "deadline"
          ? new Date(hw.deadline).toDateString()
          : hw.course_name;

      if (!groups[key]) groups[key] = [];
      groups[key].push(hw);
    });
    return groups;
  }, [filteredHomeworks, sortBy]);

  if (isPending) return <LoadingState />;

  if (isError)
    return (
      <ErrorState error={error} onRefresh={refetch} refreshing={isPending} />
    );

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      goBack
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
      <ScrollView className="flex flex-col gap-4">
        <View className="px-4 pt-2 pb-0 mb-8">
          <Text variant="lg" className="mb-2">
            {t("services.homework.filters")}
          </Text>
          <View
            style={{
              backgroundColor: theme.card,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(itemValue) => setSelectedSubject(itemValue)}
              mode="dropdown"
              style={{
                color: theme.text,
              }}
            >
              <Picker.Item
                style={{ fontSize: 15 }}
                label={t("services.homework.allSubjects")}
                value=""
              />
              {uniqueSubjects.map((subject) => (
                <Picker.Item
                  style={{ fontSize: 15 }}
                  key={subject}
                  label={subject}
                  value={subject}
                />
              ))}
            </Picker>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-3">
            <Button
              size="sm"
              variant={showDone === null ? "default" : "outlined"}
              label={t("services.homework.all")}
              onPress={() => setShowDone(null)}
            />
            <Button
              size="sm"
              variant={showDone === false ? "default" : "outlined"}
              label={t("services.homework.todo")}
              onPress={() => setShowDone(false)}
            />
            <Button
              size="sm"
              variant={showDone === true ? "default" : "outlined"}
              label={t("services.homework.done")}
              onPress={() => setShowDone(true)}
            />
          </View>

          <View className="flex-row flex-wrap gap-2 mt-3">
            <Button
              size="sm"
              variant={sortBy === "deadline" ? "default" : "outlined"}
              label={t("services.homework.sortByDeadline")}
              onPress={() => setSortBy("deadline")}
            />
            <Button
              size="sm"
              variant={sortBy === "subject" ? "default" : "outlined"}
              label={t("services.homework.sortBySubject")}
              onPress={() => setSortBy("subject")}
            />
          </View>
        </View>

        <View className="flex flex-col gap-8 px-4 pb-4">
          {Object.keys(groupedHomeworks).length === 0 ? (
            <View className="items-center justify-center mt-6">
              <Text className="text-center italic">
                {t("services.homework.noHomework")}
              </Text>
            </View>
          ) : (
            Object.entries(groupedHomeworks)
              .sort(([a], [b]) =>
                sortBy === "deadline"
                  ? new Date(a).getTime() - new Date(b).getTime()
                  : a.localeCompare(b),
              )
              .map(([groupKey, homeworks]) => (
                <View key={groupKey} className="flex flex-col gap-4">
                  <View
                    className="px-3 py-1 rounded-md self-start"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    <Text className="font-semibold" variant="sm">
                      {sortBy === "deadline"
                        ? format(new Date(groupKey), "EEEE dd MMMM", {
                            locale,
                          }).replace(/^./, (c) => c.toUpperCase())
                        : groupKey}
                    </Text>
                  </View>
                  {homeworks.map((hw) => (
                    <HomeworkCard key={hw.id} homework={hw} />
                  ))}
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </Page>
  );
};

export default Homework;
