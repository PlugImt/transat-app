import { zodResolver } from "@hookform/resolvers/zod";
import * as Sentry from "@sentry/react-native";
import { MessageSquare, Send } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/hooks/account/useUser";

const feedbackSchema = z.object({
  message: z.string().min(10, "settings.feedback.minLengthError"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const Feedback = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      setIsSubmitting(true);

      const sentryId = Sentry.captureMessage("User Feedback Submitted", "info");

      const userFeedback = {
        event_id: sentryId,
        name: `${user?.first_name} ${user?.last_name}` || "User inconnu",
        email: user?.email || "email@inconnu.net",
        message: data.message,
      };

      // Envoyer le feedback à Sentry
      Sentry.captureFeedback(userFeedback);

      // Afficher un message de succès
      Alert.alert(
        t("settings.feedback.successTitle"),
        t("settings.feedback.successMessage"),
        [
          {
            text: "OK",
            onPress: () => reset(),
          },
        ],
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);

      // Capturer l'erreur avec Sentry
      Sentry.captureException(error);

      Alert.alert(
        t("settings.feedback.errorTitle"),
        t("settings.feedback.errorMessage"),
        [{ text: "OK" }],
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title={t("settings.feedback.title")} className="flex-1" goBack>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6">
            <View className="items-center gap-4 pt-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <MessageSquare color={theme.background} size={32} />
              </View>
              <View className="items-center gap-2">
                <Text
                  className="text-2xl font-bold text-center"
                  style={{ color: theme.text }}
                >
                  {t("settings.feedback.yourOpinionMatters")}
                </Text>
                <Text
                  className="text-base text-center px-4"
                  style={{ color: theme.textSecondary }}
                >
                  {t("settings.feedback.helpDescription")}
                </Text>
              </View>
            </View>

            <View
              className="rounded-lg p-6 gap-6"
              style={{ backgroundColor: theme.card }}
            >
              <View className="gap-2">
                <Text
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {t("settings.feedback.commentsLabel")}
                </Text>
                <Controller
                  control={control}
                  name="message"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="rounded-lg px-4 py-3 text-base bg-input text-foreground border min-h-[120px] text-align-vertical-top"
                      style={{
                        borderColor: errors.message
                          ? theme.destructive
                          : theme.border,
                      }}
                      placeholder={t("settings.feedback.commentsPlaceholder")}
                      placeholderTextColor={theme.textTertiary}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      multiline
                      numberOfLines={5}
                    />
                  )}
                />
                {errors.message && (
                  <Text
                    className="text-sm"
                    style={{ color: theme.destructive }}
                  >
                    {t(errors.message.message as string)}
                  </Text>
                )}
              </View>

              <Button
                label={
                  isSubmitting
                    ? t("settings.feedback.sending")
                    : t("settings.feedback.send")
                }
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                icon={<Send color={theme.background} size={20} />}
                className="mt-4"
              />
            </View>

            {/* Note de confidentialité */}
            <View
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.backdrop }}
            >
              <Text
                className="text-sm text-center"
                style={{ color: theme.textSecondary }}
              >
                {t("settings.feedback.privacyNote")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
};

export default Feedback;
