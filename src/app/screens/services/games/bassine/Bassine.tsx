import { Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Easing } from "react-native-reanimated";
import { IconButton } from "@/components/common/Button";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { AboutBassine } from "./AboutBassine";

export const Bassine = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  const decrementDisabled = count <= 0;

  return (
    <Page
      title={t("games.bassine.title")}
      className="flex-1 justify-center items-center"
      header={<AboutBassine />}
      disableScroll
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
    </Page>
  );
};

export default Bassine;
