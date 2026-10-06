import { SearchX } from "lucide-react-native";
import { type ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Empty } from "@/components/page/Empty";
import { Page } from "@/components/page/Page";
import { WidgetErrorCard } from "@/components/query";
import type { ReservationCatalog } from "@/dto/reservation";
import { useAuth } from "@/hooks/account";
import { buildCatalogRows } from "@/utils/reservation.utils";
import { RowSkeleton } from "./CatalogCards";
import { CatalogRowView, catalogRowKey } from "./CatalogRowView";

interface CatalogListProps {
  title: string;
  catalog?: ReservationCatalog;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
  isSearching?: boolean;
  header?: ReactElement;
}

/** Page listing categories and items, with its loading, error and empty states. */
export const CatalogList = ({
  title,
  catalog,
  isPending,
  isError,
  error,
  refetch,
  isSearching = false,
  header,
}: CatalogListProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const rows = catalog
    ? buildCatalogRows(catalog, { myEmail: user?.email })
    : [];

  const refresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderEmpty = () => {
    if (isPending) {
      return (
        <>
          {Array.from({ length: 5 }, (_, index) => (
            <RowSkeleton key={`catalog-skeleton-${index.toString()}`} />
          ))}
        </>
      );
    }

    if (isError) {
      return <WidgetErrorCard error={error} onRetry={refresh} />;
    }

    const emptyKey = isSearching ? "search" : "catalog";

    return (
      <Empty
        icon={<SearchX />}
        title={t(`services.reservation.empty.${emptyKey}.title`)}
        description={t(`services.reservation.empty.${emptyKey}.description`)}
      />
    );
  };

  return (
    <Page
      title={title}
      onRefresh={refresh}
      refreshing={refreshing}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={isPending || isError ? [] : rows}
        renderItem={({ item }) => <CatalogRowView row={item} />}
        keyExtractor={catalogRowKey}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </Page>
  );
};
