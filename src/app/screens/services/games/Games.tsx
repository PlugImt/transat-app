import { useNavigation } from "@react-navigation/native";
import { Gamepad2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { BlurredBackground } from "@/components/common/BlurredBackground";
import LinkCard from "@/components/custom/card/LinkCard";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppNavigation } from "@/types";

export const Games = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { theme } = useTheme();

  return (
    <Page
      title={t("games.title")}
      disableScroll
      className="flex-1 justify-center items-center gap-0"
      background={
        <BlurredBackground
          picture={
            "https://images.unsplash.com/photo-1517815154571-fbabad618f3f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          blurIntensity={90}
        />
      }
      headerColor="transparent"
    >
      <View className="w-full max-w-xl gap-2">
        <LinkCard
          title={t("games.bassine.title")}
          description={t("games.bassine.description")}
          onPress={() => navigation.navigate("Bassine")}
          image={
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                backgroundColor: theme.card,
              }}
              className="items-center justify-center"
            >
              <Gamepad2 size={28} color={theme.primary} />
            </View>
          }
        />
      </View>
    </Page>
  );
};

export default Games;
