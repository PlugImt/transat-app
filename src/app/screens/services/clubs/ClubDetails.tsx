import { type RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ClubEventWidgetSkeleton } from "@/app/screens/services/events/widget/ClubEventWidget";
import CardGroup from "@/components/common/CardGroup";
import { UserCardSkeleton } from "@/components/custom";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useClubDetails } from "@/hooks/services/club/useClub";
import { useClubReservations } from "@/hooks/services/reservation/useReservation";
import type { BottomTabParamList } from "@/types/navigation";
import {
  ClubDetailsHeader,
  ClubDetailsHeaderSkeleton,
} from "./components/ClubDetailsHeader";
import { ClubReservations } from "./components/ClubReservations";
import { ClubResponsible } from "./components/ClubResponsible";

export type ClubDetailsRouteProp = RouteProp<BottomTabParamList, "ClubDetails">;

const ClubDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<ClubDetailsRouteProp>();
  const { id } = route.params;

  const { data: club, isPending, isError, error, refetch } = useClubDetails(id);
  const {
    data: clubReservations,
    isPending: isClubReservationsPending,
    isError: isClubReservationsError,
    error: clubReservationsError,
    refetch: refetchClubReservations,
  } = useClubReservations(id);

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={t("services.clubs.title")}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  if (isPending) {
    return <ClubDetailsSkeleton />;
  }

  if (!club) {
    return (
      <Page
        title={t("services.clubs.title")}
        refreshing={isPending}
        onRefresh={refetch}
      >
        <Empty
          title={t("services.clubs.errors.notFound")}
          description={t("services.clubs.errors.notFoundDescription")}
        />
      </Page>
    );
  }

  return (
    <Page
      title={t("services.clubs.title")}
      refreshing={isPending || isClubReservationsPending}
      onRefresh={() => {
        refetch().then((r) => r);
        refetchClubReservations().then((r) => r);
      }}
    >
      <ClubDetailsHeader club={club} />
      <ClubResponsible club={club} />
      <ClubReservations
        data={clubReservations}
        isPending={isClubReservationsPending}
        isError={isClubReservationsError}
        error={clubReservationsError as Error | null}
      />
    </Page>
  );
};

export default ClubDetails;

export const ClubDetailsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Page title={t("services.clubs.title")}>
      <ClubDetailsHeaderSkeleton />
      <CardGroup title={t("services.clubs.responsible")}>
        <UserCardSkeleton />
      </CardGroup>
      <ClubEventWidgetSkeleton />
    </Page>
  );
};
