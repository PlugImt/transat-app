import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Easing } from "react-native-reanimated";
import Avatar from "@/components/common/Avatar";
import { IconButton } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { UserStack, UserStackSkeleton } from "@/components/custom";
import { Page } from "@/components/page/Page";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { BassineLeaderboardEntry, User } from "@/dto";
import {
  useBassineDecrement,
  useBassineIncrement,
  useBassineOverview,
} from "@/hooks/services/games/bassine/useBassine";
import type { AppNavigation } from "@/types";
import { AboutBassine } from "./AboutBassine";
import { useNeighbors } from "./hooks/useNeighbors";

export const Bassine = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data, isPending } = useBassineOverview();

  const neighbors = useNeighbors({
    user: {
      email: data?.email,
      rank: data?.rank,
      bassine_count: data?.bassine_count,
    } as BassineLeaderboardEntry,
    userAbove: data?.user_above,
    userBelow: data?.user_below,
  });

  const [count, setCount] = useState(data?.bassine_count ?? 0);

  const navigation = useNavigation<AppNavigation>();
  const { mutate: inc, isPending: isIncPending } = useBassineIncrement();
  const { mutate: dec, isPending: isDecPending } = useBassineDecrement();

  useEffect(() => {
    if (typeof data?.bassine_count === "number") {
      setCount(data.bassine_count);
    }
  }, [data?.bassine_count]);

  const increment = () => {
    setCount((prev) => prev + 1);
    inc();
  };
  const decrement = () => {
    setCount((prev) => Math.max(0, prev - 1));
    dec();
  };

  if (isPending) {
    return <BassineSkeleton />;
  }

  const decrementDisabled = count <= 0 || isDecPending;

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
            <UserStack size="sm" users={data?.leaderboard as User[]} />
            <Text>{t("games.bassine.seeLeaderboard")}</Text>
          </View>
          <ChevronRight size={16} color={theme.text} />
        </Card>
      }
    >
      <View className="flex-row items-center gap-6 ">
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
          disabled={isIncPending}
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
          <Text variant="sm" className="flex-1">
            <Text className="font-bold flex-1" variant="sm">
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

const BassineSkeleton = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();
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
            <UserStackSkeleton size="sm" />
            <Text>{t("games.bassine.seeLeaderboard")}</Text>
          </View>
          <ChevronRight size={16} color={theme.text} />
        </Card>
      }
    >
      <View className="gap-4">
        <View className="flex-row items-center gap-6">
          <IconButton
            icon={<Minus size={24} strokeWidth={3} />}
            variant="ghost"
            size="lg"
            disabled
          />
          <ImageSkeleton size={60} />
          <IconButton
            icon={<Plus size={24} strokeWidth={3} />}
            variant="ghost"
            size="lg"
            disabled
          />
        </View>
        <View className="flex-row items-center gap-2 max-w-64">
          <AvatarSkeleton size={24} />
          <TextSkeleton variant="sm" lines={2} className="flex-1" />
        </View>
      </View>
    </Page>
  );
};
