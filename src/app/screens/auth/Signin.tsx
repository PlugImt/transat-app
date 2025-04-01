import { VerificationCodeModal } from "@/components/auth/VerificationCode";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import useAuth from "@/hooks/account/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, type TextInput, View } from "react-native";
import { z } from "zod";

export const Signin = () => {
  const navigation = useNavigation();
  const { login, saveToken, isLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>("");

  const passwordRef = useRef<TextInput>(null);

  const loginSchema = z.object({
    email: z
      .string()
      .trim()
      .email(t("auth.errors.email"))
      .refine((email) => email.endsWith("@imt-atlantique.net"), {
        message: t("auth.errors.imtOnly"),
      }),
    password: z.string().min(6, t("auth.errors.password")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");

  const isButtonDisabled =
    isLoading ||
    !email ||
    !password ||
    password.length < 6 ||
    !email.endsWith("@imt-atlantique.net");

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoginError(null);
    try {
      const result = await login(data.email, data.password);

      if (result?.needsVerification) {
        setVerificationEmail(data.email);
        setVerificationModalVisible(true);
      } else if (result?.success) {
        toast(t("auth.signInSuccess"), "success");
      }
    } catch (err) {
      setLoginError(t("auth.errors.invalidCredentials"));
    }
  };

  const handleVerificationSuccess = async (token: string) => {
    try {
      await saveToken(token);
      setVerificationModalVisible(false);
      toast(t("auth.signInSuccess"), "success");
    } catch (err) {
      setLoginError(t("auth.errors.tokenSaveFailed"));
    }
  };

  return (
    <Page className="flex flex-col gap-8" goBack>
      <Text className="h1">{t("auth.signIn")}</Text>

      {loginError && (
        <View className="bg-red-300 p-3 rounded-md">
          <Text className="text-red-900">{loginError}</Text>
        </View>
      )}

      <View className="flex flex-col gap-10">
        <Input
          placeholder="christophe.lerouge@imt-atlantique.net"
          control={control}
          name="email"
          autoCapitalize="none"
          autoFocus
          textContentType="emailAddress"
          label={t("auth.email")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={errors.email?.message}
        />
        <Input
          placeholder="••••••••••"
          control={control}
          name="password"
          textContentType="password"
          labelClasses="h3"
          label={t("auth.password")}
          secureTextEntry
          ref={passwordRef}
          returnKeyType="done"
          onSubmitEditing={handleSubmit(handleLogin)}
          error={errors.password?.message}
        />
        <View className="flex flex-col gap-2">
          <Button
            label={isLoading ? t("auth.signingIn") : t("auth.signIn")}
            onPress={handleSubmit(handleLogin)}
            disabled={isButtonDisabled}
            className={isButtonDisabled ? "opacity-50" : ""}
            loading={isLoading}
          />
          <Button
            label={t("auth.noAccount")}
            onPress={() => navigation.navigate("Auth", { screen: "Signup" })}
            disabled={isLoading}
            variant="link"
          />
        </View>
      </View>

      <VerificationCodeModal
        isVisible={verificationModalVisible}
        email={verificationEmail}
        onClose={() => setVerificationModalVisible(false)}
        onSuccess={handleVerificationSuccess}
      />
    </Page>
  );
};

export default Signin;
