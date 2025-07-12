import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

export const Legal = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Page goBack className="gap-6" title={t("settings.legal.title")}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Terms of Use Section */}
          <View className="gap-3">
            <Text className="h2" style={{ color: theme.text }}>
              {t("settings.legal.termsOfUse")}
            </Text>
            <Text className="body-medium" style={{ color: theme.text }}>
              {t("settings.legal.termsDescription")}
            </Text>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.acceptance")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.acceptanceText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.userAccount")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.userAccountText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.privacy")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.privacyText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.liability")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.liabilityText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.modifications")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.modificationsText")}
                </Text>
              </View>
            </View>
          </View>

          {/* Privacy Policy Section */}
          <View className="gap-3">
            <Text className="h2" style={{ color: theme.text }}>
              {t("settings.legal.privacyPolicy")}
            </Text>
            <Text className="body-medium" style={{ color: theme.text }}>
              {t("settings.legal.privacyPolicyDescription")}
            </Text>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.dataCollection")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.dataCollectionText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.dataUsage")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.dataUsageText")}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="h4" style={{ color: theme.text }}>
                  {t("settings.legal.dataSecurity")}
                </Text>
                <Text className="body-regular" style={{ color: theme.muted }}>
                  {t("settings.legal.dataSecurityText")}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="gap-3 pb-8">
            <Text className="h2" style={{ color: theme.text }}>
              {t("settings.legal.contact")}
            </Text>
            <Text className="body-regular" style={{ color: theme.muted }}>
              {t("settings.legal.contactText")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
};

export default Legal;
