import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Search from "@/components/common/Search";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import { useStaleData } from "@/hooks/common/useStaleData";
import {
  useReservations,
  useSearchReservations,
} from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";
import { ReservationList } from "./components";

export const Reservation = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [query, setQuery] = useState("");
  const reservationQuery = useReservations();
  const debouncedQuery = useDebouncedValue(query, 300);
  const searchQuery = useSearchReservations(debouncedQuery);

  const rawData =
    debouncedQuery.length > 0
      ? (searchQuery.data as any)
      : (reservationQuery.data as any);
  const data = useStaleData(
    rawData,
    debouncedQuery.length > 0 && searchQuery.isPending,
  );
  const isPending = reservationQuery.isPending;
  const isError =
    debouncedQuery.length > 0 ? searchQuery.isError : reservationQuery.isError;
  const error = (
    debouncedQuery.length > 0 ? searchQuery.error : reservationQuery.error
  ) as Error | null;
  const refetch = async () => {
    await reservationQuery.refetch();
    if (query.length > 0) await searchQuery.refetch();
  };

  return (
    <ReservationList
      title={t("services.reservation.title")}
      data={data}
      isPending={isPending}
      isError={isError}
      error={error}
      refetch={refetch}
      headerComponent={
        <View className="flex-row items-center gap-2 mb-3">
          <Search value={query} onChange={setQuery} />
          <Button
            label={t("services.reservation.myReservations")}
            variant="secondary"
            onPress={() => navigation.navigate("MyReservations")}
          />
        </View>
      }
      variant="page"
    />
  );
};
