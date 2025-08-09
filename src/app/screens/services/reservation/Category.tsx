import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { SearchX } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import ReservationCard, {
  ReservationCardLoading,
} from "@/components/custom/card/ReservationCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationCategories } from "@/hooks/services/reservation/useReservation";
import type { AppStackParamList } from "@/types";

type CategoryRouteProp = RouteProp<AppStackParamList, "ReservationCategory">;

export const Category = () => {
  const route = useRoute<CategoryRouteProp>();
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const { id, title } = route.params;

  const {
    data: reservationData,
    isPending,
    refetch,
    isError,
    error,
  } = useReservationCategories(id);

  if (isPending) {
    return <CategorySkeleton title={title} />;
  }

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={title}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  const dataObj = Array.isArray(reservationData)
    ? reservationData[0]
    : reservationData;

  const combinedData = [
    ...(dataObj?.categories?.map((category: { id: number; name: string }) => ({
      ...category,
      type: "category" as const,
    })) || []),
    ...(dataObj?.items?.map(
      (item: { id: number; name: string; slot: boolean }) => ({
        ...item,
        type: "item" as const,
      }),
    ) || []),
  ];

  return (
    <Page
      title={title}
      onRefresh={refetch}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={combinedData}
        renderItem={({ item }) => (
          <ReservationCard
            title={item.name}
            type={item.type}
            id={item.id}
            slot={item.type === "item" ? item.slot : undefined}
          />
        )}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
        ListEmptyComponent={
          <Empty
            icon={<SearchX />}
            title={t("services.reservation.errors.empty")}
            description={t("services.reservation.errors.emptyDescription")}
          />
        }
      />
    </Page>
  );
};

const CategorySkeleton = ({ title }: { title: string }) => {
  return (
    <Page title={title} className="gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <ReservationCardLoading
          key={`reservation-loading-${index.toString()}`}
        />
      ))}
    </Page>
  );
};
