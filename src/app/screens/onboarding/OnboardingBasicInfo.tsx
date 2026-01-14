import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";
import { MotiView } from "moti";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { updateUserPayloadSchema } from "@/dto";
import { useUpdateAccount } from "@/hooks/account/useUpdateAccount";
import { useUser } from "@/hooks/account/useUser";
import { hapticFeedback } from "@/utils/haptics.utils";
import type { OnboardingStackParamList } from "@/app/navigation/OnboardingNavigator";
import type { User } from "@/dto";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface OnboardingBasicInfoProps {
  route: {
    params: { user: User };
  };
  onSkipStep: () => void;
}

export const OnboardingBasicInfo = ({
  route,
  onSkipStep,
}: OnboardingBasicInfoProps) => {
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
      graduation_year: displayUser?.graduation_year || undefined,
      formation_name: displayUser?.formation_name || undefined,
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

  const handleUpdateAccount = (formData: User) => {
    Keyboard.dismiss();
    updateAccount(formData, {
      onSuccess: async (updatedUser) => {
        hapticFeedback.success();
        // The mutation already fetches fresh user data, but let's refetch to be sure
        if (refetch) {
          try {
            const freshUser = await refetch();
            // Use fresh data or fallback to updated user from mutation or merged form data
            const currentUser = freshUser.data || updatedUser || {
              ...displayUser,
              ...formData,
            };
            
            navigateToNextStep(currentUser);
          } catch (error) {
            console.error("[Onboarding] Error refetching user:", error);
            // Fallback: use updated user from mutation or merged form data
            const currentUser = updatedUser || {
              ...displayUser,
              ...formData,
            };
            navigateToNextStep(currentUser);
          }
        } else {
          // If refetch is not available, use updated user from mutation or merged form data
          const currentUser = updatedUser || {
            ...displayUser,
            ...formData,
          };
          navigateToNextStep(currentUser);
        }
      },
      onError: (error) => {
        hapticFeedback.error();
        console.error("[Onboarding] Error updating account:", error);
      },
    });
  };

  const navigateToNextStep = (userData: User) => {
    // Check what's the next step
    const needsAcademicInfo =
      !userData.formation_name ||
      !userData.graduation_year;

    if (needsAcademicInfo) {
      navigation.navigate("AcademicInfo", { user: userData });
    } else {
      navigation.navigate("Preview", { user: userData });
    }
  };

  const handleSkip = () => {
    const currentUser = user || route.params.user;
    navigateToNextStep(currentUser);
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
            <Text variant="h1">{t("onboarding.basicInfo.title")}</Text>
            <Text variant="body" color="muted">
              {t("onboarding.basicInfo.description")}
            </Text>
          </View>

          <View className="gap-4">
            <Input
              control={control}
              label={t("account.firstName")}
              name="first_name"
              textContentType="name"
              error={errors.first_name?.message}
              placeholder={t("onboarding.basicInfo.firstNamePlaceholder")}
            />

            <Input
              control={control}
              label={t("account.lastName")}
              name="last_name"
              textContentType="familyName"
              error={errors.last_name?.message}
              placeholder={t("onboarding.basicInfo.lastNamePlaceholder")}
            />

            <Input
              control={control}
              label={t("account.phone")}
              name="phone_number"
              textContentType="telephoneNumber"
              error={errors.phone_number?.message}
              keyboardType="phone-pad"
              placeholder={t("onboarding.basicInfo.phonePlaceholder")}
            />
            <Text variant="sm" color="muted" className="px-1 -mt-2">
              {t("onboarding.basicInfo.phoneInfo")}
            </Text>
          </View>
        </View>
      </MotiView>

      <View className="gap-3">
        <Button
          label={t("onboarding.basicInfo.skip")}
          variant="ghost"
          onPress={handleSkip}
        />
        <Button
          label={t("onboarding.basicInfo.continue")}
          onPress={handleSubmit(handleUpdateAccount)}
          isUpdating={isUpdating}
          disabled={!isDirty || !isValid}
        />
      </View>
    </View>
  );
};
