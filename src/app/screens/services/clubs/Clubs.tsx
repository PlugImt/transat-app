import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { SearchX } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import ClubCard, { ClubCardSkeleton } from "@/components/custom/card/ClubCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useFilteredClubs } from "@/hooks/services/club/useClub";
import type { AppStackParamList } from "@/types/navigation";
import Search from '@/components/common/Search';

export const Clubs = () => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const [searchValue, setSearchValue] = useState("");
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const {
    data: clubs,
    isPending,
    refetch,
    isError,
    error,
  } = useFilteredClubs(searchValue);

  if (isPending) {
    return <ClubsSkeleton />;
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
        data={clubs}
        renderItem={({ item }) => <ClubCard club={item} />}
        keyExtractor={(item) => String(item.id)}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
        ListHeaderComponent={
          <View className="flex-row items-center gap-2 mb-3">
            <Search value={searchValue} onChange={setSearchValue} />
            <Button
              label={t("services.reservation.title")}
              variant="secondary"
              onPress={() => navigation.navigate("Reservation")}
            />
          </View>
        }
        ListEmptyComponent={
          <Empty
            icon={<SearchX />}
            title={t("services.clubs.errors.empty")}
            description={t("services.clubs.errors.emptyDescription")}
          />
        }
      />
    </Page>
  );
};

export default Clubs;

const ClubsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("services.clubs.title")} className="gap-2">
      <View className="flex-row items-center gap-2 mb-3">
        <Search value={""} onChange={() => {}} disabled />
        <Button label="Réserver" variant="secondary" onPress={() => {}} />
      </View>
      {Array.from({ length: 5 }).map((_, index) => (
        <ClubCardSkeleton key={`club-loading-${index.toString()}`} />
      ))}
    </Page>
  );
};
