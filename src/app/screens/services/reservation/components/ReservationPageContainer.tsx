import { ReactNode } from "react";
import { SearchX } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import ReservationCard from "@/components/custom/card/ReservationCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import type { GetReservation } from "@/dto/reservation";
import { useReservationData } from "@/hooks/services/reservation/useReservationData";
import { ReservationSkeleton } from "./ReservationSkeleton";

interface ReservationPageContainerProps {
  title: string;
  data: GetReservation[] | GetReservation | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  headerComponent?: ReactNode;
}

export const ReservationPageContainer = ({
  title,
  data,
  isPending,
  isError,
  error,
  refetch,
  headerComponent,
}: ReservationPageContainerProps) => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const combinedData = useReservationData(data);

  if (isPending) {
    return <ReservationSkeleton title={title} />;
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
        ListHeaderComponent={headerComponent}
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
