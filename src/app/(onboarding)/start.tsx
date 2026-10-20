import { useEffect, useState } from "react";
import { useUser } from "@/hooks/account/useUser";
import {
  getForceShowOnboarding,
  useOnboardingSteps,
} from "@/hooks/onboarding/useOnboardingSteps";
import { OnboardingAcademicInfo } from "@/screens/onboarding/OnboardingAcademicInfo";
import { OnboardingBasicInfo } from "@/screens/onboarding/OnboardingBasicInfo";
import { OnboardingPreview } from "@/screens/onboarding/OnboardingPreview";
import { OnboardingProfilePicture } from "@/screens/onboarding/OnboardingProfilePicture";
import { OnboardingSuccess } from "@/screens/onboarding/OnboardingSuccess";

export default function OnboardingStart() {
  const { data: user, isPending } = useUser();
  const { steps } = useOnboardingSteps(user);
  const [isForceShow, setIsForceShow] = useState<boolean | null>(null);

  useEffect(() => {
    getForceShowOnboarding().then(setIsForceShow);
  }, []);

  if (isPending || !user || isForceShow === null) return null;

  const firstStep = isForceShow ? "profilePicture" : steps[0];
  if (firstStep === "profilePicture") return <OnboardingProfilePicture />;
  if (firstStep === "basicInfo") return <OnboardingBasicInfo />;
  if (firstStep === "academicInfo") return <OnboardingAcademicInfo />;
  if (firstStep === "preview") return <OnboardingPreview />;
  return <OnboardingSuccess />;
}
