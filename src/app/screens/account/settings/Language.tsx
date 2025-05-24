import Page from "@/components/common/Page";
import { useUpdateLanguage } from "@/hooks/account/useUpdateLanguage";
import i18n from "@/i18n";
import type { SettingsNavigation } from "@/services/storage/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { SettingsItem } from "./SettingsItem";

// Define the language object structure
interface LanguageOption {
  code: string;
  name: string;
  translatedName: string;
}

// Map of language codes to their native names as fallback
const languageNativeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
  // Add more languages as needed
};

export const Language = () => {
  const { theme } = useTheme();
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
      // Start with fallback native name from our map or use code as last resort
      let nativeName = languageNativeNames[code] || code;

      try {
        // Try to access language's self-name from translation files
        const languageRes = i18n.getResourceBundle(code, "translation");

        // Define a helper function to safely navigate nested objects
        // biome-ignore lint/suspicious/noExplicitAny : todo: a handle
        const getNestedValue = (obj: any, path: string): string | null => {
          const parts = path.split(".");
          let current = obj;

          for (const part of parts) {
            if (current && typeof current === "object" && part in current) {
              current = current[part];
            } else {
              return null;
            }
          }

          return typeof current === "string" ? current : null;
        };

        // Check different possible paths where the native name might be stored
        const possiblePaths = [
          `language.${code}`,
          `settings.language.${code}`,
          `common.language.${code}`,
          `language.options.${code}`,
          `settings.options.${code}`,
          "language.name",
          "settings.language.name",
        ];

        for (const path of possiblePaths) {
          const value = getNestedValue(languageRes, path);
          if (value) {
            nativeName = value;
            break;
          }
        }
      } catch (error) {
        console.log(`Couldn't find native name for ${code}`, error);
      }

      // For translatedName, use current language's translation of this language
      const translatedName = t(
        [
          `settings.language.${code}`,
          `language.${code}`,
          `common.language.${code}`,
          `language.options.${code}`,
        ],
        { defaultValue: nativeName !== code ? nativeName : code },
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
    <Page goBack title={t("settings.language.language")}>
      <View className="bg-card rounded-lg px-4 py-2">
        {languages.map((language) => (
          <SettingsItem
            key={language.code}
            title={language.name}
            subtitle={
              language.translatedName !== language.name &&
              language.translatedName !== language.code
                ? language.translatedName
                : language.code
            }
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
