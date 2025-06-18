import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import { useTheme } from "@/contexts/ThemeContext";

export const Olimtpe = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Page
      goBack
      title={t("services.olimtpe.title")}
      about={
        <AboutModal
          title={t("services.olimtpe.title")}
          description={t("services.olimtpe.about")}
          additionalInfo={t("services.olimtpe.additionalInfo")}
        />
      }
    >
      <View className="min-h-full flex justify-center items-center gap-8 p-4">
        <Image
          source={require("@/assets/images/Logos/olimtpe.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />

        <View className="gap-4 max-w-md">
          <Text className="h1 text-center" style={{ color: theme.text }}>
            {t("services.olimtpe.welcome")}
          </Text>

          <Text className="body text-center text-muted-foreground">
            {t("services.olimtpe.description")}
          </Text>

          <View className="bg-primary/10 p-4 rounded-lg">
            <Text className="h3 text-center" style={{ color: theme.primary }}>
              {t("services.olimtpe.services")}
            </Text>
            <View className="mt-2 gap-2">
              <Text className="body text-center" style={{ color: theme.text }}>
                • {t("services.olimtpe.service1")}
              </Text>
              <Text className="body text-center" style={{ color: theme.text }}>
                • {t("services.olimtpe.service2")}
              </Text>
              <Text className="body text-center" style={{ color: theme.text }}>
                • {t("services.olimtpe.service3")}
              </Text>
              <Text className="body text-center" style={{ color: theme.text }}>
                • {t("services.olimtpe.service4")}
              </Text>
            </View>
          </View>

          <View className="bg-secondary/10 p-4 rounded-lg">
            <Text className="h3 text-center" style={{ color: theme.text }}>
              {t("services.olimtpe.contact")}
            </Text>
            <Text
              className="body text-center mt-2"
              style={{ color: theme.text }}
            >
              {t("services.olimtpe.contactInfo")}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};
