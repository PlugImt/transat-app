import {NavigatorScreenParams} from "@react-navigation/core";

export interface StorageItem {
    value: any;
    timestamp: number;
    expiry?: number; // Time in milliseconds
}

// Auth Stack Types
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword?: undefined;
};

export interface StorageService {
    get<T>(key: string): Promise<T | null>;

    set(key: string, value: any, expiry?: number): Promise<boolean>;

    remove(key: string): Promise<boolean>;

    clear(): Promise<boolean>;

    getAllKeys(): Promise<string[]>;

    multiGet(keys: string[]): Promise<Array<[string, any]>>;

    multiSet(keyValuePairs: Array<[string, any]>): Promise<boolean>;

    multiRemove(keys: string[]): Promise<boolean>;
}

// Main App Stack Types
export type AppStackParamList = {
    Home: undefined;
    WashingMachine: undefined;
    Restoration: undefined;
    Games: undefined;
    Profile: {
        userId: string;
    };
    Settings: undefined;
    BottomTabNavigator: undefined;
    Clubs: undefined;
    Traq: undefined;
};

// Root Stack Types
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<AppStackParamList>;
};

// Navigation Types for useNavigation hook
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}

export default StorageService;