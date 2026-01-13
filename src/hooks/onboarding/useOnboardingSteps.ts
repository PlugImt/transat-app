import * as Application from "expo-application";
import { useMemo } from "react";
import type { User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";

export type OnboardingStep = "profilePicture" | "basicInfo" | "academicInfo" | "preview";

export interface OnboardingSteps {
  needsProfilePicture: boolean;
  needsBasicInfo: boolean;
  needsAcademicInfo: boolean;
  needsPreview: boolean;
  steps: OnboardingStep[];
  hasCompletedAll: boolean;
}

const ONBOARDING_SKIPPED_KEY = "onboarding_skipped";
const ONBOARDING_COMPLETED_KEY = "onboarding_completed";
const ONBOARDING_VERSION_KEY = "onboarding_version";
const ONBOARDING_FORCE_SHOW_KEY = "onboarding_force_show";

export const useOnboardingSteps = (user: User | null | undefined) => {
  return useMemo<OnboardingSteps>(() => {
    if (!user) {
      return {
        needsProfilePicture: false,
        needsBasicInfo: false,
        needsAcademicInfo: false,
        needsPreview: false,
        steps: [],
        hasCompletedAll: true,
      };
    }

    // Step 1: Profile Picture
    const needsProfilePicture = !user.profile_picture;
    
    // Step 2: Basic Info (First Name, Last Name, Phone Number)
    const needsBasicInfo =
      !user.first_name ||
      !user.last_name ||
      !user.phone_number;
    
    // Step 3: Academic Info (Formation, Graduation Year)
    const needsAcademicInfo =
      !user.formation_name ||
      !user.graduation_year;

    const steps: OnboardingStep[] = [];
    if (needsProfilePicture) {
      steps.push("profilePicture");
    }
    if (needsBasicInfo) {
      steps.push("basicInfo");
    }
    if (needsAcademicInfo) {
      steps.push("academicInfo");
    }
    // Always show preview if there are any steps
    if (steps.length > 0) {
      steps.push("preview");
    }

    return {
      needsProfilePicture,
      needsBasicInfo,
      needsAcademicInfo,
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
  if (skipped) {
    // Save the current app version when onboarding is skipped
    const currentVersion = Application.nativeApplicationVersion || "1.0.0";
    await storage.set(ONBOARDING_VERSION_KEY, currentVersion);
    // Clear force show flag
    await storage.set(ONBOARDING_FORCE_SHOW_KEY, false);
  }
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  const completed = await storage.get(ONBOARDING_COMPLETED_KEY);
  return completed === true;
};

export const setOnboardingCompleted = async (
  completed: boolean,
): Promise<void> => {
  await storage.set(ONBOARDING_COMPLETED_KEY, completed);
  if (completed) {
    // Save the current app version when onboarding is completed
    const currentVersion =
      Application.nativeApplicationVersion || "1.0.0";
    await storage.set(ONBOARDING_VERSION_KEY, currentVersion);
    // Clear force show flag
    await storage.set(ONBOARDING_FORCE_SHOW_KEY, false);
  }
};

export const getOnboardingVersion = async (): Promise<string | null> => {
  return await storage.get(ONBOARDING_VERSION_KEY);
};

export const getCurrentAppVersion = (): string => {
  return Application.nativeApplicationVersion || "1.0.0";
};

export const shouldShowOnboarding = async (): Promise<boolean> => {
  try {
    // Check if force show is set (after register/login) - highest priority
    const forceShow = await storage.get(ONBOARDING_FORCE_SHOW_KEY);
    if (forceShow === true) {
      return true;
    }

    // Check if onboarding was skipped
    const isSkipped = await getOnboardingSkipped();
    if (isSkipped === true) {
      // If skipped, check if version changed
      const savedVersion = await getOnboardingVersion();
      const currentVersion = getCurrentAppVersion();
      // If version changed, show onboarding again even if skipped
      if (savedVersion !== currentVersion) {
        return true;
      }
      return false;
    }

    // Check if onboarding was completed
    const isCompleted = await getOnboardingCompleted();
    if (isCompleted === true) {
      // If completed, check if version changed
      const savedVersion = await getOnboardingVersion();
      const currentVersion = getCurrentAppVersion();
      // If version changed, show onboarding again
      if (savedVersion !== currentVersion) {
        return true;
      }
      return false;
    }

    // If neither skipped nor completed (no value in storage), show onboarding
    // This covers the case where user is already logged in but onboarding was never shown
    return true;
  } catch (error) {
    console.error("[Onboarding] Error checking shouldShowOnboarding:", error);
    // On error, show onboarding by default to be safe
    return true;
  }
};

export const setForceShowOnboarding = async (force: boolean): Promise<void> => {
  await storage.set(ONBOARDING_FORCE_SHOW_KEY, force);
};
