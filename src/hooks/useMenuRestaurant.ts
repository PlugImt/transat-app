import { useQuery } from "@tanstack/react-query";
import { getRestaurant } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useMenuRestaurant = () => {
  const {
    data: menu,
    isPending,
    refetch,
    error,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.restaurantMenu,
    queryFn: () => getRestaurant(),
  });

  return {
    menu,
    isPending,
    refetch,
    error,
    isError,
  };
};
