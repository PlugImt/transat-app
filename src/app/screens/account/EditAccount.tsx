import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import Dropdown, { DropdownLoading } from "@/components/common/Dropdown";
import Input, { InputLoading } from "@/components/common/Input";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import ErrorPage from "@/components/custom/ErrorPage";
import { useUpdateAccount } from "@/hooks/account/useUpdateAccount";
import { useUpdateProfilePicture } from "@/hooks/account/useUpdateProfilePicture";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useTheme } from "@/themes/useThemeProvider";
import type { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, GraduationCap } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

export const EditProfile = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error } = useUser();
  const { mutate: updateAccount, isPending: isUpdatingAccount } =
    useUpdateAccount();
  const { mutate: updateProfilePicture, isPending: isUpdatingProfilePicture } =
    useUpdateProfilePicture();

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

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors, isValid: isUserValid },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user,
    mode: "onChange",
  });

  const currentMonth = new Date().getMonth(); // 0-based, so 8 is September
  const currentYear = new Date().getFullYear();
  // If we're past September, we're in the next academic year
  const startAcademicYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const yearOptions = Array.from({ length: 4 }, (_, i) => {
    return (startAcademicYear + i).toString();
  });

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
    return <EditProfileLoading />;
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
            <Edit color={theme.foreground} size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View className="bg-card rounded-lg px-6 py-4 gap-4">
        <Text className="h3">{t("account.personalInfo")}</Text>

        <Input
          control={userControl}
          label={t("account.firstName")}
          name="first_name"
          returnKeyType="go"
          textContentType="name"
          error={userErrors.first_name?.message}
        />

        <Input
          control={userControl}
          label={t("account.lastName")}
          name="last_name"
          textContentType="familyName"
          error={userErrors.last_name?.message}
        />

        <Input
          control={userControl}
          label={t("account.email")}
          name="email"
          autoCapitalize="none"
          textContentType="emailAddress"
          error={userErrors.email?.message}
        />

        <Input
          control={userControl}
          label={t("account.phone")}
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
              icon={<GraduationCap color={theme.foreground} size={20} />}
              options={yearOptions}
              value={value?.toString()}
              onValueChange={(value) => onChange(Number(value))}
            />
          )}
        />
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

const EditProfileLoading = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Page className="gap-8">
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
        <TouchableOpacity className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage loading />
          </Avatar>
        </TouchableOpacity>
      </View>

      <View className="bg-card rounded-lg px-6 py-4 gap-4">
        <Text className="h3">{t("account.personalInfo")}</Text>

        <InputLoading label={t("account.firstName")} />
        <InputLoading label={t("account.lastName")} />
        <InputLoading label={t("account.email")} />
        <InputLoading label={t("account.phone")} />

        <DropdownLoading
          label={t("account.graduationYear")}
          placeholder={t("account.selectGraduationYear")}
          icon={<GraduationCap color={theme.foreground} size={20} />}
        />
      </View>

      <Button label={t("common.save")} disabled />
    </Page>
  );
};
