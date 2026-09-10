import { useUser } from "@/hooks/account/useUser";

export const useIsStaff = (): boolean => {
  const { data: user } = useUser();
  return user?.roles?.includes("STAFF") ?? false;
};
