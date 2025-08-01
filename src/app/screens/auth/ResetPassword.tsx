import { zodResolver } from "@hookform/resolvers/zod";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import useAuth from "@/hooks/account/useAuth";
import type { AuthStackParamList } from "@/types";

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, "ResetPassword">;

export const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute<ResetPasswordRouteProp>();
  const { resetPassword, changePassword, isPending, isVerifying } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

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
    isPending ||
    isVerifying ||
    !email ||
    !email.endsWith("@imt-atlantique.net") ||
    (verificationCodeSent &&
      (!verificationCode || !newPassword || !confirmPassword));

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
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
    try {
      const response = await resetPassword(email);
      if (response.success) {
        setVerificationCodeSent(true);
        setCanRequestCode(false);
        setCountdown(60); // 1 minute cooldown
        toast(t("auth.codeSent"), "success");
      } else {
        toast(
          response.error || t("auth.errors.resetPasswordFailed"),
          "destructive",
        );
      }
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast(t("auth.errors.tooManyRequests"), "destructive");
      } else {
        toast(t("auth.errors.resetPasswordFailed"), "destructive");
      }
    }
  };

  const handleResetPassword = async (data: {
    email: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await changePassword(
        data.email,
        data.verificationCode,
        data.newPassword,
        data.confirmPassword,
      );
      if (response.success) {
        toast(t("auth.resetPassword.resetPasswordSuccess"), "success");
        navigation.goBack();
      } else {
        toast(
          response.error || t("auth.errors.resetPasswordFailed"),
          "destructive",
        );
      }
      // biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast(t("auth.errors.tooManyRequests"), "destructive");
      } else if (error.response?.status === 400) {
        toast(t("auth.errors.invalidVerificationCode"), "destructive");
      } else {
        toast(t("auth.errors.resetPasswordFailed"), "destructive");
      }
    }
  };

  return (
    <Page title={t("auth.resetPassword.title")} className="gap-4" disableScroll>
      <Text color="muted">{t("auth.resetPassword.description")}</Text>

      <View className="flex flex-col gap-10">
        <Input
          placeholder="newf.nantes@imt-atlantique.net"
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
              label={t("auth.resetPassword.newPassword")}
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
              label={
                isPending
                  ? t("auth.resetPassword.resettingPassword")
                  : t("auth.resetPassword.requestVerificationCode")
              }
              onPress={handleRequestCode}
              disabled={isButtonDisabled || !canRequestCode}
              isUpdating={isPending}
            />
          ) : (
            <Button
              label={
                isPending
                  ? t("auth.resetPassword.resettingPassword")
                  : t("auth.resetPassword.title")
              }
              onPress={handleSubmit(handleResetPassword)}
              disabled={isButtonDisabled}
              isUpdating={isPending}
            />
          )}
          {canRequestCode ? (
            <TouchableOpacity
              onPress={handleRequestCode}
              disabled={isPending}
              className="mt-2"
            >
              <Text color="muted" className="text-center">
                {t("auth.requestNewCode")}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text color="muted" className="text-center">
              {t("auth.requestCodeCooldown", { seconds: countdown })}
            </Text>
          )}
        </View>
      </View>
    </Page>
  );
};

export default ResetPassword;
