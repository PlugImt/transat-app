import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type TextInput, View } from "react-native";
import { z } from "zod";
import { VerificationCodeModal } from "@/components/auth/VerificationCode";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import useAuth from "@/hooks/account/useAuth";

export const Signin = () => {
  const navigation = useNavigation();
  const { login, isPending } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

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
    isPending ||
    !email ||
    !password ||
    password.length < 6 ||
    !email.endsWith("@imt-atlantique.net");

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const result = await login(data.email, data.password);

      if (result?.needsVerification) {
        setVerificationEmail(data.email);
        setVerificationModalVisible(true);
      }
    } catch {
      toast(t("auth.errors.invalidCredentials"), "destructive");
    }
  };

  return (
    <Page title={t("auth.signIn.title")} disableScroll className="gap-4">
      <Text color="muted">{t("auth.signIn.description")}</Text>

      <View className="flex flex-col gap-10">
        <Input
          placeholder={t("auth.emailPlaceholder")}
          control={control}
          name="email"
          autoCapitalize="none"
          // autoFocus
          textContentType="emailAddress"
          label={t("auth.email")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={errors.email?.message}
        />
        <View className="items-end">
          <Input
            className="w-full"
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
          <Button
            label={t("auth.resetPassword.forgotPassword")}
            onPress={() =>
              navigation.navigate("Auth", {
                screen: "ResetPassword",
                params: { email: watch("email") },
              })
            }
            isUpdating={isPending}
            variant="link"
            size="sm"
          />
        </View>

        <View className="flex flex-col gap-2">
          <Button
            label={isPending ? t("auth.signIn.pending") : t("common.signIn")}
            onPress={handleSubmit(handleLogin)}
            disabled={isButtonDisabled}
            isUpdating={isPending}
          />
        </View>
      </View>

      <VerificationCodeModal
        isVisible={verificationModalVisible}
        email={verificationEmail}
        onClose={() => setVerificationModalVisible(false)}
      />
    </Page>
  );
};

export default Signin;
