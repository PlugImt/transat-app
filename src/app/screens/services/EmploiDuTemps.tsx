import Page from '@/components/common/Page';
import { AboutModal } from '@/components/custom/AboutModal';
import { useEmploiDuTemps } from '@/hooks/useEmploiDuTemps';
import useAuth from '@/hooks/account/useAuth';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Horaires } from '@/components/custom/Horaires';
import i18n from '@/i18n';
import { ar, de, es, fr, hi, it, ja, ko, nl, pl, pt, ru, sv, tr, zhCN } from 'date-fns/locale';
import { Course } from '@/types/emploiDuTemps';
import { Cours } from '@/app/screens/services/Cours';
import { useEffect, useState } from 'react';

export const EmploiDuTemps = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const date = new Date();

  // TODO : A mettre en commun
  const getLocale = () => {
    switch (i18n.language) {
      case "fr":
        return fr;
      case "de":
        return de;
      case "es":
        return es;
      case "zh":
        return zhCN;
      case "ru":
        return ru;
      case "it":
        return it;
      case "ja":
        return ja;
      case "ko":
        return ko;
      case "pt":
        return pt;
      case "nl":
        return nl;
      case "ar":
        return ar;
      case "hi":
        return hi;
      case "sv":
        return sv;
      case "tr":
        return tr;
      case "pl":
        return pl;
      default:
        return undefined;
    }
  };
  //const locale = getLocale();
  const locale = "fr-FR";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  const year = date.getFullYear();
  const dayNumber = date.getDate();

  const { user } = useAuth();

  const { refetch, isError, isPending, error } = useEmploiDuTemps(
    user?.email || "",
  );

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

  let courses: Course[] = [
    course, course2, course3
  ]

  const HOUR_HEIGHT = 60; // 60 pixels = 1 heure
  const START_HOUR = 8;
  const END_HOUR = 18;
  const TOTAL_HOURS = END_HOUR - START_HOUR;

  const toMinutes = (heure: string) => {
    const [h, m] = heure.split(/[h:]/).map(Number);
    return h * 60 + m;
  };

  function getNowTimeForLine() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const minutesSinceStart = (currentHour - START_HOUR) * 60 + currentMinutes;
    return (minutesSinceStart / 60) * HOUR_HEIGHT + 16; // 16 car cest le padding top pour que les cours soient alignés avec les horaires
  }

  const [nowTimeLine, setNowTimeForLine] = useState(getNowTimeForLine());

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimeForLine(getNowTimeForLine());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
      className="flex-col gap-16 p-5"
    >
      {/*{header}*/}
      <View className="flex-row items-center gap-2 justify-end">
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

      {/*{content}*/}
      <View className="flex-row h-full">
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
          <View
            style={{ top: nowTimeLine, backgroundColor: theme.destructive }}
            className="absolute -left-2 right-0 h-0.5 z-50"
          />

          {/* ligne horaire dans le fond */}
          {Array.from({ length: TOTAL_HOURS }).map((_, index) => (
            <View key={index} style={{ height: HOUR_HEIGHT, borderColor: theme.card }} className="border-t" />
          ))}

          {/* cours */}
          {courses.map((cours, i) => {
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
                <Cours course={cours} />
              </View>
            );
          })}
        </View>
      </View>

    </Page>
  );
};

export default EmploiDuTemps;

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
                Loading....
            </Text>
        </View>
    </Page>
  );
};
