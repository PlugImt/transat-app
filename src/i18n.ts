import * as Localization from "expo-localization";
// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { storage } from "./services/storage/asyncStorage";
import STORAGE_KEYS from "./services/storage/constants";

// Import all translation files
import en from "../locales/en/translation.json";
import es from "../locales/es/translation.json";
import fr from "../locales/fr/translation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
};

storage.get<string>(STORAGE_KEYS.LANGUAGE).then((language) => {
  i18n.use(initReactI18next).init(
    {
      resources,
      lng: language ?? Localization.getLocales()[0].languageCode ?? "en", // Use device language
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    },
    (err, _t) => {
      if (err) {
        return console.log("Something went wrong loading translations", err);
      }
    },
  );
});

export default i18n;
