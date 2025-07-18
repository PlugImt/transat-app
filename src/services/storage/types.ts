export type StorageItemValue = string | object | null;

export interface StorageItem {
  value: StorageItemValue;
  timestamp: number;
  expiry?: number; // Time in milliseconds
}

export interface StorageService {
  get<T>(key: string): Promise<T | null>;

  set(key: string, value: StorageItemValue, expiry?: number): Promise<boolean>;

  remove(key: string): Promise<boolean>;

  clear(): Promise<boolean>;

  getAllKeys(): Promise<string[]>;

  multiGet(keys: string[]): Promise<Array<[string, StorageItemValue]>>;

  multiSet(keyValuePairs: Array<[string, StorageItemValue]>): Promise<boolean>;

  multiRemove(keys: string[]): Promise<boolean>;
}

export default StorageService;
