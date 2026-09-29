import { useUser } from "@/hooks/account/useUser";

export const useIsAcademics = (): boolean => {
  const { data: user } = useUser();
  return user?.roles?.includes("ACADEMICS") ?? false;
};
