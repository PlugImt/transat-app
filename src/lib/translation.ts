import axios from "axios";

// DeepL API types
type DeepLTranslationResponse = {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
};

type DeepLSupportedLanguages =
  | "BG"
  | "CS"
  | "DA"
  | "DE"
  | "EL"
  | "EN"
  | "ES"
  | "ET"
  | "FI"
  | "FR"
  | "HU"
  | "ID"
  | "IT"
  | "JA"
  | "KO"
  | "LT"
  | "LV"
  | "NB"
  | "NL"
  | "PL"
  | "PT"
  | "RO"
  | "RU"
  | "SK"
  | "SL"
  | "SV"
  | "TR"
  | "UK"
  | "ZH";

/**
 * Translates text using the DeepL API
 * @param text The text to translate
 * @param targetLang The target language code (e.g., 'FR' for French)
 * @returns The translated text
 * @throws Error if translation fails
 */
export async function translateText(
  text: string,
  targetLang: DeepLSupportedLanguages,
): Promise<string> {
  // if (!deeplApiKey) {
  //     throw new Error('DeepL API key is not configured. Please add EXPO_PUBLIC_DEEPL_API_KEY to your .env file');
  // }

  try {
    const response = await axios.post<DeepLTranslationResponse>(
      "https://api-free.deepl.com/v2/translate",
      {
        text: [text],
        target_lang: targetLang,
      },
      {
        headers: {
          Authorization:
            "DeepL-Auth-Key bfa3426d-b9c2-4cc7-b0a8-e0868309f91e:fx", // TODO: use env variable
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}

/**
 * Translates multiple texts at once using the DeepL API
 * @param texts Array of texts to translate
 * @param targetLang The target language code (e.g., 'FR' for French)
 * @returns Array of translated texts
 * @throws Error if translation fails
 */
export async function translateMultipleTexts(
  texts: string[],
  targetLang: DeepLSupportedLanguages,
): Promise<string[]> {
  const DEEPL_API_KEY = process.env.EXPO_PUBLIC_DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    throw new Error(
      "DeepL API key is not configured. Please add EXPO_PUBLIC_DEEPL_API_KEY to your .env file",
    );
  }

  try {
    const response = await axios.post<DeepLTranslationResponse>(
      "https://api-free.deepl.com/v2/translate",
      {
        text: texts,
        target_lang: targetLang,
      },
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.translations.map((translation) => translation.text);
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate texts");
  }
}
