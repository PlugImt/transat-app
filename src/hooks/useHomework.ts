import { skipToken, useQuery } from "@tanstack/react-query";
import { getHomeworks } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { Homework } from "@/dto";
import useAuth from "./account/useAuth";

export const useHomework = () => {
  const { user } = useAuth();

  const userId = user?.id_newf;

  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.homework, userId],
    queryFn: userId ? () => getHomeworks(userId) : skipToken,
    enabled: !!userId,
  });

  const upcomingHomeworks = data
    ?.filter((hw: Homework) => new Date(hw.deadline) >= new Date())
    .sort(
      (a: Homework, b: Homework) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );

  return { data, upcomingHomeworks, isPending, error, refetch, isError };
};
