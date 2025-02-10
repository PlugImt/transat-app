import { Button } from "@/components/common/ButtonV2";
import Page from "@/components/common/Page";
import type { AuthStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ImageBackground, Text, View } from "react-native";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const { t } = useTranslation();

  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <Page>
      <View className="flex flex-col gap-16 items-center mt-32">
        <View className="flex flex-col items-center gap-4">
          <Text className="h1 text-5xl">Transat</Text>
          <Text className="h3">{t("welcome.subtitle")}</Text>
        </View>
        <View className="flex flex-col gap-4 w-full">
          <Button
            size="lg"
            label={t("welcome.login")}
            onPress={() => navigation.navigate("Signin")}
          />
          <Button
            size="lg"
            variant="outlined"
            label={t("welcome.signup")}
            onPress={() => navigation.navigate("Signup")}
          />
        </View>
      </View>
    </Page>
  );
};

export default Welcome;
