import { VerificationCodeModal } from "@/components/auth/VerificationCode";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import useAuth from "@/hooks/account/useAuth";
import i18n from "@/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Animated as RNAnimated,
  Text,
  type TextInput,
  View,
} from "react-native";
import { z } from "zod";

export const Signup = () => {
  const navigation = useNavigation();
  const { register, saveToken, isLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [signupError, setSignupError] = useState<string | null>(null);
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
    },
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const isButtonDisabled =
    isLoading ||
    !email ||
    !password ||
    !confirmPassword ||
    password.length < 6 ||
    password !== confirmPassword ||
    !email.endsWith("@imt-atlantique.net");

  const handleSignup = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setSignupError(null);
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
        setSignupError(t("auth.errors.accountExists"));
      } else {
        setSignupError(t("auth.errors.signupFailed"));
      }
    }
  };

  const _handleVerificationSuccess = async (token: string) => {
    try {
      await saveToken(token);
      setVerificationModalVisible(false);
      toast(t("common.verificationSuccess"), "success");
    } catch (_err) {
      setSignupError(t("auth.errors.tokenSaveFailed"));
    }
  };

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;

  useEffect(() => {
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
        <Text className="h1">{t("auth.signUp")}</Text>

        {signupError && (
          <View className="bg-red-300 p-3 rounded-md">
            <Text className="text-red-900">{signupError}</Text>
          </View>
        )}

        <View className="flex flex-col gap-10">
          <Input
            placeholder="christophe.lerouge@imt-atlantique.net"
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
            returnKeyType="done"
            onSubmitEditing={handleSubmit(handleSignup)}
            error={errors.confirmPassword?.message}
          />
          <View className="flex flex-col gap-2">
            <Button
              size="lg"
              label={isLoading ? t("auth.signingUp") : t("auth.signUp")}
              onPress={handleSubmit(handleSignup)}
              disabled={isButtonDisabled}
              className={isButtonDisabled ? "opacity-50" : ""}
              loading={isLoading}
            />
            <Button
              label={t("auth.gotAccount")}
              onPress={() => navigation.navigate("Auth", { screen: "Signin" })}
              disabled={isLoading}
              variant="link"
            />
          </View>
        </View>

        <VerificationCodeModal
          isVisible={verificationModalVisible}
          email={verificationEmail}
          onClose={() => setVerificationModalVisible(false)}
        />
      </RNAnimated.View>
    </Page>
  );
};

export default Signup;
