import { Button } from "@/components/common/ButtonV2";
import { Input } from "@/components/common/Input";
import Page from "@/components/common/Page";
import useAuth from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, type TextInput, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const Signin = () => {
  const navigation = useNavigation();
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error("Invalid email or password");
    }
  };

  return (
    <Page className="flex flex-col gap-8">
      <ArrowLeft color="white" onPress={() => navigation.goBack()} />
      <Text className="h1">{t("auth.signIn")}</Text>
      <View className="flex flex-col gap-10">
        <Input
          placeholder="christophe.lerouge@imt-atlantique.net"
          control={control}
          name="email"
          label={t("auth.email")}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          placeholder="••••••••••"
          control={control}
          name="password"
          label={t("auth.password")}
          secureTextEntry
          ref={passwordRef}
          returnKeyType="done"
          onSubmitEditing={handleSubmit(handleLogin)}
          error={errors.password?.message}
        />
        <View className="flex flex-col gap-2">
          <Button
            label={t("auth.signIn")}
            onPress={handleSubmit(handleLogin)}
            disabled={isLoading}
          />
          <Button
            label={t("auth.noAccount")}
            onPress={() => navigation.navigate("Auth", { screen: "Signup" })}
            disabled={isLoading}
            variant="link"
          />
        </View>
      </View>
    </Page>
  );
};

export default Signin;
