import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GraduationCap } from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";
import type { OnboardingStackParamList } from "@/app/navigation/OnboardingNavigator";
import { Button } from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { updateUserPayloadSchema } from "@/dto";
import type { formationName } from "@/enums";
import { useUpdateAccount } from "@/hooks/account/useUpdateAccount";
import { useUser } from "@/hooks/account/useUser";
import { hapticFeedback } from "@/utils/haptics.utils";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface OnboardingPersonalInfoProps {
  route: {
    params: { user: User };
  };
  onSkip: () => void;
}

export const OnboardingPersonalInfo = ({
  route,
  onSkip,
}: OnboardingPersonalInfoProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();
  const { data: user, refetch } = useUser();
  const displayUser = user || route.params.user;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(updateUserPayloadSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: displayUser.email || "",
      graduation_year: undefined as number | undefined,
      formation_name: undefined as formationName | undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (displayUser) {
      reset({
        first_name: displayUser.first_name || "",
        last_name: displayUser.last_name || "",
        phone_number: displayUser.phone_number || "",
        email: displayUser.email || "",
        graduation_year: displayUser?.graduation_year || undefined,
        formation_name: displayUser?.formation_name || undefined,
      });
    }
  }, [displayUser, reset]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const startAcademicYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    return (startAcademicYear + i).toString();
  });

  const handleUpdateAccount = (data: User) => {
    Keyboard.dismiss();
    updateAccount(data, {
      onSuccess: async () => {
        hapticFeedback.success();
        const updatedUser = await refetch();
        const currentUser = updatedUser.data || displayUser;
        navigation.navigate("Preview", { user: currentUser });
      },
      onError: () => {
        hapticFeedback.error();
      },
    });
  };

  return (
    <View
      className="flex-1 px-6 py-8"
      style={{ backgroundColor: theme.background }}
    >
      {/* Skip all button in top right */}
      <View className="absolute top-8 right-6 z-10">
        <Button
          label={t("onboarding.skipAll")}
          variant="ghost"
          onPress={onSkip}
          className="px-4 py-2"
        />
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 600,
        }}
        className="flex-1"
      >
        <View className="gap-6 mb-8">
          <View className="gap-2">
            <Text variant="h1">{t("onboarding.personalInfo.title")}</Text>
            <Text variant="body" color="muted">
              {t("onboarding.personalInfo.description")}
            </Text>
          </View>

          <View className="gap-4">
            <Input
              control={control}
              label={t("account.firstName")}
              name="first_name"
              textContentType="name"
              error={errors.first_name?.message}
            />

            <Input
              control={control}
              label={t("account.lastName")}
              name="last_name"
              textContentType="familyName"
              error={errors.last_name?.message}
            />

            <Input
              control={control}
              label={t("account.phone")}
              name="phone_number"
              textContentType="telephoneNumber"
              error={errors.phone_number?.message}
              keyboardType="phone-pad"
            />

            <Controller
              control={control}
              name="formation_name"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label={t("account.formationName")}
                  placeholder={t("account.selectFormationName")}
                  options={["FISE", "FIL", "FIT", "FIP", "FID"]}
                  value={value}
                  onValueChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="graduation_year"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label={t("account.graduationYear")}
                  placeholder={t("account.selectGraduationYear")}
                  icon={<GraduationCap color={theme.text} size={20} />}
                  options={yearOptions}
                  value={value ? value.toString() : undefined}
                  onValueChange={(value) =>
                    onChange(value ? Number(value) : undefined)
                  }
                />
              )}
            />
          </View>
        </View>
      </MotiView>

      <View className="gap-3">
        <Button
          label={t("onboarding.personalInfo.continue")}
          onPress={handleSubmit(handleUpdateAccount)}
          isUpdating={isUpdating}
          disabled={!isDirty || !isValid}
        />
        <Button
          label={t("onboarding.personalInfo.skip")}
          variant="ghost"
          onPress={onSkip}
        />
      </View>
    </View>
  );
};
