import { ActivityIndicator, FlatList, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { Page } from "@/components/page/Page";
import { Text } from "@/components/common/Text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/Tabs";
import Card from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { useBassineHistory, useBassineLeaderboard } from "@/hooks/services/bassine/useBassine";
import type { BassineLeaderboardEntry } from "@/dto";
import { getTimeAgo } from "@/utils/date.utils";

const LeaderboardRow = ({ item }: { item: BassineLeaderboardEntry }) => {
  const { theme } = useTheme();
  return (
    <Card className="mb-2">
      <View className="flex-row items-center gap-3">
        <Text className="w-8 text-center font-bold">#{item.rank}</Text>
        <Avatar user={{
          first_name: item.first_name,
          last_name: item.last_name,
          phone_number: "",
          email: item.email,
          profile_picture: item.profile_picture ?? undefined,
        }} size={40} />
        <View className="flex-1">
          <Text className="font-semibold" numberOfLines={1}>{item.first_name} {item.last_name}</Text>
          <Text color="muted" variant="sm">{item.bassine_count} pts</Text>
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

const HistoryRow = ({ item }: { item: BassineHistoryGroup }) => {
  const { t } = useTranslation();
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
          <Text color="muted" variant="sm">{getTimeAgo(item.dates[item.dates.length - 1] ?? "", t)}</Text>
        </View>
        <Text className="text-green-500 font-bold">
          +{item.dates.length}
        </Text>
      </View>
    </Card>
  );
};

const BassineLeaderboard = () => {
  const { t } = useTranslation();
  const { data: leaderboard, isPending: lbPending, refetch: refetchLb } = useBassineLeaderboard();
  const { data: history, isPending: histPending, refetch: refetchHist } = useBassineHistory();


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
            <FlatList
              data={(history as unknown as BassineHistoryGroup[] | undefined) ?? []}
              keyExtractor={(item, idx) => `${item.email}-${idx}`}
              renderItem={({ item }) => <HistoryRow item={item} />}
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
