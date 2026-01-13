import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";
import { MotiView } from "moti";
import { Button } from "@/components/common/Button";
import SimpleDropdown from "@/components/common/SimpleDropdown";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { updateUserPayloadSchema } from "@/dto";
import type { formationName } from "@/enums";
import { useUpdateAccount } from "@/hooks/account/useUpdateAccount";
import { useUser } from "@/hooks/account/useUser";
import { hapticFeedback } from "@/utils/haptics.utils";
import type { OnboardingStackParamList } from "@/app/navigation/OnboardingNavigator";
import type { User } from "@/dto";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface OnboardingAcademicInfoProps {
  route: {
    params: { user: User };
  };
  onSkipStep: () => void;
}

export const OnboardingAcademicInfo = ({
  route,
  onSkipStep,
}: OnboardingAcademicInfoProps) => {
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
    watch,
  } = useForm({
    resolver: zodResolver(updateUserPayloadSchema),
    defaultValues: {
      first_name: displayUser.first_name || "",
      last_name: displayUser.last_name || "",
      phone_number: displayUser.phone_number || "",
      email: displayUser.email || "",
      graduation_year: displayUser?.graduation_year || undefined,
      formation_name: displayUser?.formation_name || undefined,
    },
    mode: "onChange",
  });

  // Watch form values to ensure isDirty updates correctly
  const formationName = watch("formation_name");
  const graduationYear = watch("graduation_year");

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

  const handleSkip = () => {
    const currentUser = user || route.params.user;
    navigation.navigate("Preview", { user: currentUser });
  };

  return (
    <View className="flex-1 px-6 py-8" style={{ backgroundColor: theme.background }}>
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
            <Text variant="h1">{t("onboarding.academicInfo.title")}</Text>
            <Text variant="body" color="muted">
              {t("onboarding.academicInfo.description")}
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="formation_name"
              render={({ field: { onChange, value } }) => (
                <SimpleDropdown
                  label={t("account.formationName")}
                  placeholder={t("account.selectFormationName")}
                  options={["FISE", "FIL", "FIT", "FIP", "FID"]}
                  value={value || undefined}
                  onValueChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="graduation_year"
              render={({ field: { onChange, value } }) => (
                <SimpleDropdown
                  label={t("account.graduationYear")}
                  placeholder={t("account.selectGraduationYear")}
                  icon={<GraduationCap color={theme.text} size={20} />}
                  options={yearOptions}
                  value={value ? value.toString() : undefined}
                  onValueChange={(newValue) =>
                    onChange(newValue ? Number(newValue) : undefined)
                  }
                />
              )}
            />
          </View>
        </View>
      </MotiView>

      <View className="gap-3">
        <Button
          label={t("onboarding.academicInfo.skip")}
          variant="ghost"
          onPress={handleSkip}
        />
        <Button
          label={t("onboarding.academicInfo.continue")}
          onPress={handleSubmit(handleUpdateAccount)}
          isUpdating={isUpdating}
          disabled={!formationName && !graduationYear && !isDirty}
        />
      </View>
    </View>
  );
};
