import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { ReservationPageContainer } from "@/components/reservation";
import { useReservationCategory } from "@/hooks/services/reservation";
import type { AppStackParamList } from "@/types";

type CategoryRouteProp = RouteProp<AppStackParamList, "ReservationCategory">;

export const Category = () => {
  const route = useRoute<CategoryRouteProp>();
  const { id, title } = route.params;
  const categoryQuery = useReservationCategory(id);

  return <ReservationPageContainer title={title} {...categoryQuery} />;
};
