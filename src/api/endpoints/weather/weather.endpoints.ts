import { API_ROUTES, apiRequest } from "@/api";
import i18n from "@/i18n";
import type { WeatherData } from "@/dto";

interface WeatherResult {
    temperature: number;
    condition: string;
    img: string;
}

export const fetchWeather = async () : Promise<WeatherResult> => {
    const currentLanguage = i18n.language.toUpperCase();
    const data = await apiRequest<WeatherData>(
        `${API_ROUTES.weather}?language=${currentLanguage}`,
    );

    return {
        temperature: data.main.temp,
        condition: data.weather[0].main,
        img: data.weather[0].icon,
    };
}
