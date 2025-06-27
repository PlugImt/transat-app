import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { TimetableCourseWidget } from "@/components/custom/widget/TimetableCourseWidget";
import { TimetableLoadingWidget } from "@/components/custom/widget/TimetableLoadingWidget";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { useTimetable } from "@/hooks/useTimetable";
import type { AppStackParamList } from "@/services/storage/types";
import type { Course } from "@/types/timetable";

export type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function TimetableWidget() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navigation = useNavigation<AppScreenNavigationProp>();

  const { user } = useAuth();

  const {
    data: edt,
    isPending: isPendingEdt,
    error,
  } = useTimetable(user?.email || '');

  const CUT_OFF_HOUR = 12;
  const CUT_OFF_MINUTE = 30;

  const now = new Date();
  const isMorningNow =
    now.getHours() < CUT_OFF_HOUR ||
    (now.getHours() === CUT_OFF_HOUR && now.getMinutes() < CUT_OFF_MINUTE);

  const parseTimeToDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const cutoff = new Date();
  cutoff.setHours(CUT_OFF_HOUR, CUT_OFF_MINUTE, 0, 0);

  const isInMorning = (course: Course) => {
    const [startHour, startMinute] = course.start_time.split('h').map(Number);
    return (
      startHour < CUT_OFF_HOUR ||
      (startHour === CUT_OFF_HOUR && startMinute < CUT_OFF_MINUTE)
    );
  };

  const isInAfternoon = (course: Course) => {
    const [endHour, endMinute] = course.end_time.split('h').map(Number);
    return (
      endHour > CUT_OFF_HOUR ||
      (endHour === CUT_OFF_HOUR && endMinute >= CUT_OFF_MINUTE)
    );
  };

  const isoToHourString = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}h${minutes}`;
  };
  const parsedEdt = edt?.map(course => ({
    ...course,
    date: new Date(course.date),
    start_time: isoToHourString(course.start_time),
    end_time: isoToHourString(course.end_time),
  }));

  const morningCourses: Course[] | undefined =
    parsedEdt?.filter(isInMorning);
  const afternoonCourses: Course[] | undefined =
    parsedEdt?.filter(isInAfternoon);

  console.log("parsedEdt", parsedEdt);
  console.log("morningCourses", morningCourses)
  console.log("afternonCourses", afternoonCourses)

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
        <Text style={{ color: theme.text }} className="h3 ml-4">
          {t('services.timetable.title')}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Timetable')}
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
                  {t('services.timetable.noEdt.title')}
                </Text>
                <Text
                  className="text-sm ml-4 font-bold"
                  style={{ color: theme.primary }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noEdt.description')}
                </Text>
              </>
            ) : noCoursesToday ? (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noCourses.dayTitle')}
                </Text>
                <Text
                  className="text-sm ml-4 italic"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noCourses.description')}
                </Text>
              </>
            ) : isMorningNow && noCoursesMorning ? (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noCourses.morningTitle')}
                </Text>
                <Text
                  className="text-sm ml-4 italic"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noCourses.description')}
                </Text>
              </>
            ) : (
              <>
                <Text
                  className="text-base ml-4"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noCourses.afternoonTitle')}
                </Text>
                <Text
                  className="text-sm ml-4 italic"
                  style={{ color: theme.text }}
                  ellipsizeMode="tail"
                >
                  {t('services.timetable.noCourses.description')}
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
        {t('services.timetable.title')}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Timetable')}
        className="rounded-lg flex flex-col gap-3"
      >
        {filteredCourses?.map((course: Course) => (
          <TimetableCourseWidget key={course.id} course={course} />
        ))}
      </TouchableOpacity>
    </View>
  );
}

export default TimetableWidget;
