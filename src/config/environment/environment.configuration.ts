interface ApiEnvironment {
  API_URL_PROD: string;
  API_URL_DEV: string;
}

const getApiEnvironement = (): ApiEnvironment => {
  return {
    API_URL_PROD: process.env.EXPO_PUBLIC_API_URL || "",
    API_URL_DEV: process.env.EXPO_PUBLIC_API_URL_DEV || "",
  };
};

const apiEnv = getApiEnvironement();
export { apiEnv };
