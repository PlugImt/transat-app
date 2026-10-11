import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { LAYOUT_LEVELS, type LayoutLevel } from "@/constants";
import { STORAGE_KEYS } from "@/services/storage/constants";

// One preference shared by the gallery and every album: the density a person picks follows them around.
let current: LayoutLevel = "mosaic";
let loaded = false;
const listeners = new Set<() => void>();

const isLevel = (value: string | null): value is LayoutLevel =>
  LAYOUT_LEVELS.includes(value as LayoutLevel);

const publish = (level: LayoutLevel) => {
  if (level === current) return;
  current = level;
  for (const listener of listeners) listener();
};

const loadOnce = () => {
  if (loaded) return;
  loaded = true;
  AsyncStorage.getItem(STORAGE_KEYS.PHOTOS_GRID_LEVEL)
    .then((stored) => {
      if (isLevel(stored)) publish(stored);
    })
    .catch(() => {});
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const usePhotoLayout = () => {
  useEffect(loadOnce, []);
  const level = useSyncExternalStore(subscribe, () => current);

  const setLevel = useCallback((next: LayoutLevel) => {
    publish(next);
    AsyncStorage.setItem(STORAGE_KEYS.PHOTOS_GRID_LEVEL, next).catch(() => {});
  }, []);

  /** One level denser (-1) or more spacious (+1); returns whether it changed. */
  const stepLevel = useCallback(
    (direction: 1 | -1) => {
      const next = LAYOUT_LEVELS[LAYOUT_LEVELS.indexOf(current) + direction];
      if (!next) return false;
      setLevel(next);
      return true;
    },
    [setLevel],
  );

  return { level, setLevel, stepLevel };
};
