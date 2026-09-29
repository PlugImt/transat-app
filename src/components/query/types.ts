export type QueryState = {
  isPending: boolean;
  isError: boolean;
  isFetching?: boolean;
  error: Error | null;
  refetch: () => void;
};

export const getIsRefetching = (
  isFetching: boolean | undefined,
  isPending: boolean,
): boolean => Boolean(isFetching) && !isPending;
