import { useLocalSearchParams } from "expo-router";
import { ReservationPageContainer } from "@/components/reservation";
import { useReservationCategory } from "@/hooks/services/reservation";
import { parseNumberParam, parseStringParam } from "@/utils/search-params.utils";

export const Category = () => {
  const { id: idParam, title: titleParam } = useLocalSearchParams<{
    id: string;
    title: string;
  }>();
  const id = parseNumberParam(idParam) ?? 0;
  const title = parseStringParam(titleParam) ?? "";
  const categoryQuery = useReservationCategory(id);

  return <ReservationPageContainer title={title} {...categoryQuery} />;
};
