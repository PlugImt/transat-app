import { useLocalSearchParams } from "expo-router";

export const useRouteId = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return paramNumber(id);
};

export const paramString = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export const paramNumber = (value: string | string[] | undefined) =>
  Number(paramString(value));

export const paramJson = <T>(value: string | string[] | undefined) => {
  const raw = paramString(value);
  if (!raw) return undefined;
  return JSON.parse(raw) as T;
};
