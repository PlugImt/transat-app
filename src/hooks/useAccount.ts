import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchUser } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";

export const useAccount = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn: () => fetchUser(),
  });

  return { data, isPending, error, isError };
};
