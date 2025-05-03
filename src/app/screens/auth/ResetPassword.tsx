import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import useAuth from "@/hooks/account/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, type TextInput, View } from "react-native";
import { Animated as RNAnimated } from "react-native";
import { z } from "zod";

export const ResetPassword = () => {
  const navigation = useNavigation();
  const { resetPassword, isLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [resetError, setResetError] = useState<string | null>(null);

  const resetSchema = z.object({
    email: z
      .string()
      .trim()
      .email(t("auth.errors.email"))
      .refine((email) => email.endsWith("@imt-atlantique.net"), {
        message: t("auth.errors.imtOnly"),
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const email = watch("email");

  const isButtonDisabled =
    isLoading || !email || !email.endsWith("@imt-atlantique.net");

  const handleResetPassword = async (data: { email: string }) => {
    setResetError(null);
    try {
      await resetPassword(data.email);
      toast(t("auth.resetPasswordSuccess"), "success");
      navigation.goBack();
    } catch {
      setResetError(t("auth.errors.resetPasswordFailed"));
    }
  };

  // Add animation values
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;

  useEffect(() => {
    // Start animations
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Page goBack>
      <RNAnimated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          flex: 1,
        }}
      >
        <Text className="h1">{t("auth.resetPassword")}</Text>

        {resetError ? (
                <View className="bg-red-300 p-3 rounded-md my-4">
                  <Text className="text-red-900">{resetError}</Text>
                </View>
            ) :
            <View className="h-20">
              <Text className="text-foreground/60 mt-2">
                {t('auth.resetPasswordDescription')}
              </Text>
            </View>
        }


        <View className="flex flex-col gap-10">
          <Input
            placeholder="christophe.lerouge@imt-atlantique.net"
            control={control}
            name="email"
            autoCapitalize="none"
            textContentType="emailAddress"
            label={t("auth.email")}
            labelClasses="h3"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(handleResetPassword)}
            error={errors.email?.message}
          />
          <View className="flex flex-col gap-2">
            <Button
              size="lg"
              label={isLoading ? t("auth.resettingPassword") : t("auth.resetPassword")}
              onPress={handleSubmit(handleResetPassword)}
              disabled={isButtonDisabled}
              className={isButtonDisabled ? "opacity-50" : ""}
              loading={isLoading}
            />
          </View>
        </View>
      </RNAnimated.View>
    </Page>
  );
};

export default ResetPassword; 