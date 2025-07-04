import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, GraduationCap } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
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
import { useTheme } from "@/contexts/ThemeContext";
import { useUpdateAccount } from "@/hooks/account/useUpdateAccount";
import { useUpdateProfilePicture } from "@/hooks/account/useUpdateProfilePicture";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Branch, User } from "@/types/user";

export const EditProfile = () => {
  const { theme } = useTheme();
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
    scolarity: z
      .object({
        graduation_year: z.number().optional(),
        branch: z.enum(["FISE", "FIL", "FIT", "FIP"]).optional(),
        group: z.string().optional(),
      })
      .optional(),
  });

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors, isValid: isUserValid, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      scolarity: {
        graduation_year: undefined as number | undefined,
        branch: undefined as Branch | undefined,
        group: "",
      },
    },
    mode: "onChange",
  });

  // Reset form with user data when it becomes available
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
        scolarity: {
          graduation_year: user.scolarity?.graduation_year ?? undefined,
          branch: user.scolarity?.branch ?? undefined,
          group: user.scolarity?.group || "",
        },
      });
    }
  }, [user, reset]);

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
    <Page
      goBack
      className="gap-8"
      refreshing={isPending}
      onRefresh={refetch}
      title={t("account.editProfile")}
    >
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
            <Edit color={theme.text} size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View
        className=" rounded-lg px-6 py-4 gap-4"
        style={{ backgroundColor: theme.card }}
      >
        <Text className="h3" style={{ color: theme.text }}>
          {t("account.personalInfo")}
        </Text>

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
          disabled={true}
          className="opacity-50"
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
          name="scolarity.branch"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t("account.branch")}
              placeholder={t("account.selectBranch")}
              options={["FISE", "FIL", "FIT", "FIP"]}
              value={value}
              onValueChange={onChange}
            />
          )}
        />

        <Controller
          control={userControl}
          name="scolarity.group"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t("account.group")}
              placeholder={t("account.selectGroup")}
              options={["1", "2", "3", "4", "5"]}
              value={value}
              onValueChange={onChange}
            />
          )}
        />

        <Controller
          control={userControl}
          name="scolarity.graduation_year"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t("account.graduationYear")}
              placeholder={t("account.selectGraduationYear")}
              icon={<GraduationCap color={theme.text} size={20} />}
              options={yearOptions}
              value={value ? value.toString() : undefined}
              onValueChange={(value) => onChange(Number(value))}
            />
          )}
        />
      </View>

      <Button
        label={t("common.cancel")}
        onPress={() => navigation.goBack()}
        variant="outlined"
      />
      <Button
        label={t("common.save")}
        onPress={handleUserSubmit(handleUpdateAccount)}
        loading={isUpdatingAccount}
        disabled={!isUserValid || !isDirty}
      />
    </Page>
  );
};

export default EditProfile;

const EditProfileLoading = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <Page goBack className="gap-8">
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

      <View
        className=" rounded-lg px-6 py-4 gap-4"
        style={{ backgroundColor: theme.card }}
      >
        <Text className="h3" style={{ color: theme.text }}>
          {t("account.personalInfo")}
        </Text>

        <InputLoading label={t("account.firstName")} />
        <InputLoading label={t("account.lastName")} />
        <InputLoading label={t("account.email")} />
        <InputLoading label={t("account.phone")} />

        <DropdownLoading
          label={t("account.graduationYear")}
          placeholder={t("account.selectGraduationYear")}
          icon={<GraduationCap color={theme.text} size={20} />}
        />
      </View>

      <Button label={t("common.save")} disabled />
    </Page>
  );
};
