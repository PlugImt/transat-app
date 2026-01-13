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
import Dropdown from "@/components/common/Dropdown";
import Input from "@/components/common/Input";
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
  const { refetch } = useUser();

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
      email: user.email || "",
      graduation_year: undefined as number | undefined,
      formation_name: undefined as formationName | undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
        graduation_year: user?.graduation_year || undefined,
        formation_name: user?.formation_name || undefined,
      });
    }
  }, [user, reset]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const startAcademicYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    return (startAcademicYear + i).toString();
  });

  const user = route.params.user;

  const handleUpdateAccount = (data: User) => {
    Keyboard.dismiss();
    updateAccount(data, {
      onSuccess: async () => {
        hapticFeedback.success();
        const updatedUser = await refetch();
        const currentUser = updatedUser.data || user;
        navigation.navigate("Preview", { user: currentUser });
      },
      onError: () => {
        hapticFeedback.error();
      },
    });
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
            <Text variant="h1">{t("onboarding.personalInfo.title")}</Text>
            <Text variant="body" color="muted">
              {t("onboarding.personalInfo.description")}
            </Text>
          </View>

          <View className="gap-4">
            <Input
              control={control}
              label="Prénom"
              name="first_name"
              textContentType="name"
              error={errors.first_name?.message}
            />

            <Input
              control={control}
              label="Nom"
              name="last_name"
              textContentType="familyName"
              error={errors.last_name?.message}
            />

            <Input
              control={control}
              label="Numéro de téléphone"
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
                  label="Formation"
                  placeholder="Sélectionnez votre formation"
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
                  label="Année de diplôme"
                  placeholder="Sélectionnez votre année de diplôme"
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
