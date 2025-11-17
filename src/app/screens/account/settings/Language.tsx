import { useNavigation } from "@react-navigation/native";
import { Check } from "lucide-react-native";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguageOptions } from "@/hooks/account/useLanguageOptions";
import { useUpdateLanguage } from "@/hooks/account/useUpdateLanguage";
import type { AppNavigation } from "@/types";
import SettingCategory from "./components/SettingCategory";
import { SettingsItem } from "./components/SettingsItem";

export const Language = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigation = useNavigation<AppNavigation>();
  const { mutate: updateLanguage, isPending } = useUpdateLanguage();
  const { currentLanguageOption, otherLanguages } = useLanguageOptions();

  const handleLanguageChange = async (languageCode: string) => {
    updateLanguage(languageCode, {
      onSuccess: () => {
        navigation.goBack();
      },
      onError: () => {
        toast(t("settings.language.selectLanguageError"), "destructive");
      },
    });
  };

  return (
    <Page title={t("settings.language.language")} className="gap-4">
      {currentLanguageOption && (
        <MotiView
          animate={{
            opacity: isPending ? 0.5 : 1,
            scale: isPending ? 0.95 : 1,
          }}
        >
          <CardGroup title={t("settings.language.currentLanguage")}>
            <Card>
              <View className="flex-row items-center justify-between gap-4">
                <Text>{currentLanguageOption.name}</Text>
                <Check color={theme.primary} size={20} />
              </View>
            </Card>
          </CardGroup>
        </MotiView>
      )}
      {otherLanguages.length > 0 && (
        <SettingCategory title={t("settings.language.otherLanguages")}>
          {otherLanguages.map((language) => (
            <SettingsItem
              key={language.code}
              title={language.name}
              onPress={() => handleLanguageChange(language.code)}
            />
          ))}
        </SettingCategory>
      )}
    </Page>
  );
};

export default Language;
