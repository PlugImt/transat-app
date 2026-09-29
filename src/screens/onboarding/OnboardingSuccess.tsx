import { CheckCircle2, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

interface OnboardingSuccessProps {
  onFinish: () => void;
}

export const OnboardingSuccess = ({ onFinish }: OnboardingSuccessProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Page
      disableScroll
      className="flex-1 items-center justify-center gap-8"
      footer={
        <Button label={t("onboarding.success.start")} onPress={onFinish} />
      }
    >
      <View
        className="w-32 h-32 rounded-full items-center justify-center"
        style={{ backgroundColor: `${theme.primary}20` }}
      >
        <CheckCircle2 size={64} color={theme.primary} />
      </View>

      <View className="items-center gap-4">
        <View className="flex-row items-center gap-2">
          <Text variant="h1">{t("onboarding.success.title")}</Text>
          <Sparkles size={24} color={theme.primary} />
        </View>
        <Text color="muted" className="text-center px-4">
          {t("onboarding.success.description")}
        </Text>
      </View>
    </Page>
  );
};
