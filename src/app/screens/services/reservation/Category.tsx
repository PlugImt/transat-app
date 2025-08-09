import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useReservationCategories } from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";
import { ReservationPageContainer } from "./components";

type CategoryRouteProp = RouteProp<AppStackParamList, "ReservationCategory">;

export const Category = () => {
  const route = useRoute<CategoryRouteProp>();
  const { id, title } = route.params;
  const categoryQuery = useReservationCategories(id);

  return <ReservationPageContainer title={title} {...categoryQuery} />;
};
