import { CheckCircle2, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { MotiView } from "moti";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface OnboardingSuccessProps {
  onFinish: () => void;
}

export const OnboardingSuccess = ({ onFinish }: OnboardingSuccessProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="flex-1 px-6 py-8" style={{ backgroundColor: theme.background }}>
      <View className="flex-1 justify-center items-center gap-8">
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 100,
          }}
        >
          <View
            className="w-32 h-32 rounded-full items-center justify-center"
            style={{ backgroundColor: `${theme.primary}20` }}
          >
            <CheckCircle2 size={64} color={theme.primary} />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 600,
            delay: 300,
          }}
          className="items-center gap-4"
        >
          <View className="flex-row items-center gap-2">
            <Text variant="h1">{t("onboarding.success.title")}</Text>
            <Sparkles size={24} color={theme.primary} />
          </View>
          <Text variant="body" color="muted" className="text-center px-4">
            {t("onboarding.success.description")}
          </Text>
        </MotiView>
      </View>

      <View className="pb-8">
        <Button label={t("onboarding.success.start")} onPress={onFinish} />
      </View>
    </View>
  );
};
