import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CheckCircle2, Eye, Shield } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View, ScrollView } from "react-native";
import { MotiView } from "moti";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/hooks/account/useUser";
import type { OnboardingStackParamList } from "@/app/navigation/OnboardingNavigator";
import type { User } from "@/dto";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface OnboardingPreviewProps {
  route: {
    params: { user: User };
  };
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingPreview = ({
  route,
  onComplete,
  onSkip,
}: OnboardingPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { data: currentUser } = useUser();
  const displayUser = currentUser || route.params.user;

  const handleComplete = () => {
    navigation.navigate("Success");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScrollView
        className="flex-1 px-6 py-8"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 600,
          }}
          className="flex-1"
        >
          <View className="gap-6 mb-8">
            <View className="items-center gap-4">
              <MotiView
                from={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 150,
                }}
              >
                <Avatar user={displayUser} size={120} />
              </MotiView>
              <View className="items-center gap-2">
                <Text variant="h1">
                  {displayUser.first_name} {displayUser.last_name}
                </Text>
                <Text variant="body" color="muted">
                  {displayUser.email}
                </Text>
              </View>
            </View>

            <View
              className="rounded-lg p-4 gap-4"
              style={{ backgroundColor: theme.card }}
            >
              <View className="flex-row items-center gap-3">
                <Eye size={20} color={theme.text} />
                <View className="flex-1">
                  <Text variant="sm" className="font-semibold">
                    {t("onboarding.preview.publicVisibility")}
                  </Text>
                  <Text variant="sm" color="muted">
                    {t("onboarding.preview.publicVisibilityDescription")}
                  </Text>
                </View>
              </View>

              <View className="gap-3 pt-2 border-t" style={{ borderColor: theme.border }}>
                {displayUser.phone_number && (
                  <View className="flex-row items-center gap-2">
                    <CheckCircle2 size={16} color={theme.primary} />
                    <Text variant="sm">Téléphone : {displayUser.phone_number}</Text>
                  </View>
                )}
                {displayUser.formation_name && (
                  <View className="flex-row items-center gap-2">
                    <CheckCircle2 size={16} color={theme.primary} />
                    <Text variant="sm">Formation : {displayUser.formation_name}</Text>
                  </View>
                )}
                {displayUser.graduation_year && (
                  <View className="flex-row items-center gap-2">
                    <CheckCircle2 size={16} color={theme.primary} />
                    <Text variant="sm">
                      Année de diplôme : {displayUser.graduation_year}
                    </Text>
                  </View>
                )}
                {displayUser.profile_picture && (
                  <View className="flex-row items-center gap-2">
                    <CheckCircle2 size={16} color={theme.primary} />
                    <Text variant="sm">Photo de profil</Text>
                  </View>
                )}
              </View>

              <View
                className="flex-row items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: `${theme.primary}20` }}
              >
                <Shield size={18} color={theme.primary} />
                <Text variant="sm" style={{ color: theme.primary }}>
                  {t("onboarding.preview.privacyNotice")}
                </Text>
              </View>
            </View>
          </View>
        </MotiView>
      </ScrollView>

      <View className="px-6 pb-8 gap-3">
        <Button
          label={t("onboarding.preview.validate")}
          onPress={handleComplete}
        />
        <Button label={t("onboarding.preview.skip")} variant="ghost" onPress={onSkip} />
      </View>
    </View>
  );
};
