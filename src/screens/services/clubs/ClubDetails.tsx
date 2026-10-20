import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCardSkeleton } from "@/components/custom";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { QUERY_KEYS } from "@/constants";
import { useClubDetails } from "@/hooks/services/club/useClub";
import { useRouteId } from "@/navigation/params";
import { ClubEventWidget } from "@/screens/services/events/widget/ClubEventWidget";
import { ClubReservationWidget } from "../reservation/widget/ClubReservationWidget";
import {
  ClubDetailsHeader,
  ClubDetailsHeaderSkeleton,
} from "./components/ClubDetailsHeader";
import { ClubResponsible } from "./components/ClubResponsible";

const ClubDetails = () => {
  const { t } = useTranslation();
  const id = useRouteId();

  const {
    data: club,
    isPending,
    isFetching,
    isError,
    error,
    refetch: refetchClub,
  } = useClubDetails(id);

  const queryClient = useQueryClient();

  const refetch = async () => {
    await refetchClub();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.catalog({ clubId: id }),
      }),
    ]);
  };

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={t("services.clubs.title")}
        refetch={refetch}
        isRefetching={getIsRefetching(isFetching, isPending)}
        refreshing={isFetching}
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
        refreshing={isFetching}
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
      refreshing={isPending}
      onRefresh={refetch}
    >
      <ClubDetailsHeader club={club} />
      <ClubResponsible
        responsibles={
          club.responsibles ??
          (club.responsible ? [club.responsible] : undefined)
        }
      />
      <ClubReservationWidget clubId={club.id} />
      <ClubEventWidget clubId={club.id} />
    </Page>
  );
};

export default ClubDetails;

export const ClubDetailsSkeleton = () => {
  const { t } = useTranslation();
  const id = useRouteId();

  return (
    <Page title={t("services.clubs.title")}>
      <ClubDetailsHeaderSkeleton />
      <CardGroup title={t("services.clubs.responsible")}>
        <UserCardSkeleton />
      </CardGroup>
      <ClubReservationWidget clubId={id} />
      <ClubEventWidget clubId={id} />
    </Page>
  );
};
