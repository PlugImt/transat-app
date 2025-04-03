import { z } from "zod";

const configSchema = z.object({
  EXPO_PUBLIC_WEATHER_API_KEY: z.string(),
  EXPO_PUBLIC_API_URL: z.string(),
  EXPO_PUBLIC_API_URL_DEV: z.string().optional(),
});

const config = configSchema.parse(process.env);

if (!config) {
  throw new Error("Config is not set");
}

const {
  EXPO_PUBLIC_WEATHER_API_KEY: weatherApiKey,
  EXPO_PUBLIC_API_URL: apiUrlProd,
  EXPO_PUBLIC_API_URL_DEV: apiUrlDev,
} = config;

export { weatherApiKey, apiUrlProd, apiUrlDev };
