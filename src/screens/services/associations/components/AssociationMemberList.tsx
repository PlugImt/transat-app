import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAssociationMembers } from "@/hooks/services/association/useAssociation";
import type { BottomTabParamList } from "@/types";

export const AssociationMemberList = () => {
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<BottomTabParamList, "AssociationMemberList">>();
  const { id } = params;

  const { data, isPending, refetch, isError, error } = useAssociationMembers(id);

  if (isPending) {
    return <AssociationMemberListSkeleton />;
  }

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

  return (
    <Page
      title={t("services.associations.title")}
      onRefresh={refetch}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <Animated.FlatList
        data={data?.members}
        renderItem={({ item }) => (
            <UserCard
                user={{
                  email: item.email,
                  firstName: item.first_name,
                  lastName: item.last_name,
                  profilePicture: item.profile_picture,
                  ...item
                }}
            />
        )}
        keyExtractor={(item) => item.email}
      />
    </Page>
  );
};

export const AssociationMemberListSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Page title={t("services.associations.title")} className="gap-2" asChildren>
      <Animated.FlatList
        data={Array.from({ length: 10 })}
        renderItem={() => <UserCardSkeleton />}
      />
    </Page>
  );
};
