import { SearchX } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import ClubCard from "@/components/custom/card/ClubCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { useClubs } from "@/hooks/services/club/useClub";
import { SearchClub } from "./components";

export const Clubs = () => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();

  const { data: clubs, isPending, refetch, isError, error } = useClubs();

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
      asChildren
    >
      <Animated.FlatList
        data={clubs}
        renderItem={({ item }) => <ClubCard club={item} />}
        keyExtractor={(item) => String(item.id)}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator
        ListHeaderComponent={
          <View className="flex-row items-center gap-2">
            <SearchClub />
            <Button label="Réserver" variant="secondary" onPress={() => {}} />
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
