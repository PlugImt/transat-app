import { QUERY_KEYS } from "@/lib/queryKeys";
import { getRestaurant } from "@/lib/restaurant";
import { useQuery } from "@tanstack/react-query";

export const useRestaurantMenu = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.restaurantMenu,
    queryFn: () => getRestaurant(),
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
