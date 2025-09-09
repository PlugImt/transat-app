import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { GameCard } from "./components/GameCard";
import { gamesConfig } from "./config";

export const Games = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Page
      title={t("games.title")}
      className="flex-1 justify-center items-center"
      disableScroll
    >
      <CircleGradient />
      <View className="flex-row flex-wrap gap-6 justify-center items-center p-4">
        {gamesConfig.map(({ key, titleKey, Icon, route }) => (
          <GameCard
            key={key}
            title={t(titleKey)}
            Icon={Icon}
            onPress={() => navigation.navigate(route as never)}
          />
        ))}
      </View>
    </Page>
  );
};

export default Games;

const CircleGradient = () => {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={[
        `${theme.primary}00`,
        `${theme.primary}15`,
        `${theme.primary}30`,
        `${theme.primary}40`,
        `${theme.primary}30`,
        `${theme.primary}15`,
        `${theme.primary}00`,
      ]}
      locations={[0, 0.15, 0.35, 0.5, 0.65, 0.85, 1]}
      style={{
        position: "absolute",
        width: 800,
        height: 500,
        borderRadius: 999,
        opacity: 0.8,
        transform: [{ scale: 1.0 }],
      }}
      pointerEvents="none"
    />
  );
};
