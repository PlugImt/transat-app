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

interface LanguageOption {
  code: string;
  name: string;
  translatedName: string;
}

const nativeLanguageNames: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
  bn: "বাংলা",
  te: "తెలుగు",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  pa: "ਪੰਜਾਬੀ",
  mr: "मराठी",
  ta: "தமிழ்",
  ur: "اردو",
  tr: "Türkçe",
  fa: "فارسی",
  ma: "മലയാളം",
  sw: "Kiswahili",
  hu: "Magyar",
  cs: "Čeština",
  ro: "Română",
  nl: "Nederlands",
  pl: "Polski",
  th: "ไทย",
  km: "ភាសាខ្មែរ",
  so: "Af Soomaali",
  ne: "नेपाली",
  sn: "chiShona",
  sd: "سنڌي",
  am: "አማርኛ",
  yo: "Yorùbá",
  ig: "Igbo",
  ha: "Hausa",
  gu: "ગુજરાતી",
  or: "ଓଡ଼ିଆ",
  my: "မြန်မာဘာသာ",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  si: "සිංහල",
  ku: "Kurdî",
  su: "Basa Sunda",
  az: "Azərbaycan dili",
  uz: "Oʻzbek",
  kk: "Қазақша",
  sr: "Српски",
  hr: "Hrvatski",
  tw: "Twi",
  ee: "Eʋegbe",
  lg: "Luganda",
  ak: "Akan",
  mg: "Malagasy",
  ht: "Kreyòl Ayisyen",
  rn: "Ikirundi",
  ny: "Chichewa",
  st: "Sesotho",
  zu: "isiZulu",
  xh: "isiXhosa",
  ln: "Lingala",
  tn: "Setswana",
  lu: "Tshiluba",
  bo: "བོད་སྐད་",
  dz: "རྫོང་ཁ",
  ka: "ქართული",
  el: "Ελληνικά",
  bg: "Български",
  mk: "Македонски",
  sl: "Slovenščina",
  sk: "Slovenčina",
  eu: "Euskara",
  ca: "Català",
  fi: "Suomi",
  sv: "Svenska",
  da: "Dansk",
  no: "Norsk",
  is: "Íslenska",
  cy: "Cymraeg",
  ga: "Gaeilge",
  et: "Eesti",
  lv: "Latviešu",
  lt: "Lietuvių",
  hy: "Հայերեն",
  he: "עברית",
  as: "অসমীয়া",
  mn: "Монгол",
  ps: "پښتو",
  ky: "Кыргызча",
  tg: "Тоҷикӣ",
  lo: "ພາສາລາວ",
  jv: "Basa Jawa",
  ay: "Aymar aru",
  qu: "Runa Simi",
  na: "Ekakairũ Naoero",
  ty: "Reo Tahiti",
  fj: "Vosa Vakaviti",
  to: "Lea Faka-Tonga",
  ho: "Hiri Motu",
  hz: "Otjiherero",
  tk: "Türkmençe",
  bi: "Bislama",
  pi: "पाऴि",
  ie: "Interlingue",
  vo: "Volapük",
  tl: "Tagalog",
  mi: "Te Reo Māori",
  haw: "ʻŌlelo Hawaiʻi",
  sm: "Gagana fa'a Samoa",
  ch: "Chamoru",
  ve: "Tshivenḓa",
  ts: "Xitsonga",
  nr: "isiNdebele",
  ss: "SiSwati",
  mo: "Moldovenească",
  rm: "Rumantsch",
  cu: "ѩзыкъ словѣньскъ",
  kv: "Коми кыв",
};

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

    // Create language objects with native names and translations
    const languageOptions = availableLanguageCodes.map((code) => {
      // Get translated name from i18n if available, otherwise use language code
      const translationKey = `settings.language.${code}`;
      let translatedName = t(translationKey);

      // If translation key doesn't exist, it will return the key itself
      if (translatedName === translationKey) {
        translatedName = code;
      }

      return {
        code,
        // Use native name from our map or default to the code if not found
        name: nativeLanguageNames[code] || code,
        translatedName,
      };
    });

    // Sort languages with current language first, then alphabetically by name
    languageOptions.sort((a, b) => {
      if (a.code === currentLanguage) return -1;
      if (b.code === currentLanguage) return 1;
      return a.name.localeCompare(b.name);
    });

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
