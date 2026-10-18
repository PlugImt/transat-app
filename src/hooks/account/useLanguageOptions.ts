import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  code: string;
  name: string;
}

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  zh: "中文",
};

export const useLanguageOptions = () => {
  const [currentLanguageOption, setCurrentLanguageOption] =
    useState<LanguageOption | null>(null);
  const [otherLanguages, setOtherLanguages] = useState<LanguageOption[]>([]);

  // The hook (not the i18n singleton) re-renders this component when the language changes.
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const availableLanguageCodes = Object.keys(i18n.options.resources || {});

    const languageOptions: LanguageOption[] = availableLanguageCodes.map(
      (code) => ({
        code,
        name: languageNames[code] || code,
      }),
    );

    const currentLang = languageOptions.find(
      (lang) => lang.code === currentLanguage,
    );
    const otherLangs = languageOptions
      .filter((lang) => lang.code !== currentLanguage)
      .sort((a, b) => a.name.localeCompare(b.name));

    setCurrentLanguageOption(currentLang || null);
    setOtherLanguages(otherLangs);
  }, [currentLanguage, i18n.options.resources]);

  return {
    currentLanguageOption,
    otherLanguages,
    currentLanguage,
  };
};
