import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useClubMembers } from "@/hooks/services/club/useClub";
import type { BottomTabParamList } from "@/types";

export const ClubMemberList = () => {
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<BottomTabParamList, "ClubMemberList">>();
  const { id } = params;

  const { data, isPending, isFetching, refetch, isError, error } =
    useClubMembers(id);

  if (isPending) {
    return <ClubMemberListSkeleton />;
  }

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

  return (
    <Page
      title={t("services.clubs.title")}
      onRefresh={refetch}
      refreshing={isFetching}
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
