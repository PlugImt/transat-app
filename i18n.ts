import * as Localization from "expo-localization";
// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all translation files
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";

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

i18n.use(initReactI18next).init(
  {
    resources,
    lng: Localization.locale.split("-")[0], // Use device language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  },
  (err, t) => {
    if (err) {
      return console.log("something went wrong loading translations", err);
    }
  },
);

export default i18n;
