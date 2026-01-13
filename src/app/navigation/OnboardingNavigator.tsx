import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { OnboardingProfilePicture } from "@/app/screens/onboarding/OnboardingProfilePicture";
import { OnboardingPersonalInfo } from "@/app/screens/onboarding/OnboardingPersonalInfo";
import { OnboardingPreview } from "@/app/screens/onboarding/OnboardingPreview";
import { OnboardingSuccess } from "@/app/screens/onboarding/OnboardingSuccess";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getOnboardingCompleted,
  getOnboardingSkipped,
  setOnboardingCompleted,
  setOnboardingSkipped,
  useOnboardingSteps,
} from "@/hooks/onboarding/useOnboardingSteps";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/constants";
import type { User } from "@/dto";

export type OnboardingStackParamList = {
  ProfilePicture: { user: User };
  PersonalInfo: { user: User };
  Preview: { user: User };
  Success: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export const OnboardingNavigator = ({
  onComplete,
}: OnboardingNavigatorProps) => {
  const { theme } = useTheme();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<
    boolean | null
  >(null);
  const onboardingSteps = useOnboardingSteps(user || null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setShouldShowOnboarding(false);
        return;
      }

      const isSkipped = await getOnboardingSkipped();
      const isCompleted = await getOnboardingCompleted();

      if (isSkipped || isCompleted || onboardingSteps.hasCompletedAll) {
        setShouldShowOnboarding(false);
        onComplete();
      } else {
        setShouldShowOnboarding(true);
      }
    };

    checkOnboardingStatus();
  }, [user, onboardingSteps.hasCompletedAll, onComplete]);

  const handleSkip = async () => {
    await setOnboardingSkipped(true);
    onComplete();
  };

  const handleComplete = async () => {
    await setOnboardingCompleted(true);
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    onComplete();
  };

  if (shouldShowOnboarding === null || !user || !shouldShowOnboarding) {
    return null;
  }

  const { steps } = onboardingSteps;

  const getInitialRouteName = (): keyof OnboardingStackParamList => {
    if (steps.length === 0) return "Success";
    const firstStep = steps[0];
    return firstStep === "profilePicture"
      ? "ProfilePicture"
      : firstStep === "personalInfo"
        ? "PersonalInfo"
        : "Preview";
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        {onboardingSteps.needsProfilePicture && (
          <Stack.Screen
            name="ProfilePicture"
            initialParams={{ user }}
            options={{ headerShown: false }}
          >
            {(props) => (
              <OnboardingProfilePicture
                route={props.route}
                onSkip={handleSkip}
              />
            )}
          </Stack.Screen>
        )}

        {onboardingSteps.needsPersonalInfo && (
          <Stack.Screen
            name="PersonalInfo"
            initialParams={{ user }}
            options={{ headerShown: false }}
          >
            {(props) => (
              <OnboardingPersonalInfo route={props.route} onSkip={handleSkip} />
            )}
          </Stack.Screen>
        )}

        {onboardingSteps.needsPreview && (
          <Stack.Screen
            name="Preview"
            initialParams={{ user }}
            options={{ headerShown: false }}
          >
            {(props) => (
              <OnboardingPreview
                route={props.route}
                onComplete={handleComplete}
                onSkip={handleSkip}
              />
            )}
          </Stack.Screen>
        )}

        <Stack.Screen name="Success">
          {() => <OnboardingSuccess onFinish={handleComplete} />}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
};
