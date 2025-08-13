import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Search from "@/components/common/Search";
import { ReservationList } from "@/components/reservation";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import { useStaleData } from "@/hooks/common/useStaleData";
import {
  useReservationSearch,
  useReservations,
} from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";
import type { ReservationListResponse } from "@/types/reservation.types";

export const Reservation = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [query, setQuery] = useState("");

  const reservationQuery = useReservations();
  const debouncedQuery = useDebouncedValue(query, 300);
  const searchQuery = useReservationSearch(debouncedQuery);

  const isSearching = debouncedQuery.length > 0;
  const rawData = isSearching ? searchQuery.data : reservationQuery.data;
  const data = useStaleData(
    rawData as ReservationListResponse,
    isSearching && searchQuery.isPending,
  );

  const isPending = reservationQuery.isPending;
  const isError = isSearching ? searchQuery.isError : reservationQuery.isError;
  const error = (
    isSearching ? searchQuery.error : reservationQuery.error
  ) as Error | null;

  const refetch = async () => {
    await reservationQuery.refetch();
    if (query.length > 0) await searchQuery.refetch();
  };

  const headerComponent = (
    <View className="gap-4 px-4 mb-4">
      <Search
        placeholder={t("services.reservation.searchPlaceholder")}
        onChangeText={setQuery}
        value={query}
        onChange={setQuery}
      />
      <Button
        label={t("services.reservation.myReservations")}
        variant="secondary"
        // @ts-ignore
        onPress={() => navigation.navigate("MyReservations")}
      />
    </View>
  );

  return (
    <ReservationList
      title={t("services.reservation.title")}
      data={data}
      isPending={isPending}
      isError={isError}
      error={error}
      refetch={refetch}
      headerComponent={headerComponent}
      variant="page"
    />
  );
};
