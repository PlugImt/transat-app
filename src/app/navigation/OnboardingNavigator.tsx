import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { OnboardingProfilePicture } from "@/app/screens/onboarding/OnboardingProfilePicture";
import { OnboardingBasicInfo } from "@/app/screens/onboarding/OnboardingBasicInfo";
import { OnboardingAcademicInfo } from "@/app/screens/onboarding/OnboardingAcademicInfo";
import { OnboardingPreview } from "@/app/screens/onboarding/OnboardingPreview";
import { OnboardingSuccess } from "@/app/screens/onboarding/OnboardingSuccess";
import { useTheme } from "@/contexts/ThemeContext";
import {
  setOnboardingSkipped,
  setOnboardingCompleted,
  setForceShowOnboarding,
  useOnboardingSteps,
} from "@/hooks/onboarding/useOnboardingSteps";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/constants";
import type { User } from "@/dto";

export type OnboardingStackParamList = {
  ProfilePicture: { user: User };
  BasicInfo: { user: User };
  AcademicInfo: { user: User };
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
  const { data: user, isPending } = useUser();
  const queryClient = useQueryClient();
  const onboardingSteps = useOnboardingSteps(user || null);

  // Handle skipping a single step (not the entire onboarding)
  const handleSkipStep = async () => {
    // This will be handled by each screen individually
    // They will navigate to the next step or preview
    await setOnboardingSkipped(true);
  };

  const handleComplete = async () => {
    await setOnboardingCompleted(true);
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    // Clear force show flag
    await setForceShowOnboarding(false);
    onComplete();
  };

  // Wait for user to load
  if (isPending || !user) {
    return null;
  }

  const { steps } = onboardingSteps;

  const getInitialRouteName = (): keyof OnboardingStackParamList => {
    if (steps.length === 0) return "Success";
    const firstStep = steps[0];
    if (firstStep === "profilePicture") {
      return "ProfilePicture";
    }
    if (firstStep === "basicInfo") {
      return "BasicInfo";
    }
    if (firstStep === "academicInfo") {
      return "AcademicInfo";
    }
    return "Preview";
  };

  // All screens must be declared for React Navigation to work properly
  // We control which one is shown via initialRouteName and navigation logic
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
        <Stack.Screen
          name="ProfilePicture"
          initialParams={{ user }}
          options={{ headerShown: false }}
        >
          {(props) => (
            <OnboardingProfilePicture
              route={props.route}
              onSkipStep={handleSkipStep}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="BasicInfo"
          initialParams={{ user }}
          options={{ headerShown: false }}
        >
          {(props) => (
            <OnboardingBasicInfo route={props.route} onSkipStep={handleSkipStep} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="AcademicInfo"
          initialParams={{ user }}
          options={{ headerShown: false }}
        >
          {(props) => (
            <OnboardingAcademicInfo route={props.route} onSkipStep={handleSkipStep} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Preview"
          initialParams={{ user }}
          options={{ headerShown: false }}
        >
          {(props) => (
            <OnboardingPreview
              route={props.route}
              onComplete={handleComplete}
              onSkipStep={handleSkipStep}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Success">
          {() => <OnboardingSuccess onFinish={handleComplete} />}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
};
