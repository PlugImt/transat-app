import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CheckCircle2, Shield, Phone, GraduationCap, User as UserIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  onSkipStep: () => void;
}

export const OnboardingPreview = ({
  route,
  onComplete,
  onSkipStep,
}: OnboardingPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { data: currentUser } = useUser();
  const displayUser = currentUser || route.params.user;

  const handleComplete = () => {
    navigation.navigate("Success");
  };

  type InfoItem = {
    icon: typeof Phone;
    label: string;
    value: string;
    color: string;
  };

  const infoItems: InfoItem[] = [
    {
      icon: Phone,
      label: t("account.phone"),
      value: displayUser.phone_number || t("account.notProvided"),
      color: displayUser.phone_number ? (theme.info || "#2196F3") : theme.muted,
    },
    {
      icon: GraduationCap,
      label: t("account.formationName"),
      value: displayUser.formation_name || t("account.notProvided"),
      color: displayUser.formation_name ? (theme.secondary || "#0049a8") : theme.muted,
    },
    {
      icon: GraduationCap,
      label: t("account.graduationYear"),
      value: displayUser.graduation_year ? displayUser.graduation_year.toString() : t("account.notProvided"),
      color: displayUser.graduation_year ? theme.primary : theme.muted,
    },
    {
      icon: UserIcon,
      label: t("account.profilePicture"),
      value: displayUser.profile_picture ? t("onboarding.preview.hasProfilePicture") : t("account.notProvided"),
      color: displayUser.profile_picture ? (theme.success || "#4CAF50") : theme.muted,
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
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
          <View className="gap-8 mb-8">
            {/* Header with gradient background */}
            <LinearGradient
              colors={[`${theme.primary}15`, `${theme.primary}05`, "transparent"]}
              locations={[0, 0.5, 1]}
              className="rounded-3xl p-8 items-center gap-6 -mx-4"
            >
              <MotiView
                from={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 150,
                }}
              >
                <View
                  className="rounded-full p-2"
                  style={{ backgroundColor: `${theme.primary}20` }}
                >
                  <Avatar user={displayUser} size={140} />
                </View>
              </MotiView>
              <View className="items-center gap-2">
                <Text variant="h1" className="text-center">
                  {displayUser.first_name} {displayUser.last_name}
                </Text>
                <Text variant="body" color="muted" className="text-center">
                  {displayUser.email}
                </Text>
              </View>
            </LinearGradient>


            {/* Info cards grid */}
            <View className="gap-4">
              <Text variant="h2">{t("onboarding.preview.yourInfo")}</Text>
              <View className="gap-3">
                {infoItems.map((item, index) => {
                  const Icon = item.icon;
                  const hasValue = item.value !== t("account.notProvided");
                  return (
                    <MotiView
                      key={index}
                      from={{ opacity: 0, translateX: -20 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{
                        type: "timing",
                        duration: 400,
                        delay: index * 100,
                      }}
                    >
                      <LinearGradient
                        colors={[`${item.color}20`, `${item.color}10`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-3xl p-4 flex-row items-center gap-4"
                      >
                        <View
                          className="rounded-xl p-3"
                          style={{ backgroundColor: `${item.color}30` }}
                        >
                          <Icon size={24} color={item.color} />
                        </View>
                        <View className="flex-1">
                          <Text variant="sm" color="muted" className="mb-1">
                            {item.label}
                          </Text>
                          <Text variant="body" className="font-semibold" style={{ color: hasValue ? undefined : theme.muted }}>
                            {item.value}
                          </Text>
                        </View>
                        {hasValue && <CheckCircle2 size={20} color={item.color} />}
                      </LinearGradient>
                    </MotiView>
                  );
                })}
              </View>
            </View>

            {/* Privacy notice - Combined with visibility info */}
            <View
              className="rounded-3xl p-5 flex-row items-start gap-3"
              style={{ backgroundColor: `${theme.primary}15` }}
            >
              <View
                className="rounded-full p-2"
                style={{ backgroundColor: `${theme.primary}30` }}
              >
                <Shield size={20} color={theme.primary} />
              </View>
              <View className="flex-1 gap-1">
                <Text variant="sm" className="font-semibold" style={{ color: theme.primary }}>
                  {t("onboarding.preview.publicVisibility")}
                </Text>
                <Text variant="sm" style={{ color: theme.primary }}>
                  {t("onboarding.preview.publicVisibilityDescription")}
                </Text>
              </View>
            </View>
          </View>
        </MotiView>
      </ScrollView>

      <View className="px-6 pb-8">
        <Button
          label={t("onboarding.preview.validate")}
          onPress={handleComplete}
        />
      </View>
    </View>
  );
};
