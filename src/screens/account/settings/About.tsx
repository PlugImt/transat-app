import { useRouter } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, View } from "react-native";
import { HeroAnimation } from "@/components/animations/HeroAnimation";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import { paths } from "@/navigation/paths";
import { getAppVersionInfo } from "@/utils";
import { hapticFeedback } from "@/utils/haptics.utils";

// The developer menu has no other entry point: it opens after this many quick taps on the version.
const DEV_MENU_TAPS = 7;
// Taps further apart than this start the count over.
const TAP_RESET_MS = 1500;

export const About = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { toast } = useToast();
  const taps = useRef({ count: 0, last: 0 });

  const appVersionInfo = getAppVersionInfo();

  const handleVersionPress = () => {
    const now = Date.now();
    const count =
      now - taps.current.last > TAP_RESET_MS ? 1 : taps.current.count + 1;
    taps.current = { count, last: now };

    const remaining = DEV_MENU_TAPS - count;
    if (remaining <= 0) {
      taps.current = { count: 0, last: 0 };
      hapticFeedback.success();
      router.push(paths.devMenu);
    } else if (remaining <= 3) {
      hapticFeedback.light();
      toast(`${remaining}…`, "default", 700);
    }
  };

  const handleOpenLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  return (
    <Page title={t("settings.about.title")}>
      <View className="gap-2 items-center flex-1">
        <HeroAnimation className="mt-6" />
        <View className="items-center justify-center max-w-sm">
          <Text variant="h1" className="text-center">
            Transat
          </Text>
          <Text variant="lg" className="text-center">
            {t("common.campusApp")}
          </Text>
        </View>
      </View>

      <CardGroup title={t("common.credits")}>
        <Card className="flex-row flex-wrap gap-2">
          <Badge
            label="Yohann"
            onPress={() => handleOpenLink("https://github.com/yohann69")}
            variant="secondary"
          />
          <Badge
            label="Enzo"
            onPress={() => handleOpenLink("https://github.com/HeineZo")}
            variant="secondary"
          />
          <Badge
            label="Lucie"
            onPress={() => handleOpenLink("https://github.com/luclu7")}
            variant="secondary"
          />
          <Badge
            label="Matis"
            onPress={() => handleOpenLink("https://github.com/matisbyar")}
            variant="secondary"
          />
          <Badge
            label="Zephyr"
            onPress={() => handleOpenLink("https://github.com/zephyrdassouli")}
            variant="secondary"
          />
          <Badge
            label="Maxime"
            onPress={() => handleOpenLink("https://github.com/maxbodin")}
            variant="secondary"
          />
          <Badge
            label="Pacôme"
            onPress={() =>
              handleOpenLink("https://github.com/PacomeCailleteau")
            }
            variant="secondary"
          />
          <Badge
            label="Marina"
            onPress={() => handleOpenLink("https://github.com/Enockii")}
            variant="secondary"
          />
          <Badge
            label="Anthony"
            onPress={() =>
              handleOpenLink("https://github.com/anthony-eluecque")
            }
            variant="secondary"
          />
        </Card>
      </CardGroup>
      <Text className="text-center italic" color="muted">
        {t("common.plugImtNote")}
      </Text>
      <Pressable onPress={handleVersionPress} hitSlop={12}>
        <Text className="text-center" color="muted" variant="sm">
          {t("settings.about.version")} {appVersionInfo.fullVersion}
        </Text>
      </Pressable>
    </Page>
  );
};

export default About;
