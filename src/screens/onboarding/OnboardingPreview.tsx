import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/hooks/account/useUser";
import { setOnboardingCompleted } from "@/hooks/onboarding/useOnboardingSteps";
import { paths } from "@/navigation/paths";

export const OnboardingPreview = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: displayUser } = useUser();

  const handleComplete = async () => {
    await setOnboardingCompleted(true);
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    router.push(paths.success);
  };

  if (!displayUser) return null;

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
