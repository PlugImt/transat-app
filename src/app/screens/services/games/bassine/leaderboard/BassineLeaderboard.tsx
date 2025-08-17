import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Page } from "@/components/page/Page";
import BassineScores from "./BassineScores";

export const BassineLeaderboard = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("games.bassine.leaderboard.title")}>
      <Tabs defaultValue="scores">
        <TabsList className="mt-4">
          <TabsTrigger
            value="scores"
            title={t("games.bassine.leaderboard.score")}
          />
          <TabsTrigger
            value="history"
            title={t("games.bassine.leaderboard.history")}
          />
        </TabsList>
        <TabsContent value="scores">
          <BassineScores />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default BassineLeaderboard;
