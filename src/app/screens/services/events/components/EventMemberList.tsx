import { type RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useEventMembers } from "@/hooks/services/event/useEvent";
import type { BottomTabParamList } from "@/types";

export const EventMemberList = () => {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<BottomTabParamList, "EventMemberList">>();
  const { id } = params;

  const { data, isPending, refetch, isError, error } = useEventMembers(id);

  if (isPending) {
    return <EventMemberListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={t("services.events.title")}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  return (
    <Page
      title={t("services.events.title")}
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

export const EventMemberListSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Page title={t("services.events.title")} className="gap-2" asChildren>
      <Animated.FlatList data={Array.from({ length: 10 })} renderItem={() => <UserCardSkeleton />} />
    </Page>
  );
};
