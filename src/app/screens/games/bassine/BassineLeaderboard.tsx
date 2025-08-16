import { ActivityIndicator, FlatList, SectionList, View } from "react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { Page } from "@/components/page/Page";
import { Text } from "@/components/common/Text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/Tabs";
import Card from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { useBassineHistory, useBassineLeaderboard } from "@/hooks/services/bassine/useBassine";
import type { BassineLeaderboardEntry } from "@/dto";

const LeaderboardRow = ({ item }: { item: BassineLeaderboardEntry }) => {
  const { theme } = useTheme();
  const rankBadge = (rank: number) => {
    if (rank === 1) return "🏆";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return String(rank);
  };

  return (
    <Card className="mb-2">
      <View className="flex-row items-center gap-3">
        <Text className="w-8 text-center font-bold text-lg">{rankBadge(item.rank)}</Text>
        <Avatar user={{
          first_name: item.first_name,
          last_name: item.last_name,
          phone_number: "",
          email: item.email,
          profile_picture: item.profile_picture ?? undefined,
        }} size={40} />
        <View className="flex-1">
          <Text className="font-semibold" numberOfLines={1}>{item.first_name} {item.last_name}</Text>
        </View>
        <View style={{ backgroundColor: theme.card }} className="px-2 py-1 rounded-md">
          <Text className="font-semibold">{item.bassine_count}</Text>
        </View>
      </View>
    </Card>
  );
};

type BassineHistoryGroup = {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  dates: string[];
};

type HistoryHourEntry = {
  key: string; // unique key per entry
  dayKey: string; // YYYY-MM-DD
  timeISO: string; // representative time
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  count: number; // number within the hour
};

const formatHHmm = (iso: string) => {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const HistoryRow = ({ item }: { item: HistoryHourEntry }) => {
  return (
    <Card className="mb-2">
      <View className="flex-row items-center gap-3">
        <Avatar user={{
          first_name: item.first_name,
          last_name: item.last_name,
          phone_number: "",
          email: item.email,
          profile_picture: item.profile_picture ?? undefined,
        }} size={40} />
        <View className="flex-1">
          <Text className="font-semibold" numberOfLines={1}>{item.first_name} {item.last_name}</Text>
          <Text color="muted" variant="sm">{formatHHmm(item.timeISO)}</Text>
        </View>
        <Text className="text-green-500 font-bold">+{item.count}</Text>
      </View>
    </Card>
  );
};

const BassineLeaderboard = () => {
  const { t } = useTranslation();
  const { data: leaderboard, isPending: lbPending, refetch: refetchLb } = useBassineLeaderboard();
  const { data: history, isPending: histPending, refetch: refetchHist } = useBassineHistory();


  const sections = useMemo(() => {
    const map = new Map<string, HistoryHourEntry[]>(); // dayKey -> entries

    const groups = (history as unknown as BassineHistoryGroup[] | undefined) ?? [];
    for (const g of groups) {
      const sortedDates = [...(g.dates ?? [])].sort();
      for (const iso of sortedDates) {
        const d = new Date(iso);
        const dayKey = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
        const hourKey = `${dayKey}-${d.getHours().toString().padStart(2, "0")}-${g.email}`;

        const arr = map.get(dayKey) ?? [];
        const existing = arr.find((e) => e.key === hourKey);
        if (existing) {
          existing.count += 1;
        } else {
          arr.push({
            key: hourKey,
            dayKey,
            timeISO: iso,
            email: g.email,
            first_name: g.first_name,
            last_name: g.last_name,
            profile_picture: g.profile_picture,
            count: 1,
          });
        }
        map.set(dayKey, arr);
      }
    }

    // Build sections sorted by day desc, and items sorted by time desc
    const dayKeys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1));
    return dayKeys.map((dayKey) => {
      const items = (map.get(dayKey) ?? []).sort(
        (a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime(),
      );
      const headerDate = new Date(dayKey);
      const title = headerDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return { title, data: items };
    });
  }, [history]);

  return (
    <Page
      title={t("games.bassine.leaderboard")}
      disableScroll
    >
      <Tabs defaultValue="leaderboard">
        <TabsList>
          <TabsTrigger value="leaderboard" title={t("games.bassine.leaderboard")} />
          <TabsTrigger value="history" title={t("games.bassine.history")} />
        </TabsList>

        <TabsContent value="leaderboard" className="mt-2">
          {lbPending ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={Array.isArray(leaderboard)
                ? (leaderboard as BassineLeaderboardEntry[])
                : ((((leaderboard as unknown) as { users?: BassineLeaderboardEntry[] })?.users) ?? [])}
              keyExtractor={(item, idx) => `${item.email}-${item.rank}-${idx}`}
              renderItem={({ item }) => <LeaderboardRow item={item} />}
              refreshing={lbPending}
              onRefresh={() => {
                void refetchLb();
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-2">
          {histPending ? (
            <ActivityIndicator size="large" />
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => <HistoryRow item={item} />}
              renderSectionHeader={({ section: { title } }) => (
                <Text className="mt-4 mb-2 font-bold">{title}</Text>
              )}
              refreshing={histPending}
              onRefresh={() => {
                void refetchHist();
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default BassineLeaderboard;
