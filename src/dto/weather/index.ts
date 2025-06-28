import { z } from "zod";

export const weatherSchema = z.object({
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const weatherDataSchema = z.object({
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(weatherSchema),
  wind: z.object({
    speed: z.number(),
  }),
  name: z.string(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;
