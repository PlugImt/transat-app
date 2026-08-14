import { useCallback } from "react";

export const useSafeRefetch = (
  refetch: () => void,
  isFetching: boolean,
): (() => void) =>
  useCallback(() => {
    if (!isFetching) {
      refetch();
    }
  }, [refetch, isFetching]);
