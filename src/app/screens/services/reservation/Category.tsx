import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { ReservationPageContainer } from "@/components/reservation";
import { useReservationCategory } from "@/hooks/services/reservation";
import type { BottomTabParamList } from "@/types";

type CategoryRouteProp = RouteProp<BottomTabParamList, "ReservationCategory">;

export const Category = () => {
  const route = useRoute<CategoryRouteProp>();
  const { id, title } = route.params;
  const categoryQuery = useReservationCategory(id);

  return <ReservationPageContainer title={title} {...categoryQuery} />;
};
