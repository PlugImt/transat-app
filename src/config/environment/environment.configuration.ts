interface ApiEnvironment {
    API_URL_PROD: string;
    API_URL_DEV: string;
    API_TRANSLATION_KEY: string;
}

const getApiEnvironement = () : ApiEnvironment => {
    return {
        API_URL_PROD: process.env.EXPO_PUBLIC_API_URL || "",
        API_URL_DEV: process.env.EXPO_PUBLIC_API_URL_DEV || "",
        API_TRANSLATION_KEY: process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY || ""
    };
}

const apiEnv = getApiEnvironement()
export { apiEnv };