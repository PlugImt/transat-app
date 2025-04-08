import Page from "@/components/common/Page";
import { useUpdateLanguage } from "@/hooks/account/useUpdateLanguage";
import i18n from "@/i18n";
import type { SettingsNavigation } from "@/services/storage/types";
import { useTheme } from "@/themes/useThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { SettingsItem } from "./SettingsItem";

// Define the language object structure
interface LanguageOption {
  code: string;
  name: string;
  translatedName: string;
}

export const Language = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  const navigation = useNavigation<SettingsNavigation>();
  const { mutate: updateLanguage, isPending, variables } = useUpdateLanguage();
  const [languages, setLanguages] = useState<LanguageOption[]>([]);

  useEffect(() => {
    // Get available languages from i18n resources
    const availableLanguageCodes = Object.keys(i18n.options.resources || {});

    // Create language options array
    const languageOptions = availableLanguageCodes.map((code) => {
      // Try to get the language's native name from its own translation file if available
      let nativeName = code;

      try {
        // Try to access language's self-name from translation files
        // This assumes each language file has a key for its own name
        // e.g., in the English file: "language.english": "English"
        const languageRes = i18n.getResourceBundle(code, "translation");
        // Check different possible paths where the native name might be stored
        const possiblePaths = [
          `language.${code}`,
          `settings.language.${code}`,
          `common.language.${code}`,
          "language.name",
          "settings.language.name",
        ];

        for (const path of possiblePaths) {
          const parts = path.split(".");
          let value = languageRes;

          // Navigate through the nested object structure
          for (const part of parts) {
            if (value && typeof value === "object" && part in value) {
              value = value[part];
            } else {
              value = null;
              break;
            }
          }

          if (typeof value === "string") {
            nativeName = value;
            break;
          }
        }
      } catch (error) {
        console.log(`Couldn't find native name for ${code}`, error);
      }

      // For translatedName, use current language's translation of this language
      // e.g., "French" in English or "Francés" in Spanish
      const translatedName = t(
        [
          `settings.language.${code}`,
          `language.${code}`,
          `common.language.${code}`,
        ],
        { defaultValue: nativeName },
      );

      return {
        code,
        name: nativeName,
        translatedName: translatedName !== code ? translatedName : nativeName,
      };
    });

    // Sort languages with current language first, then alphabetically by name
    languageOptions.sort((a, b) => {
      if (a.code === currentLanguage) return -1;
      if (b.code === currentLanguage) return 1;
      return a.name.localeCompare(b.name);
    });

    // @ts-ignore
    setLanguages(languageOptions);
  }, [t, currentLanguage]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      updateLanguage(languageCode, {
        onSuccess: () => {
          navigation.goBack();
        },
      });
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
            title={language.name}
            subtitle={language.translatedName}
            onPress={() => handleLanguageChange(language.code)}
            rightElement={
              isPending && variables === language.code ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : currentLanguage === language.code ? (
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
