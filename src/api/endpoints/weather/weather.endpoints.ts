import { API_ROUTES, apiRequest, Method } from "@/api";
import type { WeatherData } from "@/dto";
import i18n from "@/i18n";

interface WeatherResult {
  temperature: number;
  condition: string;
  img: string;
}

export const fetchWeather = async (): Promise<WeatherResult> => {
  const currentLanguage = i18n.language.toUpperCase();

  const data = await apiRequest<WeatherData>(
    API_ROUTES.weather,
    Method.GET,
    {},
    {
      params: {
        language: currentLanguage,
      },
    },
  );

  return {
    temperature: data.main.temp,
    condition: data.weather[0].main,
    img: data.weather[0].icon,
  };
};
