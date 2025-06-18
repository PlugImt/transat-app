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
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date); // mercredi
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);     // juin
  const year = date.getFullYear();                                                   // 2025
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
      <View className="flex-row">
        <Horaires />

        {/*{edt}*/}
        <View className="flex-col w-full gap-1">
          <Cours course={course} />
          <Cours course={course} />
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
