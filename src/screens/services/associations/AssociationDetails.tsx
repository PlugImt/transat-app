import { useQueryClient } from "@tanstack/react-query";
import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCardSkeleton } from "@/components/custom";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants";
import { useAssociationDetails } from "@/hooks/services/association/useAssociation";
import { AssociationEventWidget } from "@/screens/services/events/widget/AssociationEventWidget";
import type { BottomTabParamList } from "@/types/navigation";
import { AssociationReservationWidget } from "@/screens/services/reservation/widget/AssociationReservationWidget";
import {
  AssociationDetailsHeader,
  AssociationDetailsHeaderSkeleton,
} from "./components/AssociationDetailsHeader";
import { AssociationResponsible } from "./components/AssociationResponsible";

export type AssociationDetailsRouteProp = RouteProp<BottomTabParamList, "AssociationDetails">;

const AssociationDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<AssociationDetailsRouteProp>();
  const { id } = route.params;

  const {
    data: association,
    isPending,
    isError,
    error,
    refetch: refetchAssociation,
  } = useAssociationDetails(id);

  const queryClient = useQueryClient();

  const refetch = async () => {
    await refetchAssociation();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.association(id),
      }),
    ]);
  };

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={t("services.associations.title")}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  if (isPending) {
    return <AssociationDetailsSkeleton />;
  }

  if (!association) {
    return (
      <Page
        title={t("services.associations.title")}
        refreshing={isPending}
        onRefresh={refetch}
      >
        <Empty
          title={t("services.associations.errors.notFound")}
          description={t("services.associations.errors.notFoundDescription")}
        />
      </Page>
    );
  }

  return (
    <Page
      title={t("services.associations.title")}
      refreshing={isPending}
      onRefresh={refetch}
    >
      <AssociationDetailsHeader association={association} />
      <AssociationResponsible responsible={association.responsible} />
      <AssociationReservationWidget associationId={association.id} />
      <AssociationEventWidget associationId={association.id} />
    </Page>
  );
};

export default AssociationDetails;

export const AssociationDetailsSkeleton = () => {
  const { t } = useTranslation();
  const route = useRoute<AssociationDetailsRouteProp>();
  const { id } = route.params;

  return (
    <Page title={t("services.associations.title")}>
      <AssociationDetailsHeaderSkeleton />
      <CardGroup title={t("services.associations.responsible")}>
        <UserCardSkeleton />
      </CardGroup>
      <AssociationReservationWidget associationId={id} />
      <AssociationEventWidget associationId={id} />
    </Page>
  );
};
