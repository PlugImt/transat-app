import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchUser } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn: () => fetchUser(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { data, isPending, error, isError };
};
