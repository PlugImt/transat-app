import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";

export const Olimtpe = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("services.olimtpe.title")}
      header={
        <AboutModal
          title={t("services.olimtpe.title")}
          description={t("services.olimtpe.about")}
          additionalInfo={t("services.olimtpe.additionalInfo")}
        />
      }
    >
      <View className="min-h-full flex justify-center items-center gap-8 p-4">
        <Image
          source={require("@/assets/images/services/olimtpe.png")}
          size={100}
          resizeMode="contain"
        />

        <View className="gap-4 max-w-md">
          <Text variant="h1" className="text-center">
            {t("services.olimtpe.welcome")}
          </Text>

          <Text className="text-center" color="muted">
            {t("services.olimtpe.description")}
          </Text>

          <View className="bg-primary/10 p-4 rounded-lg">
            <Text variant="h3" className="text-center" color="primary">
              {t("services.olimtpe.services")}
            </Text>
            <View className="mt-2 gap-2">
              <Text className="text-center">
                • {t("services.olimtpe.service1")}
              </Text>
              <Text className="text-center">
                • {t("services.olimtpe.service2")}
              </Text>
              <Text className="text-center">
                • {t("services.olimtpe.service3")}
              </Text>
              <Text className="text-center">
                • {t("services.olimtpe.service4")}
              </Text>
            </View>
          </View>

          <View className="bg-secondary/10 p-4 rounded-lg">
            <Text variant="h3" className="text-center">
              {t("services.olimtpe.contact")}
            </Text>
            <Text className="text-center mt-2" color="muted">
              {t("services.olimtpe.contactInfo")}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};
