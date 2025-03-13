import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import Dropdown from "@/components/common/Dropdown";
import { Input } from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import ErrorPage from "@/components/custom/ErrorPage";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { useAccount } from "@/hooks/account/useAccount";
import { useChangePassword } from "@/hooks/account/useChangePassword";
import { useUpdateAccount } from "@/hooks/account/useUpdateAccount";
import { useUpdateProfilePicture } from "@/hooks/account/useUpdateProfilePicture";
import { QUERY_KEYS } from "@/lib/queryKeys";
import theme from "@/themes";
import type { Password, User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, GraduationCap } from "lucide-react-native";
import type React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

export const EditProfile = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error } = useAccount();
  const { mutate: updateAccount, isPending: isUpdatingAccount } =
    useUpdateAccount();
  const { mutate: updateProfilePicture, isPending: isUpdatingProfilePicture } =
    useUpdateProfilePicture();
  const { mutate: changePassword, isPending: isUpdatingPassword } =
    useChangePassword();

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
  };

  const userSchema = z.object({
    first_name: z.string().nonempty(t("auth.errors.firstName")),
    last_name: z.string().nonempty(t("auth.errors.lastName")),
    phone_number: z.string().min(10, t("auth.errors.phone")).optional(),
    email: z
      .string()
      .email(t("auth.errors.email"))
      .refine((email) => email.endsWith("@imt-atlantique.net"), {
        message: t("auth.errors.imtOnly"),
      }),
    graduation_year: z.number().optional(),
  });

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
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors, isValid: isUserValid },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user,
    mode: "onChange",
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

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) =>
    (currentYear + i).toString(),
  );

  const handleUpdateAccount = (data: User) => {
    Keyboard.dismiss();
    updateAccount(data, {
      onSuccess: () => {
        toast(t("account.profileUpdated"), "success");
        navigation.goBack();
      },
      onError: (error) => {
        toast(error.message, "destructive");
      },
    });
  };

  const handleChangePassword = (data: Password) => {
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

  const handleUpdateProfilePicture = () => {
    updateProfilePicture(undefined, {
      onSuccess: async () => {
        await refetch();
        toast(t("account.profilePictureUpdated"), "success");
      },
      onError: (error) => {
        if (error.message) {
          toast(error.message, "destructive");
        }
      },
    });
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  if ((isError && error) || !user) {
    return (
      <ErrorPage
        error={
          error || ({ message: t("common.errors.unableToFetch") } as Error)
        }
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  return (
    <Page className="gap-8" refreshing={isPending} onRefresh={refetch}>
      <View className="flex-row items-center justify-between m-4">
        <Text className="h1">{t("account.editProfile")}</Text>
        <Button
          label={t("common.cancel")}
          onPress={() => navigation.goBack()}
          size="sm"
          variant="ghost"
        />
      </View>
      <View className="items-center">
        <TouchableOpacity
          className="relative"
          onPress={handleUpdateProfilePicture}
          activeOpacity={4}
        >
          <Avatar className="w-32 h-32">
            <AvatarImage
              source={{
                uri: user.profile_picture,
              }}
              loading={isUpdatingProfilePicture}
            />
            <AvatarFallback>
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-muted p-2 rounded-full"
            onPress={handleUpdateProfilePicture}
          >
            <Edit color="#ffe6cc" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View className="bg-card rounded-lg px-6 py-4 gap-4">
        <Text className="h3">{t("account.personalInfo")}</Text>

        <Input
          label={t("account.firstName")}
          control={userControl}
          name="first_name"
          returnKeyType="go"
          textContentType="name"
          error={userErrors.first_name?.message}
        />

        <Input
          label={t("account.lastName")}
          control={userControl}
          name="last_name"
          textContentType="familyName"
          error={userErrors.last_name?.message}
        />

        <Input
          label={t("account.email")}
          control={userControl}
          name="email"
          autoCapitalize="none"
          textContentType="emailAddress"
          error={userErrors.email?.message}
        />

        <Input
          label={t("account.phone")}
          control={userControl}
          name="phone_number"
          textContentType="telephoneNumber"
          error={userErrors.phone_number?.message}
          keyboardType="phone-pad"
        />

        <Controller
          control={userControl}
          name="graduation_year"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t("account.graduationYear")}
              placeholder={t("account.selectGraduationYear")}
              icon={<GraduationCap color={theme.textPrimary} size={20} />}
              options={yearOptions}
              value={value?.toString()}
              onValueChange={(value) => onChange(Number(value))}
            />
          )}
        />
        <Dialog>
          <DialogContent
            title={t("account.changePassword")}
            className="gap-4"
            cancelLabel={t("common.cancel")}
            confirmLabel={t("common.save")}
            onConfirm={handlePasswordSubmit(handleChangePassword)}
            isPending={isUpdatingPassword}
            disableConfirm={!isPasswordValid}
          >
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
          </DialogContent>
          <View className="gap-1.5">
            <Text className="text-foreground/70 text-sm">
              {t("auth.password")}
            </Text>
            <DialogTrigger>
              <Button label={t("account.changePassword")} variant="ghost" />
            </DialogTrigger>
          </View>
        </Dialog>
      </View>

      <Button
        label={t("common.save")}
        onPress={handleUserSubmit(handleUpdateAccount)}
        loading={isUpdatingAccount}
        disabled={!isUserValid}
      />
    </Page>
  );
};

export default EditProfile;
