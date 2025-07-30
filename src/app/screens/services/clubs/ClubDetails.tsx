import { type RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCard } from "@/components/custom";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useClubDetails } from "@/hooks/services/club/useClub";
import type { AppStackParamList } from "@/types/navigation";
import { ClubDetailsHeader } from "./components/ClubDetailsHeader";

export type ClubDetailsRouteProp = RouteProp<AppStackParamList, "ClubDetails">;

const ClubDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<ClubDetailsRouteProp>();
  const { id } = route.params;

  const { data: club, isPending, isError, error, refetch } = useClubDetails(id);

  if (isError || !club) {
    return (
      <ErrorPage
        error={error}
        title={t("services.clubs.title")}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  if (!club) {
    return <Empty title={t("services.clubs.errors.empty")} />;
  }

  return (
    <Page
      title={t("services.clubs.title")}
      refreshing={isPending}
      onRefresh={refetch}
    >
      <ClubDetailsHeader
        title={club.name}
        description={club.description}
        member_photos={club.member_photos}
        member_count={club.member_count}
        location={club.location}
        link={club.link}
      />
      {club.responsible && (
        <CardGroup title={t("services.clubs.responsible")}>
          <UserCard user={club.responsible} />
        </CardGroup>
      )}
    </Page>
  );
};

export default ClubDetails;
