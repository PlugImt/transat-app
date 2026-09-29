import type { NativeStackNavigationProp } from "expo-router/build/react-navigation/native-stack";
import { useNavigation } from "expo-router/react-navigation";
import {
  GraduationCap,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import InfoItem from "@/components/common/InfoItem";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { useUser } from "@/hooks/account/useUser";
import type { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface OnboardingPreviewProps {
  route: {
    params: { user: User };
  };
  onComplete: () => void;
}

export const OnboardingPreview = ({
  route,
  onComplete,
}: OnboardingPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { data: currentUser } = useUser();
  const displayUser = currentUser || route.params.user;

  const handleComplete = () => {
    // Mark onboarding as complete at navigator level
    onComplete();
    // Navigate to success screen within the stack
    navigation.navigate("Success");
  };

  return (
    <Page
      title={t("onboarding.preview.yourInfo")}
      footer={
        <Button
          label={t("onboarding.preview.validate")}
          onPress={handleComplete}
        />
      }
    >
      <View className="items-center gap-2">
        <Avatar user={displayUser} size={128} />
        <View className="gap-1 justify-center items-center">
          <Text variant="h2">
            {displayUser.first_name} {displayUser.last_name}
          </Text>
          <Text color="muted">{displayUser.email}</Text>
        </View>
      </View>

      <Card className="gap-4">
        <InfoItem
          icon={<Phone color={theme.text} size={20} />}
          label={t("account.phone")}
          value={displayUser.phone_number || t("account.notProvided")}
        />
        <InfoItem
          icon={<GraduationCap color={theme.text} size={20} />}
          label={t("account.formationName")}
          value={displayUser.formation_name || t("account.notProvided")}
        />
        <InfoItem
          icon={<GraduationCap color={theme.text} size={20} />}
          label={t("account.graduationYear")}
          value={
            displayUser.graduation_year
              ? displayUser.graduation_year.toString()
              : t("account.notProvided")
          }
        />
        <InfoItem
          icon={<UserIcon color={theme.text} size={20} />}
          label={t("account.profilePicture")}
          value={
            displayUser.profile_picture
              ? t("onboarding.preview.hasProfilePicture")
              : t("account.notProvided")
          }
        />
      </Card>

      <Card className="flex-row items-start gap-3">
        <Shield color={theme.primary} size={20} />
        <View className="flex-1 gap-1">
          <Text
            variant="sm"
            className="font-semibold"
            style={{ color: theme.primary }}
          >
            {t("onboarding.preview.publicVisibility")}
          </Text>
          <Text variant="sm" style={{ color: theme.primary }}>
            {t("onboarding.preview.publicVisibilityDescription")}
          </Text>
        </View>
      </Card>
    </Page>
  );
};
