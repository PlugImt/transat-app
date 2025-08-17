import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Easing } from "react-native-reanimated";
import Avatar from "@/components/common/Avatar";
import { IconButton } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { UserStack } from "@/components/custom";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { BassineLeaderboardEntry } from "@/dto";
import { useBassineOverview } from "@/hooks/services/games/bassine/useBassine";
import type { AppScreenNavigationProp } from "@/types";
import { AboutBassine } from "./AboutBassine";
import { useNeighbors } from "./hooks/useNeighbors";

export const Bassine = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data: overview } = useBassineOverview();
  const neighbors = useNeighbors({
    user: {
      email: overview?.email,
      rank: overview?.rank,
      bassine_count: overview?.bassine_count,
    } as BassineLeaderboardEntry,
    userAbove: overview?.user_above,
    userBelow: overview?.user_below,
  });
  const [count, setCount] = useState(overview?.bassine_count ?? 0);

  const navigation = useNavigation<AppScreenNavigationProp>();
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  const decrementDisabled = count <= 0;

  return (
    <Page
      title={t("games.bassine.title")}
      className="flex-1 justify-center items-center"
      header={<AboutBassine />}
      disableScroll
      footer={
        <Card
          className="rounded-full flex-row items-center gap-4 px-4 py-2 self-center"
          onPress={() => {
            navigation.navigate("BassineLeaderboard");
          }}
        >
          <View className="flex-row items-center gap-2">
            <UserStack
              pictures={overview?.leaderboard.map(
                (user) => user.profile_picture ?? "",
              )}
            />
            <Text>Voir le classement</Text>
          </View>
          <ChevronRight size={16} color={theme.text} />
        </Card>
      }
    >
      <View className="flex-row items-center gap-6">
        <IconButton
          icon={<Minus size={24} strokeWidth={3} />}
          variant="ghost"
          size="lg"
          onPress={decrement}
          disabled={decrementDisabled}
        />
        <AnimatedRollingNumber
          value={count}
          compactToFixed={2}
          textStyle={{ fontSize: 60, fontWeight: "900", color: theme.text }}
          spinningAnimationConfig={{
            duration: 500,
            easing: Easing.elastic(1.5),
          }}
        />
        <IconButton
          icon={<Plus size={24} strokeWidth={3} />}
          variant="ghost"
          size="lg"
          onPress={increment}
        />
      </View>
      {neighbors && (
        <View className="flex-row items-center gap-2 max-w-48">
          <Avatar
            user={{
              first_name: neighbors.followingUser?.first_name,
              last_name: neighbors.followingUser?.last_name,
              profile_picture:
                neighbors.followingUser?.profile_picture || undefined,
            }}
            size={24}
          />
          <Text variant="sm">
            <Text className="font-bold" variant="sm">
              {neighbors.followingUser?.first_name}
            </Text>{" "}
            {neighbors.followingText}
          </Text>
        </View>
      )}
    </Page>
  );
};

export default Bassine;
