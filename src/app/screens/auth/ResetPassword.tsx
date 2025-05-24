import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import useAuth from "@/hooks/account/useAuth";
import type { AuthStackParamList } from "@/services/storage/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, type TextInput, View } from "react-native";
import { Animated as RNAnimated } from "react-native";
import { z } from "zod";

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, "ResetPassword">;

export const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute<ResetPasswordRouteProp>();
  const { resetPassword, changePassword, isLoading, isVerifying } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [resetError, setResetError] = useState<string | null>(null);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [canRequestCode, setCanRequestCode] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const verificationCodeRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const resetSchema = z
    .object({
      email: z
        .string()
        .trim()
        .email(t("auth.errors.email"))
        .refine((email) => email.endsWith("@imt-atlantique.net"), {
          message: t("auth.errors.imtOnly"),
        }),
      verificationCode: z.string().length(6, t("auth.errors.verificationCode")),
      newPassword: z.string().min(6, t("auth.errors.password")),
      confirmPassword: z.string().min(6, t("auth.errors.password")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.errors.confirmPassword"),
      path: ["confirmPassword"],
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: route.params?.email || "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const email = watch("email");
  const verificationCode = watch("verificationCode");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const isButtonDisabled =
    isLoading ||
    isVerifying ||
    !email ||
    !email.endsWith("@imt-atlantique.net") ||
    (verificationCodeSent &&
      (!verificationCode || !newPassword || !confirmPassword));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanRequestCode(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestCode = async () => {
    setResetError(null);
    try {
      const response = await resetPassword(email);
      if (response.success) {
        setVerificationCodeSent(true);
        setCanRequestCode(false);
        setCountdown(60); // 1 minute cooldown
        toast(t("auth.codeSent"), "success");
      } else {
        setResetError(response.error || t("auth.errors.resetPasswordFailed"));
      }
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
    } catch (error: any) {
      if (error.response?.status === 429) {
        setResetError(t("auth.errors.tooManyRequests"));
      } else {
        setResetError(t("auth.errors.resetPasswordFailed"));
      }
    }
  };

  const handleResetPassword = async (data: {
    email: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setResetError(null);
    try {
      const response = await changePassword(
        data.email,
        data.verificationCode,
        data.newPassword,
        data.confirmPassword,
      );
      if (response.success) {
        toast(t("auth.resetPasswordSuccess"), "success");
        navigation.goBack();
      } else {
        setResetError(response.error || t("auth.errors.resetPasswordFailed"));
      }
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
    } catch (error: any) {
      if (error.response?.status === 429) {
        setResetError(t("auth.errors.tooManyRequests"));
      } else if (error.response?.status === 400) {
        setResetError(t("auth.errors.invalidVerificationCode"));
      } else {
        setResetError(t("auth.errors.resetPasswordFailed"));
      }
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
    <Page goBack title={t("auth.resetPassword")}>
      <RNAnimated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          flex: 1,
        }}
      >
        {resetError ? (
          <View className="bg-red-300 p-3 rounded-md my-4">
            <Text className="text-red-900">{resetError}</Text>
          </View>
        ) : (
          <View className="h-20">
            <Text style={{ color: theme.textSecondary }} className="mt-2">
              {t("auth.resetPasswordDescription")}
            </Text>
          </View>
        )}

        <View className="flex flex-col gap-10">
          <Input
            placeholder="christophe.lerouge@imt-atlantique.net"
            control={control}
            name="email"
            autoCapitalize="none"
            textContentType="emailAddress"
            label={t("auth.email")}
            labelClasses="h3"
            returnKeyType="next"
            onSubmitEditing={() => verificationCodeRef.current?.focus()}
            error={errors.email?.message}
            editable={!verificationCodeSent}
          />

          {verificationCodeSent && (
            <>
              <Input
                placeholder="123456"
                control={control}
                name="verificationCode"
                keyboardType="numeric"
                maxLength={6}
                label={t("auth.verificationCode")}
                labelClasses="h3"
                returnKeyType="next"
                ref={verificationCodeRef}
                onSubmitEditing={() => newPasswordRef.current?.focus()}
                error={errors.verificationCode?.message}
              />
              <Input
                placeholder="••••••••••"
                control={control}
                name="newPassword"
                textContentType="newPassword"
                label={t("auth.newPassword")}
                labelClasses="h3"
                secureTextEntry
                ref={newPasswordRef}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                error={errors.newPassword?.message}
              />
              <Input
                placeholder="••••••••••"
                control={control}
                name="confirmPassword"
                textContentType="password"
                label={t("auth.confirmPassword")}
                labelClasses="h3"
                secureTextEntry
                ref={confirmPasswordRef}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(handleResetPassword)}
                error={errors.confirmPassword?.message}
              />
            </>
          )}

          <View className="flex flex-col gap-2">
            {!verificationCodeSent ? (
              <Button
                size="lg"
                label={
                  isLoading
                    ? t("auth.resettingPassword")
                    : t("auth.requestVerificationCode")
                }
                onPress={handleRequestCode}
                disabled={isButtonDisabled || !canRequestCode}
                className={
                  isButtonDisabled || !canRequestCode ? "opacity-50" : ""
                }
                loading={isLoading}
              />
            ) : (
              <Button
                size="lg"
                label={
                  isLoading
                    ? t("auth.resettingPassword")
                    : t("auth.resetPassword")
                }
                onPress={handleSubmit(handleResetPassword)}
                disabled={isButtonDisabled}
                className={isButtonDisabled ? "opacity-50" : ""}
                loading={isLoading}
              />
            )}
            {!canRequestCode && (
              <Text
                style={{ color: theme.textSecondary }}
                className="text-center"
              >
                {t("auth.requestCodeCooldown", { seconds: countdown })}
              </Text>
            )}
          </View>
        </View>
      </RNAnimated.View>
    </Page>
  );
};

export default ResetPassword;
