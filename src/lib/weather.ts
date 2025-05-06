import i18n from "@/i18n";
import type { WeatherData } from "@/types/weather";
import { t } from "i18next";
import { weatherApiKey } from "./config";
import { translateText } from "./translation";

export async function fetchWeather(): Promise<WeatherData> {
  const lat = 47.218371; // Latitude de Nantes
  const lon = -1.553621; // Longitude de Nantes
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(t("common.errors.unableToFetch"));
  }
  const data = await response.json();

  const temperature: number = data.main.temp;
  const weatherCondition: string = data.weather[0].main;
  const img: string = data.weather[0].icon;

  // Get the current language from i18n
  const currentLanguage = i18n.language.toUpperCase();
  let translatedCondition: string = weatherCondition;

  if (currentLanguage !== "EN") {
    // Translate the weather condition
    try {
      translatedCondition = await translateText(
        weatherCondition,
        // biome-ignore lint/suspicious/noExplicitAny: type DeepLSupportedLanguages which is string
        currentLanguage.toLowerCase() as any,
      );
    } catch (error) {
      console.error("Error translating weather condition", error);
    }
  }

  return {
    temperature,
    condition: translatedCondition,
    img,
  } satisfies WeatherData;
}
