import Page from '@/components/common/Page';
import { AboutModal } from '@/components/custom/AboutModal';
import { useTimetable } from '@/hooks/useTimetable';
import useAuth from '@/hooks/account/useAuth';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import type { Course } from '@/types/timetable';
import { Cours } from '@/app/screens/services/Cours';
import { Key, useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const Timetable = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { data: edt, refetch, isPending: isPendingEdt, isError, error } = useTimetable(
    user?.email || '',
  );

  /* <SWIPE> */
  const translateX = useSharedValue(0);

  const changeDay = (direction: 'next' | 'prev') => {
    setSelectedDate(prev =>
      new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + (direction === 'next' ? 1 : -1)),
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const SWIPE_THRESHOLD = 50;

      if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(changeDay)('next');
      } else if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(changeDay)('prev');
      }

      translateX.value = withTiming(0); // Reset position
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  /* </SWIPE> */

  /* <Cours et date> */
  const locale = 'fr-FR';
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(selectedDate);
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(selectedDate);
  const year = selectedDate.getFullYear();
  const dayNumber = selectedDate.getDate();

  /* DONNEES DE TESTS */
  // TODO : A supprimer
  const course: Course = {
    room: 'J144',
    id: 0,
    date: new Date(),
    title: 'Méthodes numériques',
    start_time: '8h00',
    end_time: '9h15',
    teacher: 'Frédéric Jourdan',
    group: '',
    created_at: '',
    user_email: '',
  };

  const course2: Course = {
    room: 'J144',
    id: 0,
    date: new Date(),
    title: 'Méthodes numériques',
    start_time: '9h30',
    end_time: '10h45',
    teacher: 'Frédéric Jourdan',
    group: '',
    created_at: '',
    user_email: '',
  };

  const course3: Course = {
    room: 'J144',
    id: 0,
    date: new Date(),
    title: 'Méthodes numériques',
    start_time: '13h30',
    end_time: '16h45',
    teacher: 'Frédéric Jourdan',
    group: '',
    created_at: '',
    user_email: '',
  };

  const course4: Course = {
    room: 'J144',
    id: 0,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    title: 'SOUTENANCE ESE',
    start_time: '8h00',
    end_time: '12h15',
    teacher: 'Janis Truc',
    group: '',
    created_at: '',
    user_email: '',
  };

  const course5: Course = {
    room: 'J144',
    id: 0,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    title: 'SOUTENANCE ESE',
    start_time: '13h30',
    end_time: '17h45',
    teacher: 'Janis Truc',
    group: '',
    created_at: '',
    user_email: '',
  };
  const courses: Course[] = [
    course, course2, course3, course4, course5,
  ];
  /* / DONNEES DE TEST */

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
  const filteredCourses = parsedEdt?.filter(course =>
    new Date(course.date).toDateString() === selectedDate.toDateString(),
  );

  {/* Gérer la date pour la ligne rouge = heure actuelle */
  }
  const HOUR_HEIGHT = 60; // 60 pixels = 1 heure
  const START_HOUR = 8;
  const END_HOUR = 18;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const toMinutes = (heure: string) => {
    const [h, m] = heure.split(/[h:]/).map(Number);
    return h * 60 + m;
  };

  function isCourseOver(heureFin: string) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const [h, m] = heureFin.split(/[h:]/).map(Number);
    if (now.getDay() === selectedDate.getDay() && now.getMonth() === selectedDate.getMonth() && now.getFullYear() === selectedDate.getFullYear()) {
      if (currentHour > h)
        return true;
      return currentHour === h && currentMinutes > m;
    }
    return false;
  }

  function getNowTimeForLine() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const minutesSinceStart = (currentHour - START_HOUR) * 60 + currentMinutes;
    return (minutesSinceStart / 60) * HOUR_HEIGHT + 10; // +10 pour que la ligne soit alignés avec les horaires
  }

  const [nowTimeLine, setNowTimeForLine] = useState(getNowTimeForLine());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimeForLine(getNowTimeForLine());
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  /* </Cours et date> */


  if (isPendingEdt) {
    return <TimetableLoading />;
  }

  return (
    <Page
      goBack
      refreshing={isPendingEdt}
      onRefresh={refetch}
      title={t('services.timetable.title')}
      about={
        <AboutModal
          title={t('services.timetable.title')}
          description={t('services.timetable.about')}
          additionalInfo={t('services.timetable.additionalInfo')}
        />
      }
      className="flex-col gap-8 p-5"
    >

      {/*{header : jour}*/}
      <View className="gap-2">
        {(edt === null || isError) && (
          <View>
            <Text style={{ color: theme.textTertiary }} className="italic">
              {t('services.timetable.noEdt.title')}
              {t('services.timetable.noEdt.description')}
            </Text>
            <Text style={{ color: theme.destructive }} className="italic">{error?.message}</Text>
          </View>
        )}
        <View className="flex-row items-center gap-2 justify-end">
          <View>
            <Text style={{ color: theme.text }} className="h2 text-right font-medium">
              {weekday}
            </Text>
            <Text style={{ color: theme.text }} className="text-right text-sm">
              {month} {year}
            </Text>
          </View>
          <Pressable
            onPress={() => setSelectedDate(new Date())}
          >
            {({ pressed }) =>
              (
                <View className={`rounded-xl items-center justify-center ${pressed ? 'opacity-60' : ''}`}
                      style={{ backgroundColor: theme.secondary }}>
                  <Text className="text-2xl font-semibold p-3 text-white">
                    {dayNumber}
                  </Text>
                </View>
              )}
          </Pressable>
        </View>
        {/*{jour navi}*/}
        <View className="flex-row justify-between items-center">
          <Button
            onPress={() => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1))}
            label="<"
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          />
          <Button
            onPress={() => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1))}
            label=">"
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          />
        </View>
      </View>

      {/*{content edt}*/}
      <View className="h-full">
        <GestureDetector gesture={panGesture}>
          <Animated.View className="flex-row h-full" style={animatedStyle}>
            {/* PARTIE horaire */}
            <View>
              {Array.from({ length: TOTAL_HOURS }).map((_, index) => {
                const hour = START_HOUR + index;
                return (
                  <View key={hour} className="justify-start items-end pr-2">
                    {/* heure */}
                    <View style={{ height: HOUR_HEIGHT / 4 }}>
                      <Text style={{ color: theme.text }}>{hour}h</Text>
                    </View>

                    {/* tirets (quart d’heure) */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <View key={i} style={{ height: HOUR_HEIGHT / 4 }}>
                        <Text style={{ color: theme.text }}>-</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>

            {/* PARTIE cours */}
            <View className="flex-1 relative pt-4">
              {/* ligne heure actuelle */}
              {isToday && (
                <><View
                  style={{ top: nowTimeLine, backgroundColor: theme.destructive }}
                  className="absolute -left-2 right-0 h-0.5 z-50"
                />
                  <View
                    style={{ top: nowTimeLine - 3, left: -8, backgroundColor: theme.destructive }}
                    className="absolute w-2 h-2 rounded-full"
                  />
                </>
              )}

              {/* ligne horaire dans le fond */}
              {Array.from({ length: TOTAL_HOURS }).map((_, index) => (
                <View key={index} style={{ height: HOUR_HEIGHT, borderColor: theme.card }} className="border-t" />
              ))}

              {/* cours */}
              {filteredCourses?.map((cours: Course, i: number) => {
                const startInMin = toMinutes(cours.start_time);
                const endInMin = toMinutes(cours.end_time);
                const baseInMin = START_HOUR * 60 - 14; // pour décalage top, pour synchro sur les heures
                const top = ((startInMin - baseInMin) / 60) * HOUR_HEIGHT;
                const height = ((endInMin - startInMin) / 60) * HOUR_HEIGHT;

                return (
                  <View
                    key={i}
                    style={{ top, height }}
                    className="absolute left-0 right-0 px-2"
                  >
                    <Cours course={cours} isOver={isCourseOver(cours.end_time)} />
                  </View>
                );
              })}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Page>
  );
};

const TimetableLoading = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Page
      goBack
      title={t('services.timetable.title')}
      about={
        <AboutModal
          title={t('services.timetable.title')}
          description={t('services.timetable.about')}
          additionalInfo={t('services.timetable.additionalInfo')}
        />
      }
    >
      <View className="flex-col">
        <Text className="text-center" style={{ color: theme.text }}>
          {t('services.timetable.loading')}
        </Text>
      </View>
    </Page>
  );
};
