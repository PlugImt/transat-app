import { Button } from "@/components/common/ButtonV2";
import { Input } from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { ArrowLeft } from "lucide-react-native";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Text, type TextInput, View } from "react-native";
import { z } from "zod";

const signupSchema = z
  .object({
    firstName: z.string().min(1, t("auth.errors.firstName")),
    lastName: z.string().min(1, t("auth.errors.lastName")),
    email: z.string().email(t("auth.errors.email")),
    password: z.string().min(6, t("auth.errors.password")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("auth.errors.confirmPassword"),
    path: ["confirmPassword"],
  });

export const Signup = () => {
  const { register } = useAuth();
  const navigation = useNavigation();

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await register(data.email, data.password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page className="flex flex-col gap-8">
      <ArrowLeft color="white" onPress={() => navigation.goBack()} />
      <Text className="h1">{t("auth.signUp")}</Text>

      <View className="flex flex-col gap-6">
        <Input
          placeholder="Christophe"
          label={t("auth.firstName")}
          control={control}
          name="firstName"
          error={errors.firstName?.message}
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />
        <Input
          placeholder="Le Rouge"
          label={t("auth.lastName")}
          control={control}
          name="lastName"
          error={errors.lastName?.message}
          returnKeyType="next"
          ref={lastNameRef}
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <Input
          placeholder="christophe.lerouge@imt-atlantique.net"
          label={t("auth.email")}
          control={control}
          name="email"
          error={errors.email?.message}
          returnKeyType="next"
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          placeholder="••••••••••"
          label={t("auth.password")}
          control={control}
          name="password"
          secureTextEntry
          error={errors.password?.message}
          returnKeyType="next"
          ref={passwordRef}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        <Input
          placeholder="••••••••••"
          label={t("auth.confirmPassword")}
          control={control}
          name="confirmPassword"
          secureTextEntry
          error={errors.confirmPassword?.message}
          returnKeyType="done"
          ref={confirmPasswordRef}
          onSubmitEditing={handleSubmit(onSubmit)}
        />
      </View>
      <View className="flex flex-col gap-2">
        <Button
          label={t("auth.createAccount")}
          onPress={handleSubmit(onSubmit)}
        />
        <Button
          label={t("auth.gotAccount")}
          onPress={() => navigation.navigate("Auth", { screen: "Signin" })}
          variant="link"
        />
      </View>
    </Page>
  );
};

export default Signup;
