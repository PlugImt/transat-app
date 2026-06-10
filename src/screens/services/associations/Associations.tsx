import { SearchX } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import Search from "@/components/common/SearchInput";
import AssociationCard, { AssociationCardSkeleton } from "@/components/custom/card/AssociationCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useFilteredAssociations } from "@/hooks/services/association/useAssociation";

export const Associations = () => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const [searchValue, setSearchValue] = useState("");

  const {
    data: associations,
    isPending,
    refetch,
    isError,
    error,
  } = useFilteredAssociations(searchValue);

  if (isPending) {
    return <AssociationsSkeleton />;
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
        data={associations}
        renderItem={({ item }) => <AssociationCard association={item} />}
        keyExtractor={(item) => String(item.id)}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
        ListHeaderComponent={
          <View className="flex-row mb-4">
            <Search value={searchValue} onChange={setSearchValue} />
          </View>
        }
        ListEmptyComponent={
          <Empty
            icon={<SearchX />}
            title={t("services.associations.errors.empty")}
            description={t("services.associations.errors.emptyDescription")}
          />
        }
      />
    </Page>
  );
};

export default Associations;

const AssociationsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("services.associations.title")} className="gap-2">
      <View className="mb-4">
        <Search value={""} onChange={() => {}} disabled />
      </View>
      {Array.from({ length: 5 }).map((_, index) => (
        <AssociationCardSkeleton key={`association-loading-${index.toString()}`} />
      ))}
    </Page>
  );
};
