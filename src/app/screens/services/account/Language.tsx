import Page from "@/components/common/Page";
import i18n from "@/i18n";
import { storage } from "@/services/storage/asyncStorage";
import { STORAGE_KEYS } from "@/services/storage/constants";
import type { SettingsNavigation } from "@/services/storage/types";
import { useTheme } from "@/themes/useThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { SettingsItem } from "./SettingsItem";

export const Language = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  const navigation = useNavigation<SettingsNavigation>();

  const languages = [
    {
      code: "fr",
      name: "Français",
      translatedName: t("settings.language.french"),
    },
    {
      code: "en",
      name: "English",
      translatedName: t("settings.language.english"),
    },
    {
      code: "es",
      name: "Español",
      translatedName: t("settings.language.spanish"),
    },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await storage.set(STORAGE_KEYS.LANGUAGE, languageCode);
      navigation.goBack();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <Page>
      <Text className="h1 m-4">{t("settings.language.language")}</Text>
      <View className="bg-card rounded-lg px-4 py-2">
        {languages.map((language) => (
          <SettingsItem
            key={language.code}
            // icon={<Globe color={theme.foreground} size={22} />}
            title={language.name}
            subtitle={language.translatedName}
            onPress={() => handleLanguageChange(language.code)}
            rightElement={
              currentLanguage === language.code ? (
                <Check color={theme.primary} size={20} />
              ) : null
            }
          />
        ))}
      </View>
    </Page>
  );
};

export default Language;
