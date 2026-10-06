import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import SearchInput from "@/components/common/SearchInput";
import { CatalogList } from "@/components/reservation/CatalogList";
import { MyReservationsEntry } from "@/components/reservation/MyReservationsEntry";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import {
  useReservationCatalog,
  useReservationSearch,
} from "@/hooks/services/reservation";

export const Reservation = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const search = useDebouncedValue(query.trim(), 300);
  const isSearching = search.length > 0;

  const catalogQuery = useReservationCatalog();
  const searchQuery = useReservationSearch(search);
  const activeQuery = isSearching ? searchQuery : catalogQuery;

  return (
    <CatalogList
      title={t("services.reservation.title")}
      catalog={activeQuery.data}
      isPending={activeQuery.isPending}
      isError={activeQuery.isError}
      error={activeQuery.error}
      refetch={activeQuery.refetch}
      isSearching={isSearching}
      header={
        <View className="gap-3 mb-2">
          {/* The default flex-1 would collapse the input to no height in a column. */}
          <SearchInput
            className="w-full"
            value={query}
            onChange={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {!isSearching && <MyReservationsEntry />}
        </View>
      }
    />
  );
};

export default Reservation;
