import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Edit } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { MotiView } from "moti";
import Avatar from "@/components/common/Avatar";
import { Button, IconButton } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useUpdateProfilePicture } from "@/hooks/account/useUpdateProfilePicture";
import { useUser } from "@/hooks/account/useUser";
import { hapticFeedback } from "@/utils/haptics.utils";
import type { OnboardingStackParamList } from "@/app/navigation/OnboardingNavigator";
import type { User } from "@/dto";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface OnboardingProfilePictureProps {
  route: {
    params: { user: User };
  };
  onSkipStep: () => void;
}

export const OnboardingProfilePicture = ({
  route,
  onSkipStep,
}: OnboardingProfilePictureProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { mutate: updateProfilePicture, isPending: isUpdating } =
    useUpdateProfilePicture();
  const { data: user, refetch } = useUser();

  const handleUpdateProfilePicture = () => {
    updateProfilePicture(undefined, {
      onSuccess: async () => {
        hapticFeedback.success();
        await refetch();
      },
      onError: () => {
        hapticFeedback.error();
      },
    });
  };

  const handleNext = () => {
    const currentUser = user || route.params.user;
    if (!currentUser) {
      return;
    }

    // Try to refetch to get latest user data, but don't block navigation if it fails
    refetch()
      .then((result) => {
        const latestUser = result.data || currentUser;
        navigateToNextStep(latestUser);
      })
      .catch(() => {
        // If refetch fails, use current user data
        navigateToNextStep(currentUser);
      });
  };

  const navigateToNextStep = (userData: User) => {
    // Check what's the next step based on user data
    const needsBasicInfo =
      !userData.first_name ||
      !userData.last_name ||
      !userData.phone_number;

    const needsAcademicInfo =
      !userData.formation_name ||
      !userData.graduation_year;

    if (needsBasicInfo) {
      navigation.navigate("BasicInfo", { user: userData });
    } else if (needsAcademicInfo) {
      navigation.navigate("AcademicInfo", { user: userData });
    } else {
      navigation.navigate("Preview", { user: userData });
    }
  };

  const displayUser = user || route.params.user;
  const hasProfilePicture = !!displayUser?.profile_picture;

  const handleSkip = () => {
    const currentUser = user || route.params.user;
    if (!currentUser) {
      return;
    }

    navigateToNextStep(currentUser);
  };

  return (
    <View className="flex-1 px-6 py-8" style={{ backgroundColor: theme.background }}>
      <View className="flex-1 justify-center items-center gap-8">
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 150,
          }}
        >
          <TouchableOpacity
            className="relative"
            onPress={handleUpdateProfilePicture}
            disabled={isUpdating}
          >
            <Avatar user={displayUser} size={160} />
            <IconButton
              className="absolute bottom-0 right-0"
              icon={<Edit size={20} />}
              onPress={handleUpdateProfilePicture}
              isUpdating={isUpdating}
            />
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 600,
            delay: 200,
          }}
          className="items-center gap-4"
        >
          <Text variant="h1" className="text-center">
            {t("onboarding.profilePicture.title")}
          </Text>
          <Text variant="body" color="muted" className="text-center px-4">
            {t("onboarding.profilePicture.description")}
          </Text>
          <Text variant="sm" color="muted" className="text-center px-4">
            {t("onboarding.profilePicture.canChangeLater")}
          </Text>
        </MotiView>
      </View>

      <View className="gap-3">
        <Button
          label={t("onboarding.profilePicture.skip")}
          variant="ghost"
          onPress={handleSkip}
        />
        <Button
          label={t("onboarding.profilePicture.continue")}
          onPress={handleNext}
          disabled={!hasProfilePicture}
        />
      </View>
    </View>
  );
};
