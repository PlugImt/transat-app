import { useQuery } from "@tanstack/react-query";
import { getRestaurant, getRestaurantRating } from '@/api';
import { QUERY_KEYS } from "@/constants";
import type { RestaurantReview } from '@/dto';

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

export const userMenuRating = (id: number) => {
  const {
    data: rating,
    isPending,
    refetch,
    error,
    isError,
  } = useQuery({
    queryKey: [...QUERY_KEYS.restaurantRating, id],
    queryFn: () => getRestaurantRating(id),
    enabled: !!id,
  });

  return {
    rating,
    isPending,
    refetch,
    error,
    isError,
  };
};
