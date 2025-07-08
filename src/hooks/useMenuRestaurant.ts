import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRestaurant, getRestaurantRating, postRestaurantReview } from "@/api";
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

export const usePostRestaurantReview = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment?: string }) =>
      postRestaurantReview(id, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.restaurantRating, id],
      });
    },
  });
};
