import type { NativeStackNavigationProp } from "expo-router/build/react-navigation/native-stack";
import { useNavigation } from "expo-router/react-navigation";
import { Edit } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import Avatar from "@/components/common/Avatar";
import { Button, IconButton } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import type { User } from "@/dto";
import { useUpdateProfilePicture } from "@/hooks/account/useUpdateProfilePicture";
import { useUser } from "@/hooks/account/useUser";
import type { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";
import { hapticFeedback } from "@/utils/haptics.utils";

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

  const navigateToNextStep = (userData: User) => {
    // Check what's the next step based on user data
    const needsBasicInfo =
      !userData.first_name || !userData.last_name || !userData.phone_number;

    const needsAcademicInfo =
      !userData.formation_name || !userData.graduation_year;

    if (needsBasicInfo) {
      navigation.navigate("BasicInfo", { user: userData });
    } else if (needsAcademicInfo) {
      navigation.navigate("AcademicInfo", { user: userData });
    } else {
      navigation.navigate("Preview", { user: userData });
    }
  };

  const handleNext = () => {
    const currentUser = user || route.params.user;
    if (!currentUser) {
      return;
    }

    // Try to refetch to get latest user data, but don't block navigation if it fails
    refetch()
      .then((result) => {
        navigateToNextStep(result.data || currentUser);
      })
      .catch(() => {
        // If refetch fails, use current user data
        navigateToNextStep(currentUser);
      });
  };

  const handleSkip = () => {
    onSkipStep();
    const currentUser = user || route.params.user;
    if (!currentUser) {
      return;
    }

    navigateToNextStep(currentUser);
  };

  const displayUser = user || route.params.user;
  const hasProfilePicture = !!displayUser?.profile_picture;

  return (
    <Page
      disableScroll
      className="flex-1 items-center justify-center gap-8"
      footer={
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
      }
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

      <View className="items-center gap-2">
        <Text variant="h1" className="text-center">
          {t("onboarding.profilePicture.title")}
        </Text>
        <Text color="muted" className="text-center px-4">
          {t("onboarding.profilePicture.description")}
        </Text>
        <Text variant="sm" color="muted" className="text-center px-4">
          {t("onboarding.profilePicture.canChangeLater")}
        </Text>
      </View>
    </Page>
  );
};
