import type { ReactNode } from "react";
import { QueryBoundary } from "./QueryBoundary";
import type { QueryState } from "./types";
import { getIsRefetching } from "./types";
import { useSafeRefetch } from "./useSafeRefetch";
import { WidgetErrorCard } from "./WidgetErrorCard";

export type WidgetBoundaryProps = {
  title?: string;
  query: QueryState;
  loading: ReactNode;
  empty?: ReactNode;
  isEmpty?: boolean;
  children: ReactNode;
};

export const WidgetBoundary = ({
  title,
  query,
  loading,
  empty,
  isEmpty = false,
  children,
}: WidgetBoundaryProps) => {
  const isRetrying = getIsRefetching(query.isFetching, query.isPending);
  const safeRefetch = useSafeRefetch(query.refetch, query.isFetching ?? false);

  return (
    <QueryBoundary
      query={query}
      loading={loading}
      error={
        <WidgetErrorCard
          title={title}
          error={query.error}
          onRetry={safeRefetch}
          isRetrying={isRetrying}
        />
      }
      empty={empty}
      isEmpty={isEmpty}
    >
      {children}
    </QueryBoundary>
  );
};
