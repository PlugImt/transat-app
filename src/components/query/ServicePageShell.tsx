import type { ReactNode } from "react";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page, type PageProps } from "@/components/page/Page";
import type { QueryState } from "./types";
import { getIsRefetching } from "./types";
import { useSafeRefetch } from "./useSafeRefetch";

export type ServicePageShellProps = {
  title: string;
  query: QueryState;
  loading: ReactNode;
  children: ReactNode;
  errorFooter?: ReactNode;
  pageProps?: Omit<PageProps, "children" | "title" | "onRefresh" | "refreshing">;
};

export const ServicePageShell = ({
  title,
  query,
  loading,
  children,
  errorFooter,
  pageProps,
}: ServicePageShellProps) => {
  const isRefetching = getIsRefetching(query.isFetching, query.isPending);
  const safeRefetch = useSafeRefetch(query.refetch, query.isFetching ?? false);

  if (query.isPending) {
    return loading;
  }

  if (query.isError) {
    return (
      <ErrorPage
        title={title}
        error={query.error}
        refetch={safeRefetch}
        isRefetching={isRefetching}
        refreshing={query.isFetching ?? false}
      >
        {errorFooter}
      </ErrorPage>
    );
  }

  return (
    <Page
      title={title}
      onRefresh={safeRefetch}
      refreshing={query.isFetching ?? false}
      {...pageProps}
    >
      {children}
    </Page>
  );
};
