import { type RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCardSkeleton } from "@/components/custom";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useClubDetails } from "@/hooks/services/club/useClub";
import type { AppStackParamList } from "@/types/navigation";
import {
  ClubDetailsHeader,
  ClubDetailsHeaderSkeleton,
} from "./components/ClubDetailsHeader";
import { ClubResponsible } from "./components/ClubResponsible";

export type ClubDetailsRouteProp = RouteProp<AppStackParamList, "ClubDetails">;

const ClubDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<ClubDetailsRouteProp>();
  const { id } = route.params;

  const { data: club, isPending, isError, error, refetch } = useClubDetails(id);

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
      refreshing={isPending}
      onRefresh={refetch}
    >
      <ClubDetailsHeader club={club} />
      <ClubResponsible club={club} />
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
    </Page>
  );
};
