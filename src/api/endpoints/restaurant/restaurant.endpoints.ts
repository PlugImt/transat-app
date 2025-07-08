import type { AxiosRequestConfig } from "axios";
import i18n from "i18next";
import { API_ROUTES, apiRequest, Method } from "@/api";
import type { MenuData, RestaurantReview } from "@/dto";

export const getRestaurant = async () => {
  const currentLanguage = i18n.language.toLowerCase();

  const config: AxiosRequestConfig = {
    params: {
      language: currentLanguage,
    },
  };

  return await apiRequest<MenuData>(
    `${API_ROUTES.restaurant}`,
    Method.GET,
    {},
    { ...config },
  );
};

export const getRestaurantRating = async (id: number) => {
  return await apiRequest<RestaurantReview>(
    API_ROUTES.restaurantRating.replace(":id", id.toString()),
    Method.GET,
  );
};
