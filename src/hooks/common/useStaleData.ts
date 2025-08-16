import { useEffect, useRef, useState } from "react";

export function useStaleData<T>(
  data: T | undefined,
  isLoading: boolean,
): T | undefined {
  const [stale, setStale] = useState<T | undefined>(data);
  const prevLoading = useRef<boolean>(false);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setStale(data);
    }
    prevLoading.current = isLoading;
  }, [data, isLoading]);

  return isLoading ? stale : data;
}

export default useStaleData;
