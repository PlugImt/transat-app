import { apiRequest, Method } from "@/api";
import i18n from "i18next";
import type { EmploiDuTempsData } from "@/dto";

const TARGET_URL = "/api/planning/users/:email/courses/today";

export const getEmploiDuTempsToday = async (
  	email: string,
): Promise<EmploiDuTempsData> => {
	const currentLanguage = i18n.language.toLowerCase();

	TARGET_URL.replace(":email", email);

	const queryParams = new URLSearchParams();
	queryParams.append("language", currentLanguage);

	return await apiRequest<EmploiDuTempsData>(
		`${TARGET_URL}?${queryParams.toString()}`,
		Method.GET
	);
}
