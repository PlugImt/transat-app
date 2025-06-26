import { useTheme } from '@/contexts/ThemeContext';
import { useTimetable } from '@/hooks/useTimetable';
import type { AppStackParamList } from '@/services/storage/types';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { TimetableCourseWidget } from '@/components/custom/widget/TimetableCourseWidget';
import { TimetableLoadingWidget } from '@/components/custom/widget/TimetableLoadingWidget';
import { useAuth } from '@/hooks/account/useAuth';
import type { Course } from '@/types/timetable';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

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
    const heureDebut = parseTimeToDate(course.start_time);
    return heureDebut < cutoff;
  };

  const isInAfternoon = (course: Course) => {
    const heureFin = parseTimeToDate(course.end_time);
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
                  className="text-base ml-4 font-bold"
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
                  className="text-base ml-4 italic"
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
                  className="text-base ml-4 italic"
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
                  className="text-base ml-4 italic"
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
