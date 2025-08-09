import { type RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useClubMembers } from "@/hooks/services/club/useClub";
import type { AppStackParamList } from "@/types";

export const ClubMemberList = () => {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<AppStackParamList, "ClubMemberList">>();
  const { id } = params;

  const { data, isPending, refetch, isError, error } = useClubMembers(id);

  if (isPending) {
    return <ClubMemberListSkeleton />;
  }

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

  return (
    <Page
      title={t("services.clubs.title")}
      onRefresh={refetch}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={data?.members}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={(item) => item.email}
      />
    </Page>
  );
};

export const ClubMemberListSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Page title={t("services.clubs.title")} className="gap-2" asChildren>
      <Animated.FlatList
        data={Array.from({ length: 10 })}
        renderItem={() => <UserCardSkeleton />}
      />
    </Page>
  );
};
