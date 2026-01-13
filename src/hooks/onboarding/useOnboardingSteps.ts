import { useMemo } from "react";
import type { User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";

export type OnboardingStep = "profilePicture" | "personalInfo" | "preview";

export interface OnboardingSteps {
  needsProfilePicture: boolean;
  needsPersonalInfo: boolean;
  needsPreview: boolean;
  steps: OnboardingStep[];
  hasCompletedAll: boolean;
}

const ONBOARDING_SKIPPED_KEY = "onboarding_skipped";
const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

export const useOnboardingSteps = (user: User | null | undefined) => {
  return useMemo<OnboardingSteps>(() => {
    if (!user) {
      return {
        needsProfilePicture: false,
        needsPersonalInfo: false,
        needsPreview: false,
        steps: [],
        hasCompletedAll: true,
      };
    }

    // Check if onboarding was skipped or completed
    // We'll check this in the component using async storage

    const needsProfilePicture = !user.profile_picture;
    const needsPersonalInfo =
      !user.first_name ||
      !user.last_name ||
      !user.phone_number ||
      !user.formation_name ||
      !user.graduation_year;

    const steps: OnboardingStep[] = [];
    if (needsProfilePicture) {
      steps.push("profilePicture");
    }
    if (needsPersonalInfo) {
      steps.push("personalInfo");
    }
    // Always show preview if there are any steps
    if (steps.length > 0) {
      steps.push("preview");
    }

    return {
      needsProfilePicture,
      needsPersonalInfo,
      needsPreview: steps.length > 0,
      steps,
      hasCompletedAll: steps.length === 0,
    };
  }, [user]);
};

export const getOnboardingSkipped = async (): Promise<boolean> => {
  const skipped = await storage.get(ONBOARDING_SKIPPED_KEY);
  return skipped === true;
};

export const setOnboardingSkipped = async (skipped: boolean): Promise<void> => {
  await storage.set(ONBOARDING_SKIPPED_KEY, skipped);
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  const completed = await storage.get(ONBOARDING_COMPLETED_KEY);
  return completed === true;
};

export const setOnboardingCompleted = async (
  completed: boolean,
): Promise<void> => {
  await storage.set(ONBOARDING_COMPLETED_KEY, completed);
};
