import { API_ROUTES, apiRequest, Method } from "@/api";
import i18n from "i18next";
import type { MenuData } from "@/dto";

export const getRestaurant = async () => {
	const currentLanguage = i18n.language.toLowerCase();

	const queryParams = new URLSearchParams();
	queryParams.append("language", currentLanguage);

	return await apiRequest<MenuData>(
		`${API_ROUTES.restaurant}?${queryParams.toString()}`,
		Method.GET,
	);
}
