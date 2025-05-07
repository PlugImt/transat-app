const apiUrlProd = process.env.EXPO_PUBLIC_API_URL || "";
const apiUrlDev = process.env.EXPO_PUBLIC_API_URL_DEV || "";
const translationApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY || "";

export { apiUrlProd, apiUrlDev, translationApiKey };
