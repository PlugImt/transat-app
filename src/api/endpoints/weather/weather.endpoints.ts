import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type { WeatherData } from "@/dto";

interface WeatherResult {
  temperature: number;
  condition: string;
  img: string;
}

export const fetchWeather = async (): Promise<WeatherResult> => {
  const data = await apiRequest<WeatherData>(API_ROUTES.weather, Method.GET);

  return {
    temperature: data.main.temp,
    condition: data.weather[0].main,
    img: data.weather[0].icon,
  };
};
