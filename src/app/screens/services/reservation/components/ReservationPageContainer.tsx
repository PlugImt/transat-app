import { SearchX } from "lucide-react-native";
import type { ComponentType, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import ReservationCard from "@/components/custom/card/ReservationCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import type { GetReservation } from "@/dto/reservation";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationData } from "@/hooks/services/reservation/useReservationData";
import { ReservationSkeleton } from "./ReservationSkeleton";

interface ReservationCommonProps {
  title: string;
  data: GetReservation[] | GetReservation | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  headerComponent?: ReactElement | ComponentType<object> | null;
  variant?: "page" | "embed";
  showScrollIndicators?: boolean;
}

interface ReservationPageContainerProps extends ReservationCommonProps {
  refetch?: () => void;
}

export const ReservationList = ({
  title,
  data,
  isPending,
  isError,
  error,
  refetch,
  headerComponent,
  variant = "page",
  showScrollIndicators = true,
}: ReservationPageContainerProps) => {
  const { t } = useTranslation();
  const combinedData = useReservationData(data);
  const { scrollHandler } = useAnimatedHeader();

  if (isPending) {
    return variant === "page" ? <ReservationSkeleton title={title} /> : null;
  }

  if (isError) {
    if (variant === "page") {
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
      <Empty
        icon={<SearchX />}
        title={title}
        description={error?.message || t("common.errors.unableToFetch")}
      />
    );
  }

  const content = (
    <Animated.FlatList
      data={combinedData}
      renderItem={({ item }) => (
        <ReservationCard
          title={item.name}
          type={item.type}
          id={item.id}
          slot={item.type === "item" ? item.slot : undefined}
          user={item.user}
        />
      )}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      onScroll={variant === "page" ? scrollHandler : undefined}
      showsVerticalScrollIndicator={showScrollIndicators}
      // biome-ignore lint/suspicious/noExplicitAny: a être mieux handled
      ListHeaderComponent={headerComponent as any}
      ListEmptyComponent={
        <Empty
          icon={<SearchX />}
          title={t("services.reservation.errors.empty")}
          description={t("services.reservation.errors.emptyDescription")}
        />
      }
    />
  );

  if (variant === "page") {
    return (
      <Page
        title={title}
        onRefresh={refetch}
        refreshing={isPending}
        className="gap-2"
        asChildren
      >
        {content}
      </Page>
    );
  }

  return content;
};

export const ReservationPageContainer = (
  props: ReservationPageContainerProps,
) => <ReservationList {...props} variant="page" />;

export const ReservationListOnly = (props: ReservationCommonProps) => (
  <ReservationList {...props} variant="embed" />
);
