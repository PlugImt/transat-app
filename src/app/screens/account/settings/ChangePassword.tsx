import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import type { PasswordChange } from "@/dto";
import { useChangePassword } from "@/hooks/account/useChangePassword";
import { useUser } from "@/hooks/account/useUser";

export const ChangePassword = () => {
  const { t } = useTranslation();
  const { data: user } = useUser();
  const { mutate: changePassword, isPending: isUpdatingPassword } =
    useChangePassword();
  const { toast } = useToast();
  const navigation = useNavigation();
  const passwordSchema = z
    .object({
      password: z.string().min(6, t("auth.errors.password")),
      new_password: z.string().min(6, t("auth.errors.password")),
      new_password_confirmation: z.string().min(6, t("auth.errors.password")),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: t("account.passwordMismatch"),
      path: ["new_password_confirmation"],
    });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      email: user?.email || "",
      password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const handleChangePassword = (data: PasswordChange) => {
    Keyboard.dismiss();
    changePassword(
      {
        email: user?.email || "",
        password: data.password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      },
      {
        onSuccess: () => {
          resetPassword();
          toast(t("account.passwordChanged"), "success");
          navigation.goBack();
        },
        onError: (error) => {
          resetPassword();
          toast(error.message, "destructive");
        },
      },
    );
  };

  return (
    <Page goBack className="gap-8" title={t("account.changePassword")}>
      <Input
        label={t("account.currentPassword")}
        control={passwordControl}
        name="password"
        textContentType="password"
        error={passwordErrors.password?.message}
        secureTextEntry
      />

      <Input
        label={t("account.newPassword")}
        control={passwordControl}
        name="new_password"
        textContentType="newPassword"
        error={passwordErrors.new_password?.message}
        secureTextEntry
      />

      <Input
        label={t("account.confirmPassword")}
        control={passwordControl}
        name="new_password_confirmation"
        textContentType="newPassword"
        error={passwordErrors.new_password_confirmation?.message}
        secureTextEntry
      />
      <Button
        size="lg"
        label={t("account.changePassword")}
        onPress={handlePasswordSubmit(handleChangePassword)}
        disabled={isUpdatingPassword || !isPasswordValid}
        loading={isUpdatingPassword}
      />
    </Page>
  );
};

export default ChangePassword;
