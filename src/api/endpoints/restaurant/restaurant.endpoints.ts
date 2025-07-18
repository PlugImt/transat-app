import { API_ROUTES, apiRequest, Method } from "@/api";
import type { MenuData, RestaurantReview } from "@/dto";

export const getRestaurant = async () => {
  return await apiRequest<MenuData>(`${API_ROUTES.restaurant}`, Method.GET);
};

export const getRestaurantRating = async (id: number) => {
  return await apiRequest<RestaurantReview>(
    API_ROUTES.restaurantRating.replace(":id", id.toString()),
    Method.GET,
  );
};

export const postRestaurantReview = async (
  id: number,
  rating: number,
  comment?: string,
) => {
  const body: { rating: number; comment?: string } = { rating };
  if (comment) {
    body.comment = comment;
  }

  return await apiRequest<void>(
    API_ROUTES.restaurantRating.replace(":id", id.toString()),
    Method.POST,
    body,
  );
};
