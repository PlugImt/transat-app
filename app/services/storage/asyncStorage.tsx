import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageItem, StorageService} from './types';

class AsyncStorageService implements StorageService {
    /**
     * Get a value from storage with optional type casting
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const item = await AsyncStorage.getItem(key);
            if (!item) return null;

            const parsedItem: StorageItem = JSON.parse(item);

            // Check if item has expired
            if (parsedItem.expiry && Date.now() > parsedItem.timestamp + parsedItem.expiry) {
                await this.remove(key);
                return null;
            }

            return parsedItem.value as T;
        } catch (error) {
            console.error(`Error getting item ${key} from storage:`, error);
            return null;
        }
    }

    /**
     * Set a value in storage with optional expiry
     */
    async set(key: string, value: any, expiry?: number): Promise<boolean> {
        try {
            const item: StorageItem = {
                value,
                timestamp: Date.now(),
                expiry
            };

            await AsyncStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error(`Error setting item ${key} in storage:`, error);
            return false;
        }
    }

    /**
     * Remove a value from storage
     */
    async remove(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item ${key} from storage:`, error);
            return false;
        }
    }

    /**
     * Clear all values from storage
     */
    async clear(): Promise<boolean> {
        try {
            await AsyncStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Get all storage keys
     */
    async getAllKeys(): Promise<string[]> {
        try {
            return await AsyncStorage.getAllKeys() as string[];
        } catch (error) {
            console.error('Error getting all keys from storage:', error);
            return [];
        }
    }

    /**
     * Get multiple items from storage
     */
    async multiGet(keys: string[]): Promise<Array<[string, any]>> {
        try {
            const items = await AsyncStorage.multiGet(keys);
            return items.map(([key, value]) => {
                if (!value) return [key, null];

                const parsedItem: StorageItem = JSON.parse(value);

                // Check if item has expired
                if (parsedItem.expiry && Date.now() > parsedItem.timestamp + parsedItem.expiry) {
                    this.remove(key);
                    return [key, null];
                }

                return [key, parsedItem.value];
            });
        } catch (error) {
            console.error('Error getting multiple items from storage:', error);
            return [];
        }
    }

    /**
     * Set multiple items in storage
     */
    async multiSet(keyValuePairs: Array<[string, any]>): Promise<boolean> {
        try {
            const pairs: Array<[string, string]> = keyValuePairs.map(([key, value]) => {
                const item: StorageItem = {
                    value,
                    timestamp: Date.now()
                };
                return [key, JSON.stringify(item)];
            });

            await AsyncStorage.multiSet(pairs);
            return true;
        } catch (error) {
            console.error('Error setting multiple items in storage:', error);
            return false;
        }
    }

    /**
     * Remove multiple items from storage
     */
    async multiRemove(keys: string[]): Promise<boolean> {
        try {
            await AsyncStorage.multiRemove(keys);
            return true;
        } catch (error) {
            console.error('Error removing multiple items from storage:', error);
            return false;
        }
    }

    /**
     * Get item expiry time
     */
    async getExpiry(key: string): Promise<number | null> {
        try {
            const item = await AsyncStorage.getItem(key);
            if (!item) return null;

            const parsedItem: StorageItem = JSON.parse(item);
            if (!parsedItem.expiry) return null;

            const expiryTime = parsedItem.timestamp + parsedItem.expiry;
            return expiryTime > Date.now() ? expiryTime : null;
        } catch (error) {
            console.error(`Error getting expiry for item ${key}:`, error);
            return null;
        }
    }

    /**
     * Update item expiry time
     */
    async updateExpiry(key: string, expiry: number): Promise<boolean> {
        try {
            const item = await AsyncStorage.getItem(key);
            if (!item) return false;

            const parsedItem: StorageItem = JSON.parse(item);
            parsedItem.expiry = expiry;
            parsedItem.timestamp = Date.now();

            await AsyncStorage.setItem(key, JSON.stringify(parsedItem));
            return true;
        } catch (error) {
            console.error(`Error updating expiry for item ${key}:`, error);
            return false;
        }
    }
}


export const storage = new AsyncStorageService();
