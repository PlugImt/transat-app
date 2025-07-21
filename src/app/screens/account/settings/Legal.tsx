import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

export const Legal = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("settings.legal.title")}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Terms of Use Section */}
          <View className="gap-3">
            <Text variant="h2">{t("settings.legal.termsOfUse")}</Text>
            <Text>{t("settings.legal.termsDescription")}</Text>

            <View className="gap-4">
              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.acceptance")}</Text>
                <Text color="muted">{t("settings.legal.acceptanceText")}</Text>
              </View>

              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.userAccount")}</Text>
                <Text color="muted">{t("settings.legal.userAccountText")}</Text>
              </View>

              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.privacy")}</Text>
                <Text color="muted">{t("settings.legal.privacyText")}</Text>
              </View>

              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.liability")}</Text>
                <Text color="muted">{t("settings.legal.liabilityText")}</Text>
              </View>

              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.modifications")}</Text>
                <Text color="muted">
                  {t("settings.legal.modificationsText")}
                </Text>
              </View>
            </View>
          </View>

          {/* Privacy Policy Section */}
          <View className="gap-3">
            <Text variant="h2">{t("settings.legal.privacyPolicy")}</Text>
            <Text>{t("settings.legal.privacyPolicyDescription")}</Text>

            <View className="gap-4">
              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.dataCollection")}</Text>
                <Text color="muted">
                  {t("settings.legal.dataCollectionText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.dataUsage")}</Text>
                <Text color="muted">{t("settings.legal.dataUsageText")}</Text>
              </View>

              <View className="gap-2">
                <Text variant="lg">{t("settings.legal.dataSecurity")}</Text>
                <Text color="muted">
                  {t("settings.legal.dataSecurityText")}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="gap-3 pb-8">
            <Text variant="h2">{t("settings.legal.contact")}</Text>
            <Text color="muted">{t("settings.legal.contactText")}</Text>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
};

export default Legal;
