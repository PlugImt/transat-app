import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

interface SuccessScreenProps {
  hasOrdered: boolean;
}

export const SuccessScreen = ({ hasOrdered }: SuccessScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Page title={t("services.fourchettas.orderTitle")} className="h-full">
      <View className="justify-center items-center h-full gap-8 w-full">
        <Image
          source={require("@/assets/images/services/fourchettas.png")}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <View className="items-center">
          <Text variant="h2" className="text-center">
            {t("services.fourchettas.orderThanks")}
          </Text>
          <Text color="muted" className="text-center">
            {hasOrdered
              ? t("services.fourchettas.orderModified")
              : t("services.fourchettas.orderSent")}
          </Text>
        </View>
        <Button
          label={t("services.fourchettas.back")}
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </Page>
  );
};
