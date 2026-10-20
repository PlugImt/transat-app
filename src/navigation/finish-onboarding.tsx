import { createContext, useContext } from "react";

const FinishOnboardingContext = createContext<() => void>(() => {});

export const FinishOnboardingProvider = FinishOnboardingContext.Provider;

export const useFinishOnboarding = () => useContext(FinishOnboardingContext);
