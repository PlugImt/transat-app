const weatherApiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";
const apiUrlProd = process.env.EXPO_PUBLIC_API_URL || "";
const apiUrlDev = process.env.EXPO_PUBLIC_API_URL_DEV || "";
const translationApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY || "";

export { weatherApiKey, apiUrlProd, apiUrlDev, translationApiKey };
