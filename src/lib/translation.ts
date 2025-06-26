import axios from "axios";
import { translationApiKey } from "@/lib/config";

type GoogleTranslateResponse = {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
};

type GoogleSupportedLanguages =
  | "af"
  | "sq"
  | "am"
  | "ar"
  | "hy"
  | "az"
  | "eu"
  | "be"
  | "bn"
  | "bs"
  | "bg"
  | "ca"
  | "ceb"
  | "zh"
  | "co"
  | "hr"
  | "cs"
  | "da"
  | "nl"
  | "en"
  | "eo"
  | "et"
  | "fi"
  | "fr"
  | "fy"
  | "gl"
  | "ka"
  | "de"
  | "el"
  | "gu"
  | "ht"
  | "ha"
  | "haw"
  | "he"
  | "hi"
  | "hmn"
  | "hu"
  | "is"
  | "ig"
  | "id"
  | "ga"
  | "it"
  | "ja"
  | "jv"
  | "kn"
  | "kk"
  | "km"
  | "rw"
  | "ko"
  | "ku"
  | "ky"
  | "lo"
  | "la"
  | "lv"
  | "lt"
  | "lb"
  | "mk"
  | "mg"
  | "ms"
  | "ml"
  | "mt"
  | "mi"
  | "mr"
  | "mn"
  | "my"
  | "ne"
  | "no"
  | "ny"
  | "or"
  | "ps"
  | "fa"
  | "pl"
  | "pt"
  | "pa"
  | "ro"
  | "ru"
  | "sm"
  | "gd"
  | "sr"
  | "st"
  | "sn"
  | "sd"
  | "si"
  | "sk"
  | "sl"
  | "so"
  | "es"
  | "su"
  | "sw"
  | "sv"
  | "tl"
  | "tg"
  | "ta"
  | "tt"
  | "te"
  | "th"
  | "tr"
  | "tk"
  | "uk"
  | "ur"
  | "ug"
  | "uz"
  | "vi"
  | "cy"
  | "xh"
  | "yi"
  | "yo"
  | "zu";

/**
 * Translates text using the Google Translate API
 * @param text The text to translate
 * @param targetLang The target language code (e.g., 'fr' for French)
 * @returns The translated text
 * @throws Error if translation fails
 */
export async function translateText(
  text: string,
  targetLang: GoogleSupportedLanguages,
): Promise<string> {
  if (!translationApiKey) {
    throw new Error(
      "Google Translate API key is not configured. Please add EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY to your .env file",
    );
  }

  try {
    const response = await axios.post<GoogleTranslateResponse>(
      `https://translation.googleapis.com/language/translate/v2?key=${translationApiKey}`, // TODO: replace with the env vars
      {
        q: text,
        target: targetLang,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}

/**
 * Translates multiple texts at once using the Google Translate API
 * @param texts Array of texts to translate
 * @param targetLang The target language code (e.g., 'fr' for French)
 * @returns Array of translated texts
 * @throws Error if translation fails
 */
export async function translateMultipleTexts(
  texts: string[],
  targetLang: GoogleSupportedLanguages,
): Promise<string[]> {
  if (!translationApiKey) {
    throw new Error(
      "Google Translate API key is not configured. Please add EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY to your .env file",
    );
  }

  try {
    const response = await axios.post<GoogleTranslateResponse>(
      `https://translation.googleapis.com/language/translate/v2?key=${translationApiKey}`, // TODO: replace with the env vars
      {
        q: texts,
        target: targetLang,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data.translations.map(
      (translation) => translation.translatedText,
    );
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate texts");
  }
}
