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
import { VerificationCodeModal } from "@/components/auth/VerificationCode";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";

export const Signin = () => {
  const navigation = useNavigation();
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
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
    } catch {
      setLoginError(t("auth.errors.invalidCredentials"));
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
    <Page goBack title={t("auth.signIn")}>
      <RNAnimated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          flex: 1,
        }}
      >
        {loginError ? (
          <View className="bg-red-300 p-3 rounded-md my-4">
            <Text className="text-red-900">{loginError}</Text>
          </View>
        ) : (
          <View className="h-20">
            <Text style={{ color: theme.textSecondary }} className="mt-2">
              {t("auth.signInDescription")}
            </Text>
          </View>
        )}

        <View className="flex flex-col gap-10">
          <Input
            placeholder="christophe.lerouge@imt-atlantique.net"
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
              size="lg"
              label={isLoading ? t("auth.signingIn") : t("common.signIn")}
              onPress={handleSubmit(handleLogin)}
              disabled={isButtonDisabled}
              className={isButtonDisabled ? "opacity-50" : ""}
              loading={isLoading}
            />

            {loginError && (
              <Button
                label={t("auth.resetPassword")}
                onPress={() =>
                  navigation.navigate("Auth", {
                    screen: "ResetPassword",
                    params: { email: watch("email") },
                  })
                }
                disabled={isLoading}
                variant="link"
              />
            )}
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
        />
      </RNAnimated.View>
    </Page>
  );
};

export default Signin;
