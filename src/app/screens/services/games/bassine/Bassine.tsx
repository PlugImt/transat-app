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
import { useAuth } from "@/hooks/account";
import type { AppScreenNavigationProp } from "@/types";
import { AboutBassine } from "./AboutBassine";

export const Bassine = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const { user } = useAuth();
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
              pictures={[
                user?.profile_picture,
                user?.profile_picture,
                user?.profile_picture,
              ]}
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
      <View className="flex-row items-center gap-2 max-w-48">
        <Avatar user={user} size={24} />
        <Text variant="sm">
          <Text className="font-bold" variant="sm">
            {user?.first_name}
          </Text>{" "}
          est seulement 3 bassines devant toi
        </Text>
        {/* <ChevronRight size={16} color={theme.muted} /> */}
      </View>
    </Page>
  );
};

export default Bassine;
