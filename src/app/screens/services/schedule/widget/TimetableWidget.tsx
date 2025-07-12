import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import type { Course } from "@/dto";
import { useAuth } from "@/hooks/account/useAuth";
import { useTimetable } from "@/hooks/useTimetable";
import type { AppStackParamList } from "@/services/storage/types";
import { TimetableCourseWidget } from "./TimetableCourseWidget";
import { TimetableLoadingWidget } from "./TimetableLoadingWidget";

export type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const TimetableWidget = () => {
  const { t } = useTranslation();

  const navigation = useNavigation<AppScreenNavigationProp>();

  const { user } = useAuth();

  const {
    data: edt,
    isPending: isPendingEdt,
    error,
  } = useTimetable(user?.email || "");

  const CUT_OFF_HOUR = 12;
  const CUT_OFF_MINUTE = 30;

  const now = new Date();
  const isMorningNow =
    now.getHours() < CUT_OFF_HOUR ||
    (now.getHours() === CUT_OFF_HOUR && now.getMinutes() < CUT_OFF_MINUTE);

  const cutoff = new Date();
  cutoff.setHours(CUT_OFF_HOUR, CUT_OFF_MINUTE, 0, 0);

  const isInMorning = (course: Course) => {
    const [startHour, startMinute] = course.start_time.split("h").map(Number);
    return (
      startHour < CUT_OFF_HOUR ||
      (startHour === CUT_OFF_HOUR && startMinute < CUT_OFF_MINUTE)
    );
  };

  const isInAfternoon = (course: Course) => {
    const [endHour, endMinute] = course.end_time.split("h").map(Number);
    return (
      endHour > CUT_OFF_HOUR ||
      (endHour === CUT_OFF_HOUR && endMinute >= CUT_OFF_MINUTE)
    );
  };

  const isoToHourString = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}h${minutes}`;
  };
  const parsedEdt = edt?.map((course: Course) => ({
    ...course,
    date: new Date(course.date),
    start_time: isoToHourString(course.start_time),
    end_time: isoToHourString(course.end_time),
  }));

  const morningCourses: Course[] | undefined = parsedEdt?.filter(isInMorning);
  const afternoonCourses: Course[] | undefined =
    parsedEdt?.filter(isInAfternoon);

  const filteredCourses: Course[] | undefined = isMorningNow
    ? morningCourses
    : afternoonCourses;

  const noCoursesMorning = morningCourses?.length === 0;
  const noCoursesAfternoon = afternoonCourses?.length === 0;
  const noCoursesToday = !morningCourses?.length && !afternoonCourses?.length;

  if (isPendingEdt) {
    return <TimetableLoadingWidget />;
  }

  if (
    error ||
    noCoursesToday ||
    (isMorningNow && noCoursesMorning) ||
    (!isMorningNow && noCoursesAfternoon)
  ) {
    return (
      <View className="flex flex-col gap-2 mr-2">
        <Text className="ml-4" variant="h3">
          {t("services.timetable.title")}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Timetable")}
          className="rounded-lg flex flex-col gap-3"
        >
          <View className="flex flex-col">
            {error ? (
              <>
                <Text className="ml-4" ellipsizeMode="tail">
                  {t("services.timetable.noEdt.title")}
                </Text>
                <Text
                  className="ml-4 font-bold"
                  color="primary"
                  ellipsizeMode="tail"
                >
                  {t("services.timetable.noEdt.description")}
                </Text>
              </>
            ) : noCoursesToday ? (
              <>
                <Text className="ml-4" ellipsizeMode="tail">
                  {t("services.timetable.noCourses.dayTitle")}
                </Text>
                <Text className="ml-4 italic" variant="sm" ellipsizeMode="tail">
                  {t("services.timetable.noCourses.description")}
                </Text>
              </>
            ) : isMorningNow && noCoursesMorning ? (
              <>
                <Text className="ml-4" ellipsizeMode="tail">
                  {t("services.timetable.noCourses.morningTitle")}
                </Text>
                <Text className="ml-4 italic" variant="sm" ellipsizeMode="tail">
                  {t("services.timetable.noCourses.description")}
                </Text>
              </>
            ) : (
              <>
                <Text className="ml-4" ellipsizeMode="tail">
                  {t("services.timetable.noCourses.afternoonTitle")}
                </Text>
                <Text className="ml-4 italic" variant="sm" ellipsizeMode="tail">
                  {t("services.timetable.noCourses.description")}
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
      <Text className="ml-4" variant="h3">
        {t("services.timetable.title")}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Timetable")}
        className="rounded-lg flex flex-col gap-3"
      >
        {filteredCourses?.map((course: Course) => (
          <TimetableCourseWidget key={course.id} course={course} />
        ))}
      </TouchableOpacity>
    </View>
  );
};

export default TimetableWidget;
