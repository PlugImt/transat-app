import { TextSkeleton } from '@/components/Skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { useEmploiDuTemps } from '@/hooks/useEmploiDuTemps';
import type { AppStackParamList } from '@/services/storage/types';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useUser } from '@/hooks/account/useUser';
import type { Course } from '@/types/emploiDuTemps';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function EmploiDuTempsWidget() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { data: user } = useUser();

  const navigation = useNavigation<AppScreenNavigationProp>();

  const {
    data: edt,
    isPending: isPendingEdt,
    error,
  } = useEmploiDuTemps(user?.email || "");

  const edtWithMockData = {
    ...edt,
    courses: [
      ...(edt?.courses || []),
      {
        id: 1,
        date: new Date(),
        titre: "Méthodes Numériques - Cours 1",
        heure_debut: "08:00",
        heure_fin: "10:00",
        profs: "M. Dupont",
        salles: "NA-J144 (V-40)",
        groupe: "Groupe A",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        date: new Date(),
        titre: "Physique",
        heure_debut: "10:30",
        heure_fin: "12:30",
        profs: "Mme Martin",
        salles: "Salle 102",
        groupe: "Groupe B",
        created_at: new Date().toISOString(),
      },
    ],
  };

  const title = t("services.emploiDuTemps.title");

  if (isPendingEdt) {
    return <EmploiDuTempsWidgetLoading />;
  }

  if (error) {
    return (
      <View className="flex flex-col gap-2 mr-2">
        <Text style={{ color: theme.text }} className="h3 ml-4">
          {t("services.emploiDuTemps.title")}
        </Text>

        <View className="flex flex-col">
          <>
            <Text
              className="text-base ml-4"
              style={{ color: theme.text }}
              ellipsizeMode="tail"
            >
              {t("services.emploiDuTemps.noEdt.title")}
            </Text>

            <Text
              className="text-base ml-4 bold"
              style={{ color: theme.primary }}
              ellipsizeMode="tail"
            >
              {t("services.emploiDuTemps.noEdt.description")}
            </Text>
          </>
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-2">
      <Text style={{ color: theme.text }} className="h3 ml-4">
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("EmploiDuTemps")}
        className="rounded-lg flex flex-col gap-3"
      >
        {edtWithMockData?.courses.map((course: Course) => (
          <View
            key={course.id}
            className="flex flex-col rounded-lg gap-1.5 py-2"
            style={{ backgroundColor: theme.card }}
          >
            <Text
              className="text-base ml-4"
              style={{ color: theme.text }}
              ellipsizeMode="tail"
            >
              {course.titre}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <Text
                className="text-sm ml-4"
                style={{ color: theme.text }}
                ellipsizeMode="tail"
              >
                {course.heure_debut} - {course.heure_fin}
              </Text>
              <View>
                <Text
                  className="pl-1 pr-1 rounded-md text-base ml-4"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.background,
                  }}
                  ellipsizeMode="tail"
                >
                  {course.salles}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
}

export default EmploiDuTempsWidget;

export const EmploiDuTempsWidgetLoading = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <View className="flex flex-col gap-2">
      <TextSkeleton lines={1} lastLineWidth={128} />
      <TouchableOpacity
        onPress={() => navigation.navigate("EmploiDuTemps")}
        className="px-6 py-4 rounded-lg flex flex-col gap-6"
        style={{ backgroundColor: theme.card }}
      >
        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};
