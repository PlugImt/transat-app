import { Soup } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Avatar from "@/components/common/Avatar";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import type { User } from "@/dto";
import { useGroupedBassineHistory } from "@/hooks/services/games/bassine/useGroupedBassineHistory";
import { getTimeAgo } from "@/utils/date.utils";

export const BassineHistory = () => {
  const { t } = useTranslation();
  const { groups, isPending } = useGroupedBassineHistory();

  const isEmpty = !groups || groups.length === 0;

  if (isPending) {
    return <BassineHistorySkeleton />;
  }

  if (isEmpty) {
    return (
      <Empty
        icon={<Soup />}
        title={t("games.bassine.leaderboard.history.emptyHistory")}
        description={t(
          "games.bassine.leaderboard.history.emptyHistoryDescription",
        )}
      />
    );
  }

  return (
    <View className="gap-4">
      {groups?.map((group) => (
        <View key={`${group.type}-${group.key}`} className="gap-2">
          <Text color="muted" className="ml-4">
            {getTimeAgo(group.latestDate, t)}
          </Text>
          {group.users.map(({ user, count }) => (
            <Card key={user.email} className="flex-row gap-2 items-center">
              <Avatar user={user as User} size={32} />
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

const BassineHistorySkeleton = () => {
  return (
    <View className="gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={String(index)} className="gap-2">
          <TextSkeleton className="ml-4" lastLineWidth={200} />
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={String(index)} className="flex-row gap-2 items-center">
              <AvatarSkeleton size={32} />
              <TextSkeleton lines={2} className="flex-1" />
            </Card>
          ))}
        </View>
      ))}
    </View>
  );
};
