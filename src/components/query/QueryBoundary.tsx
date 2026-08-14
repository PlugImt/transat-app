import type { ReactNode } from "react";
import type { QueryState } from "./types";

export type QueryBoundaryProps = {
  query: QueryState;
  loading: ReactNode;
  error: ReactNode;
  empty?: ReactNode;
  isEmpty?: boolean;
  children: ReactNode;
};

export const QueryBoundary = ({
  query,
  loading,
  error,
  empty,
  isEmpty = false,
  children,
}: QueryBoundaryProps) => {
  if (query.isPending) {
    return loading;
  }

  if (query.isError) {
    return error;
  }

  if (isEmpty) {
    return empty ?? null;
  }

  return children;
};
