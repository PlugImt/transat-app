import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

export const BassineLeaderboard = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("games.bassine.leaderboard")}>
      <View>
        <Text>Bassine Leaderboard</Text>
      </View>
    </Page>
  );
};

export default BassineLeaderboard;
