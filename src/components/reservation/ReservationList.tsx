import { SearchX } from "lucide-react-native";
import type { ComponentType, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import ReservationCard from "@/components/custom/card/ReservationCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useReservationDisplayData } from "@/hooks/services/reservation/useReservationData";
import type { ReservationListResponse } from "@/types/reservation.types";
import { ReservationSkeleton } from "./ReservationSkeleton";

interface ReservationListProps {
  title: string;
  data: ReservationListResponse | ReservationListResponse[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  refetch?: () => void;
  headerComponent?: ReactElement | ComponentType<object> | null;
  variant?: "page" | "embed";
  showScrollIndicators?: boolean;
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
}: ReservationListProps) => {
  const { t } = useTranslation();
  const displayData = useReservationDisplayData(data);
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
      data={displayData}
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
      // biome-ignore lint/suspicious/noExplicitAny: HeaderComponent type is complex
      ListHeaderComponent={headerComponent as any}
      ListEmptyComponent={
        isPending ? null : (
          <Empty
            icon={<SearchX />}
            title={t("services.reservation.errors.empty")}
            description={t("services.reservation.errors.emptyDescription")}
          />
        )
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

export const ReservationPageContainer = (props: ReservationListProps) => (
  <ReservationList {...props} variant="page" />
);

export const ReservationListOnly = (props: ReservationListProps) => (
  <ReservationList {...props} variant="embed" />
);
