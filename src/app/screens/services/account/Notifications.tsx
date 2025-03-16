import Page from "@/components/common/Page";
import { Switch } from "@/components/common/Switch";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const Notifications = () => {
  const { t } = useTranslation();

  return (
    <Page className="gap-6">
      <Text className="h1 m-4">Notifications</Text>

      <View className="gap-2">
        <Text className="h3">{t("common.appearance")}</Text>
        <View className="bg-card rounded-lg px-4 py-2">
          <Switch value />
        </View>
      </View>
    </Page>
  );
};

export default Notifications;
