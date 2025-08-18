import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Avatar from "@/components/common/Avatar";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useGroupedBassineHistory } from "@/hooks/services/games/bassine/useGroupedBassineHistory";
import { getTimeAgo } from "@/utils/date.utils";

type HistoryUser = {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null | undefined;
  dates: string[];
};

export const BassineHistory = () => {
  const { t } = useTranslation();
  const { groups, isPending, isError } = useGroupedBassineHistory();

  if (isPending)
    return (
      <Card>
        <Text>Loading...</Text>
      </Card>
    );

  if (isError)
    return (
      <Card>
        <Text>Failed to load history</Text>
      </Card>
    );

  return (
    <View className="gap-4">
      {(!groups || groups.length === 0) && (
        <Card>
          <Text>{t("common.empty")}</Text>
        </Card>
      )}

      {groups?.map((group) => (
        <View key={`${group.type}-${group.key}`} className="gap-2">
          <Text color="muted" className="ml-4">
            {getTimeAgo(group.latestDate, t)}
          </Text>
          {group.users.map(({ user, count }) => (
            <Card key={user.email} className="flex-row gap-2 items-center">
              <Avatar
                user={{
                  ...user,
                  profile_picture: user.profile_picture ?? undefined,
                }}
                size={32}
              />
              <Text className="flex-1">
                <Text className="font-bold">
                  {user.first_name} {user.last_name}
                </Text>{" "}
                {t("games.bassine.leaderboard.tookBassine", { count })}
              </Text>
            </Card>
          ))}
        </View>
      ))}
    </View>
  );
};

export default BassineHistory;
