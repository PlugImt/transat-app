import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants/queryKeys";
import BassineHistory from "./BassineHistory";
import BassineScores from "./BassineScores";

export const BassineLeaderboard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const isRefetching =
    queryClient.isFetching({
      queryKey: [QUERY_KEYS.bassine.leaderboard, QUERY_KEYS.bassine.history],
    }) > 0;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bassine.leaderboard,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bassine.history,
      }),
    ]);
  };

  return (
    <Page
      title={t("games.bassine.leaderboard.title")}
      onRefresh={refetch}
      refreshing={isRefetching}
    >
      <Tabs defaultValue="scores">
        <TabsList className="mt-4">
          <TabsTrigger
            value="scores"
            title={t("games.bassine.leaderboard.score")}
          />
          <TabsTrigger
            value="history"
            title={t("games.bassine.leaderboard.history.title")}
          />
        </TabsList>
        <TabsContent value="scores">
          <BassineScores />
        </TabsContent>
        <TabsContent value="history">
          <BassineHistory />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default BassineLeaderboard;
