import i18n from "@/i18n";
import type { WeatherData, WeatherDataApi } from "@/types/weather";
import { apiRequest } from "./apiRequest";

export async function fetchWeather(): Promise<WeatherData> {
  const currentLanguage = i18n.language.toUpperCase();
  const data = await apiRequest<WeatherDataApi>(
    `/weather?language=${currentLanguage}`,
  );

  return {
    temperature: data.main.temp,
    condition: data.weather[0].main,
    img: data.weather[0].icon,
  } satisfies WeatherData;
}
