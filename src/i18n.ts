import {
  format as formatDate,
  formatDistance,
  formatRelative,
  isDate,
} from "date-fns";
import { de, enUS, es, fr, pt, zhCN } from "date-fns/locale";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { storage } from "./services/storage/asyncStorage";
import STORAGE_KEYS from "./services/storage/constants";

// hack pour qu'on puisse attendre que i18n soit initialisé
let resolveInitialization: (value?: unknown) => void;
export const i18nInitializedPromise = new Promise((resolve) => {
  resolveInitialization = resolve;
});

// Dynamic import of all translation files
const importAllTranslations = () => {
  const context = require.context("../locales", true, /\/translation\.json$/);
  const resources: Record<string, { translation: TranslationResource }> = {};
  // Default to English for type definitions
  let defaultTranslation = null;

  for (const key of context.keys()) {
    // Extract language code from path (e.g., './en/translation.json' -> 'en')
    const langCode = key.split("/")[1];

    if (langCode && langCode.length === 2) {
      const translation = context(key);
      resources[langCode] = { translation };

      // Store English translations for type definitions
      if (langCode === "en") {
        defaultTranslation = translation;
      }
    }
  }

  return { resources, defaultTranslation };
};

const { resources } = importAllTranslations();

const locales = {
  fr,
  en: enUS,
  es,
  de,
  pt,
  zh: zhCN,
};

// type TranslationResource = { [key: string]: any };
// or more specifically allowing strings or nested objects
type TranslationResource = { [key: string]: string };

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      // Use the simpler type here
      translation: TranslationResource; // Or NestedTranslation if you prefer
    };
  }
}

// Initialize i18n
storage.get<string>(STORAGE_KEYS.LANGUAGE).then((language) => {
  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  const availableLanguages = Object.keys(resources);

  // Determine language to use (stored preference, device language if available, or English)
  let selectedLanguage = "en"; // Default fallback

  if (language && availableLanguages.includes(language)) {
    selectedLanguage = language;
  } else if (deviceLanguage && availableLanguages.includes(deviceLanguage)) {
    selectedLanguage = deviceLanguage;
  }

  i18n.use(initReactI18next).init(
    {
      resources,
      lng: selectedLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
        format: (value, format, lng) => {
          if (isDate(value)) {
            const locale = locales[lng as keyof typeof locales];

            if (format === "short")
              return formatDate(value, "dd MMMM", { locale });
            if (format === "long") return formatDate(value, "PPPP", { locale });
            if (format === "relative")
              return formatRelative(value, new Date(), { locale });
            if (format === "ago")
              return formatDistance(value, new Date(), {
                locale,
                addSuffix: true,
              });
            if (format === "weekday")
              return formatDate(value, "EEEE", { locale });
            if (format === "time")
              return formatDate(value, "HH:mm", { locale });
            if (format === "dateTime")
              return formatDate(value, "Pp", { locale });

            return formatDate(value, format || "P", { locale });
          }
          return value;
        },
      },
    },
    (err, _t) => {
      if (err) {
        console.log("Something went wrong loading translations", err);
        resolveInitialization(); // Resolve even if there's an error to not block the app
        return;
      }
      console.log(`i18n initialized with language: ${selectedLanguage}`);
      console.log(`Available languages: ${availableLanguages.join(", ")}`);
      resolveInitialization(); // Resolve the promise
    },
  );
});

export default i18n;
