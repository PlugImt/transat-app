import { useLocalSearchParams } from "expo-router";
import { CatalogList } from "@/components/reservation/CatalogList";
import { useReservationCatalog } from "@/hooks/services/reservation";
import { paramNumber, paramString } from "@/navigation/params";

export const Category = () => {
  const params = useLocalSearchParams<{ id: string; title?: string }>();
  const id = paramNumber(params.id);
  const title = paramString(params.title);
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
