import { useTheme } from "@/contexts/ThemeContext";
import { useEmploiDuTemps } from "@/hooks/useEmploiDuTemps";
import type { AppStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

import { EmploiDuTempsWidgetCourse } from "@/components/custom/widget/EmploiDuTempsWidgetCourse";
import { EmploiDuTempsWidgetLoading } from "@/components/custom/widget/EmploiDuTempsWidgetLoading";
import { useAuth } from "@/hooks/account/useAuth";
import type { Course } from "@/types/emploiDuTemps";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function EmploiDuTempsWidget() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navigation = useNavigation<AppScreenNavigationProp>();

  const { user } = useAuth();

  const {
    data: edt,
    isPending: isPendingEdt,
    error,
  } = useEmploiDuTemps(user?.email || "");

  const CUT_OFF_HOUR = 12;
  const CUT_OFF_MINUTE = 30;

  const now = new Date();
  const isMorningNow =
    now.getHours() < CUT_OFF_HOUR ||
    (now.getHours() === CUT_OFF_HOUR && now.getMinutes() < CUT_OFF_MINUTE);

  const parseTimeToDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const cutoff = new Date();
  cutoff.setHours(CUT_OFF_HOUR, CUT_OFF_MINUTE, 0, 0);

  const isInMorning = (course: Course) => {
    const heureDebut = parseTimeToDate(course.heure_debut);
    return heureDebut < cutoff;
  };

  const isInAfternoon = (course: Course) => {
    const heureFin = parseTimeToDate(course.heure_fin);
    return heureFin > cutoff;
  };

  const morningCourses: Course[] | undefined =
    edt?.courses?.filter(isInMorning);
  const afternoonCourses: Course[] | undefined =
    edt?.courses?.filter(isInAfternoon);

  const filteredCourses: Course[] | undefined = isMorningNow
    ? morningCourses
    : afternoonCourses;

  const noCoursesMorning = morningCourses?.length === 0;
  const noCoursesAfternoon = afternoonCourses?.length === 0;
  const noCoursesToday = !morningCourses?.length && !afternoonCourses?.length;

  if (isPendingEdt) {
    return <EmploiDuTempsWidgetLoading />;
  }

  if (
    error ||
    noCoursesToday ||
    (isMorningNow && noCoursesMorning) ||
    (!isMorningNow && noCoursesAfternoon)
  ) {
    return (
      <View className="flex flex-col gap-2 mr-2">
        <Text style={{ color: theme.text }} className="h3 ml-4">
          {t("services.emploiDuTemps.title")}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EmploiDuTemps")}
          className="rounded-lg flex flex-col gap-3"
        >
          <View className="flex flex-col">
            {error ? (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noEdt.title")}
                </Text>
                <Text
                  className="text-base ml-4 font-bold"
                  style={{ color: theme.primary }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noEdt.description")}
                </Text>
              </>
            ) : noCoursesToday ? (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noCourses.dayTitle")}
                </Text>
                <Text
                  className="text-base ml-4 italic"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noCourses.description")}
                </Text>
              </>
            ) : isMorningNow && noCoursesMorning ? (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noCourses.morningTitle")}
                </Text>
                <Text
                  className="text-base ml-4 italic"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noCourses.description")}
                </Text>
              </>
            ) : (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noCourses.afternoonTitle")}
                </Text>
                <Text
                  className="text-base ml-4 italic"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t("services.emploiDuTemps.noCourses.description")}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-2">
      <Text style={{ color: theme.text }} className="h3 ml-4">
        {t("services.emploiDuTemps.title")}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("EmploiDuTemps")}
        className="rounded-lg flex flex-col gap-3"
      >
        {filteredCourses?.map((course: Course) => (
          <EmploiDuTempsWidgetCourse key={course.id} course={course} />
        ))}
      </TouchableOpacity>
    </View>
  );
}

export default EmploiDuTempsWidget;
