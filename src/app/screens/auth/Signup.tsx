import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type TextInput, View } from "react-native";
import { z } from "zod";
import { VerificationCodeModal } from "@/components/auth/VerificationCode";
import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import useAuth from "@/hooks/account/useAuth";
import i18n from "@/i18n";
import type { AuthNavigation } from "@/types";

export const Signup = () => {
  const navigation = useNavigation<AuthNavigation>();
  const { register, isPending } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>("");

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const signupSchema = z
    .object({
      email: z
        .string()
        .email(t("auth.errors.email"))
        .refine((email) => email.endsWith("@imt-atlantique.net"), {
          message: t("auth.errors.imtOnly"),
        }),
      password: z.string().min(6, t("auth.errors.password")),
      confirmPassword: z.string().min(6, t("auth.errors.password")),
      terms: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.errors.confirmPassword"),
      path: ["confirmPassword"],
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const terms = watch("terms");

  const isButtonDisabled =
    isPending ||
    !email ||
    !password ||
    !confirmPassword ||
    password.length < 6 ||
    password !== confirmPassword ||
    !email.endsWith("@imt-atlantique.net") ||
    !terms;

  const handleSignup = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const language = i18n.language ?? "fr";
      const response = await register(data.email, data.password, language);

      if (!response.success) {
        throw new Error("userAlreadyExists");
      }

      setVerificationEmail(data.email);
      setVerificationModalVisible(true);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "You already have an account"
      ) {
        toast(t("auth.errors.accountExists"), "destructive");
      } else {
        toast(t("auth.errors.signupFailed"), "destructive");
      }
    }
  };

  return (
    <Page title={t("auth.signUp.title")} disableScroll className="gap-4">
      <Text color="muted">{t("auth.signUp.description")}</Text>

      <View className="flex flex-col gap-10">
        <Input
          placeholder={t("auth.emailPlaceholder")}
          control={control}
          name="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          // autoFocus
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
          textContentType="newPassword"
          labelClasses="h3"
          label={t("auth.password")}
          secureTextEntry
          ref={passwordRef}
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          error={errors.password?.message}
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
          returnKeyType="next"
          onSubmitEditing={handleSubmit(handleSignup)}
          error={errors.confirmPassword?.message}
        />
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <Checkbox
              label={
                <View>
                  <Text variant="sm">{t("auth.signUp.terms")}</Text>
                  <Button
                    variant="link"
                    size="sm"
                    labelClasses="text-sm"
                    style={{ padding: 0 }}
                    label={t("auth.signUp.termsLink")}
                    onPress={() => navigation.navigate("Legal")}
                  />
                </View>
              }
              checked={field.value}
              onPress={field.onChange}
            />
          )}
        />

        <View className="flex flex-col gap-2">
          <Button
            label={
              isPending ? t("auth.signUp.pending") : t("auth.signUp.title")
            }
            onPress={handleSubmit(handleSignup)}
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

export default Signup;
