import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import BassineButtonIncrement from "@/app/screens/games/bassine/component/BassineButtonIncrement";
import BassineButtonLeaderboard from "@/app/screens/games/bassine/component/BassineButtonLeaderboard";
import EncouragementMessage from "@/app/screens/games/bassine/component/EncouragementMessage";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useBassineOverview } from "@/hooks/services/bassine/useBassine";

export const Bassine = () => {
  const { t } = useTranslation();
  const { data, isPending, refetch, error, isError } = useBassineOverview();

  const leaderboardPhotos =
    data?.leaderboard?.map(
      (item: { profile_picture: string }) => item.profile_picture,
    ) || [];

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      title={t("games.bassine.title")}
      className="flex-1"
      footer={<BassineButtonLeaderboard photos={leaderboardPhotos} />}
    >
      <View className="flex-1 justify-center items-center">
        {isError && (
          <Text color="destructive" className="mb-4">
            {String(error instanceof Error ? error.message : error)}
          </Text>
        )}

        {isPending ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className="flex-row items-center gap-4">
            <BassineButtonIncrement
              type="minus"
              currentScore={data?.bassine_count}
            />
            <Text className="font-extrabold text-7xl">
              {data?.bassine_count ?? 0}
            </Text>
            <BassineButtonIncrement type="plus" />
          </View>
        )}
      </View>
    </Page>
  );
};

export default Bassine;
