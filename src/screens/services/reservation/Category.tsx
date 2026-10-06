import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { CatalogList } from "@/components/reservation/CatalogList";
import { useReservationCatalog } from "@/hooks/services/reservation";
import type { BottomTabParamList } from "@/types";

type CategoryRouteProp = RouteProp<BottomTabParamList, "ReservationCategory">;

export const Category = () => {
  const { id, title } = useRoute<CategoryRouteProp>().params;
  const { data, isPending, isError, error, refetch } = useReservationCatalog({
    categoryId: id,
  });

  return (
    <CatalogList
      title={title}
      catalog={data}
      isPending={isPending}
      isError={isError}
      error={error}
      refetch={refetch}
    />
  );
};
