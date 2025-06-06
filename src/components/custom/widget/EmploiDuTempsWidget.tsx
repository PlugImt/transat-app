import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useEmploiDuTemps } from "@/hooks/useEmploiDuTemps";
import type { AppStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function EmploiDuTempsWidget() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navigation = useNavigation<AppScreenNavigationProp>();
  const { data: edt, isPending, error } = useEmploiDuTemps();

  const title = t("services.emploiDuTemps.title");

  if (isPending) {
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
        style={{ backgroundColor: theme.card }}
        className="px-6 py-4 rounded-lg flex flex-col gap-6"
      >
        {edt?.updated_date}
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
