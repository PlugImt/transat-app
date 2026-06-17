import React, { useState } from "react";
import { SearchX, Plus, SlidersHorizontal } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View, RefreshControl, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { useNavigation } from "expo-router/react-navigation";
import Search from "@/components/common/SearchInput";
import { IconButton } from "@/components/common/Button";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { HEADER_HEIGHT } from "@/components/page/Header";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useCovoiturage } from "@/hooks/services/covoiturage/useCovoiturage";
import { CovoiturageCard, CovoiturageCardSkeleton } from "./components/CovoiturageCard";
import { CovoiturageFiltersModal } from "./components/CovoiturageFiltersModal";
import type { Covoiturage } from "@/dto";

type DateFilterType = Date | null;

export const Covoiturages = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  
  const [searchValue, setSearchValue] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);

  const { data: covoiturages, isPending, refetch, isError, error } = useCovoiturage();

  if (isPending) return <CovoituragesSkeleton />;
  if (isError) return <ErrorPage error={error} title={t("services.covoit.title")} refetch={refetch} isRefetching={isPending} />;

  const isFilteringActive = selectedCategories.length > 0 || dateFilter !== null;

  const filteredCovoiturages = (covoiturages || []).filter((covoit) => {
    if (covoit.status !== "OPEN") return false;

    const searchLower = searchValue.toLowerCase().trim();
    if (searchLower) {
      const departure = covoit.departure_place?.toLowerCase() || "";
      const destination = covoit.destination?.toLowerCase() || "";
      const driver = `${covoit.creator?.first_name} ${covoit.creator?.last_name}`.toLowerCase();
      if (!departure.includes(searchLower) && !destination.includes(searchLower) && !driver.includes(searchLower)) return false;
    }

    if (selectedCategories.length > 0) {
      const type = covoit.trip_type;

      const matchShopping = selectedCategories.includes("SHOPPING") && type === "SHOPPING";
      const matchOther = selectedCategories.includes("OTHER") && type === "OTHER";
      const matchLongTrip = selectedCategories.includes("LONG_TRIP") && type === "LONG_TRIP";

      if (!matchShopping && !matchOther && !matchLongTrip) return false;
    }

    if (dateFilter instanceof Date) {
      if (new Date(covoit.departure_time).toDateString() !== dateFilter.toDateString()) return false;
    }

    return true;
  });

  return (
    <Page
      title={t("services.covoit.title")}
      className="gap-4 flex-1"
      style={{ paddingBottom: 0 }}
      disableScroll
      header={<IconButton icon={<Plus color={theme.primary} />} variant="link" onPress={() => navigation.navigate("AddEvent")} />}
    >
      <Animated.FlatList
        data={filteredCovoiturages}
        renderItem={({ item }: { item: Covoiturage }) => <CovoiturageCard covoiturage={item} />}
        keyExtractor={(item: Covoiturage) => String(item.id)}
        contentContainerClassName="gap-2"
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isPending}
        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor={theme.text} colors={[theme.primary]} progressViewOffset={HEADER_HEIGHT} />}
        ListHeaderComponent={
          <View className="mb-4 flex-row items-center gap-3">
            <View className="flex-1 h-[52px]">
              <Search value={searchValue} onChange={setSearchValue} />
            </View>
            
            <Pressable
              onPress={() => setIsPanelOpen(true)}
              className="rounded-2xl items-center justify-center h-[52px] w-[52px]"
            >
              <SlidersHorizontal color={isFilteringActive ? theme.primary : theme.text} size={20} />
              {isFilteringActive && <View className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: theme.primary }} />}
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <Empty 
            icon={<SearchX />} 
            title={t("services.covoit.errors.empty")} 
          />
        }
      />

      <CovoiturageFiltersModal
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        selectedCategories={selectedCategories} 
        onSelectCategories={setSelectedCategories} 
        dateFilter={dateFilter}
        onChangeDateFilter={setDateFilter}
        t={t}
      />
    </Page>
  );
};

export default Covoiturages;

const CovoituragesSkeleton = () => (
  <Page title={""} className="gap-2 flex-1" disableScroll>
    <View className="mb-4 flex-row items-center gap-3">
      <View className="flex-1 h-[52px]"><Search value={""} onChange={() => {}} disabled /></View>
      <View className="w-[52px] h-[52px] rounded-2xl bg-muted/20" />
    </View>
    <Animated.FlatList data={Array.from({ length: 6 })} renderItem={() => <CovoiturageCardSkeleton />} contentContainerClassName="gap-2" showsVerticalScrollIndicator={false} />
  </Page>
);