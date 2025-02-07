import axios from "axios";
import { weatherApiKey } from "./config";

interface WeatherData {
  temperature: number;
  condition: string;
  img: string;
}

export async function getWeather(
  setRefreshing: (refreshing: boolean) => void,
): Promise<WeatherData | undefined> {
  const lat = 47.218371; // Latitude de Nantes
  const lon = -1.553621; // Longitude de Nantes
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const temperature: number = data.main.temp;
    const weatherCondition: string = data.weather[0].main;
    const img: string = data.weather[0].icon;

    setRefreshing(false);

    return { temperature, condition: weatherCondition, img };
  } catch (error) {
    console.error("Error while getting the weather :", error);
    setRefreshing(false);
  }
}
