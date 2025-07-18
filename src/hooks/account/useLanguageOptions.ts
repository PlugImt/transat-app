import { useEffect, useState } from "react";
import i18n from "@/i18n";

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
  }, [currentLanguage]);

  return {
    currentLanguageOption,
    otherLanguages,
    currentLanguage,
  };
};
