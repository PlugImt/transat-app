import { useTranslation } from "react-i18next";
import { Empty } from "@/components/page/Empty";
import { useCovoiturage } from "@/hooks/services/covoiturage/useCovoiturage";
import { CovoiturageCard } from "./components/CovoiturageCard";
import { useTheme } from "@/contexts/ThemeContext";
import { Covoiturage } from "@/dto/covoiturage";
import { HEADER_HEIGHT } from "@/components/page/Header";

export const CovoiturageContent = () => {
  const { t } = useTranslation();
  const { data: covoiturages, isPending, isError, error, refetch } =
      useCovoiturage();
  const { theme } = useTheme();
  
  const flatListProps = {
    renderItem: ({ item }: { item: Covoiturage }) => <CovoiturageCard covoiturage={item} />,
    keyExtractor: (item: Covoiturage) => String(item.id),
    contentContainerClassName: "gap-2",
    showsVerticalScrollIndicator: false,
    onRefresh: () => refetch(),
    refreshing: isPending,
    refreshControl: (
      <RefreshControl
        refreshing={isPending}
        onRefresh={refetch}
        tintColor={theme.text}
        colors={[theme.primary]}
        progressViewOffset={HEADER_HEIGHT}
      />
    ),
    ListHeaderComponent: (
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming" title={t("services.covoiturages.upcoming")} />
        <TabsTrigger value="past" title={t("services.covoiturages.past")} />
      </TabsList>
    ),
  };

  const getEmptyComponent = () => {
    if (tabValue === "upcoming") {
      return (
        <Empty
          icon={<PartyPopper />}
          title={t("services.covoiturages.errors.emptyUpcoming")}
          description={t("services.covoiturages.errors.emptyUpcomingDescription")}
        />
      );
    }
    return (
      <Empty
        icon={<PartyPopper />}
        title={t("services.covoiturages.errors.emptyPast")}
        description={t("services.covoiturages.errors.emptyPastDescription")}
      />
    );
  };

  return (
    <Animated.FlatList
      {...flatListProps}
      data={covoiturages || []}
      ListEmptyComponent={getEmptyComponent()}
    />
  );
};

export default Covoiturage;
