import Page from '@/components/common/Page';
import { AboutModal } from '@/components/custom/AboutModal';
import { useEmploiDuTemps } from '@/hooks/useEmploiDuTemps';
import useAuth from '@/hooks/account/useAuth';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Course } from '@/types/emploiDuTemps';
import { Cours } from '@/app/screens/services/Cours';
import { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const EmploiDuTemps = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { refetch, isError, isPending, error } = useEmploiDuTemps(
    user?.email || "",
  );

  /* <SWIPE> */
  const translateX = useSharedValue(0);

  const changeDay = (direction: 'next' | 'prev') => {
    setSelectedDate(prev =>
      new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + (direction === 'next' ? 1 : -1))
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
  const locale = "fr-FR";
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(selectedDate);
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(selectedDate);
  const year = selectedDate.getFullYear();
  const dayNumber = selectedDate.getDate();

  /* DONNEES DE TESTS */
  // TODO : A supprimer
  const course: Course = {
    salles: 'J144',
    id: 0,
    date: new Date(),
    titre: 'Méthodes numériques',
    heure_debut: '8h00',
    heure_fin: '9h15',
    profs: 'Frédéric Jourdan',
    groupe: '',
    created_at: '',
  }

  const course2: Course = {
    salles: 'J144',
    id: 0,
    date: new Date(),
    titre: 'Méthodes numériques',
    heure_debut: '9h30',
    heure_fin: '10h45',
    profs: 'Frédéric Jourdan',
    groupe: '',
    created_at: '',
  }

  const course3: Course = {
    salles: 'J144',
    id: 0,
    date: new Date(),
    titre: 'Méthodes numériques',
    heure_debut: '13h30',
    heure_fin: '16h45',
    profs: 'Frédéric Jourdan',
    groupe: '',
    created_at: '',
  }

  const course4: Course = {
    salles: 'J144',
    id: 0,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    titre: 'SOUTENANCE ESE',
    heure_debut: '8h00',
    heure_fin: '12h15',
    profs: 'Janis Truc',
    groupe: '',
    created_at: '',
  }

  const course5: Course = {
    salles: 'J144',
    id: 0,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    titre: 'SOUTENANCE ESE',
    heure_debut: '13h30',
    heure_fin: '17h45',
    profs: 'Janis Truc',
    groupe: '',
    created_at: '',
  }

  /* / DONNEES DE TEST */

  const courses: Course[] = [
    course, course2, course3, course4, course5
  ]

  const filteredCourses = courses.filter(course =>
    new Date(course.date).toDateString() === selectedDate.toDateString()
  );

  {/* Gérer la date pour la ligne rouge = heure actuelle */ }
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
    if(currentHour > h)
      return true
    return currentHour == h && currentMinutes > m;
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



  if (isPending) {
    return <EmploiDuTempsLoading />;
  }

  if (isError) {
    return (
        <Page
        goBack
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.emploiDuTemps.title")}
        about={
          <AboutModal
            title={t("services.emploiDuTemps.title")}
            description={t("services.emploiDuTemps.about")}
            additionalInfo={t("services.emploiDuTemps.additionalInfo")}
          />
        }
      >
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      goBack
      refreshing={isPending}
      onRefresh={refetch}
      title={t("services.emploiDuTemps.title")}
      about={
        <AboutModal
          title={t("services.emploiDuTemps.title")}
          description={t("services.emploiDuTemps.about")}
          additionalInfo={t("services.emploiDuTemps.additionalInfo")}
        />
      }
      className="flex-col gap-8 p-5"
    >

      {/*{header : jour}*/}
      <Pressable
        onPress={() => setSelectedDate(new Date())}
      >
        {({ pressed }) =>
          (
            <View className="gap-2">
              <View className={`flex-row items-center gap-2 justify-end ${pressed ? "opacity-60" : ""}`}>
                <View>
                  <Text style={{ color: theme.text }} className="h2 text-right font-medium">
                    {weekday}
                  </Text>
                  <Text style={{ color: theme.text }} className="text-right text-sm">
                    {month} {year}
                  </Text>
                </View>
                <View className="rounded-xl items-center justify-center" style={{ backgroundColor: theme.secondary }}>
                  <Text style={{ color: theme.text }} className="text-2xl font-semibold p-3">
                    {dayNumber}
                  </Text>
                </View>
              </View>
              {/*{jour navi}*/}
              <View className="flex-row justify-between items-center">
                <Button
                  onPress={() => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1))}
                  label="<"
                  style={{ backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 }}
                />
                <Button
                  onPress={() => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1))}
                  label=">"
                  style={{ backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 }}
                />
              </View>
            </View>
        )}
      </Pressable>

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
                <View style={{ height: HOUR_HEIGHT / 4 }} >
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
              style={{ top: nowTimeLine - 3, left: -8, backgroundColor: theme.destructive  }}
              className="absolute w-2 h-2 rounded-full"
            />
            </>
          )}

          {/* ligne horaire dans le fond */}
          {Array.from({ length: TOTAL_HOURS }).map((_, index) => (
            <View key={index} style={{ height: HOUR_HEIGHT, borderColor: theme.card }} className="border-t" />
          ))}

          {/* cours */}
          {filteredCourses.map((cours, i) => {
            const startInMin = toMinutes(cours.heure_debut);
            const endInMin = toMinutes(cours.heure_fin);
            const baseInMin = START_HOUR * 60 - 14; // pour décalage top, pour synchro sur les heures
            const top = ((startInMin - baseInMin) / 60) * HOUR_HEIGHT;
            const height = ((endInMin - startInMin) / 60) * HOUR_HEIGHT;

            return (
              <View
                key={i}
                style={{ top, height }}
                className="absolute left-0 right-0 px-2"
              >
                <Cours course={cours} isOver={isCourseOver(cours.heure_fin)} />
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

const EmploiDuTempsLoading = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

  return (
    <Page
      goBack
      title={t("services.emploiDuTemps.title")}
      about={
        <AboutModal
          title={t("services.emploiDuTemps.title")}
          description={t("services.emploiDuTemps.about")}
          additionalInfo={t("services.emploiDuTemps.additionalInfo")}
        />
      }
    >
      <View className="flex-col">
        <Text className="text-center" style={{ color: theme.text }}>
          {t("services.emploiDuTemps.loading")}
        </Text>
      </View>
    </Page>
  );
};
