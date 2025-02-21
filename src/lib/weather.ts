import type { WeatherData } from "@/types/weather";
import { weatherApiKey } from "./config";
import { t } from "i18next";

export async function fetchWeather(): Promise<WeatherData> {
  const lat = 47.218371; // Latitude de Nantes
  const lon = -1.553621; // Longitude de Nantes
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t('common.errors.unableToFetch'));
  }
  const data = await response.json();

  const temperature: number = data.main.temp;
  const weatherCondition: string = data.weather[0].main;
  const img: string = data.weather[0].icon;

  return {
    temperature,
    condition: weatherCondition,
    img,
  } satisfies WeatherData;
}
