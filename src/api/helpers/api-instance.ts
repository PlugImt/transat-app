import axios, { type AxiosInstance } from "axios";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import { apiEnv } from "@/config";

const { API_URL_DEV, API_URL_PROD } = apiEnv;

let apiInstance: AxiosInstance | null = null;

export const getAPIUrl = async (): Promise<string> => {
    const isDevSelected = await storage.get(STORAGE_KEYS.IS_DEV_SERVER_SELECTED);
    return isDevSelected === "true" &&  API_URL_DEV ? API_URL_DEV : API_URL_PROD;
};

const createApiInstance = async (): Promise<AxiosInstance> => {
    const baseURL = await getAPIUrl();

    const instance = axios.create({ baseURL });

    instance.interceptors.request.use(async (config) => {
        const token = await storage.get("token");

        if (token) {
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }

        if (__DEV__) {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
                baseURL,
                hasToken: Boolean(token),
            });
        }

        return config;
    });

    return instance;
};

export const getApiInstance = async (): Promise<AxiosInstance> => {
    if (!apiInstance) {
        apiInstance = await createApiInstance();
    }
    return apiInstance;
};