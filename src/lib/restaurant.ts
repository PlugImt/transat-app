import i18n from "@/i18n";
import { translateMultipleTexts } from "@/lib/translation";
import type { MenuData } from "@/types/restaurant";
import { apiRequest } from "./apiRequest";

const TARGET_URL = "/api/restaurant";

export async function getRestaurant(): Promise<MenuData> {
  try {
    const currentLanguage = i18n.language.toLowerCase();
    const menu: MenuData = await apiRequest<MenuData>(TARGET_URL);

    if (currentLanguage !== "fr") {
      // Translate each category in the menu with fallback to original text
      const [
        translatedAccompMidi,
        translatedGrilladesMidi,
        translatedAccompSoir,
        translatedGrilladesSoir,
        translatedCibo,
        translatedMigrateurs,
      ] = await Promise.all([
        translateMultipleTexts(
          menu.accompMidi,
          // biome-ignore lint/suspicious/noExplicitAny: type SupportedLanguages which is string
          currentLanguage.toLocaleLowerCase() as any,
        ),
        translateMultipleTexts(
          menu.grilladesMidi,
          // biome-ignore lint/suspicious/noExplicitAny: type SupportedLanguages which is string
          currentLanguage.toLocaleLowerCase() as any,
        ),
        translateMultipleTexts(
          menu.accompSoir,
          // biome-ignore lint/suspicious/noExplicitAny: type SupportedLanguages which is string
          currentLanguage.toLocaleLowerCase() as any,
        ),
        translateMultipleTexts(
          menu.grilladesSoir,
          // biome-ignore lint/suspicious/noExplicitAny: type SupportedLanguages which is string
          currentLanguage.toLocaleLowerCase() as any,
        ),
        translateMultipleTexts(
          menu.cibo,
          // biome-ignore lint/suspicious/noExplicitAny: type SupportedLanguages which is string
          currentLanguage.toLocaleLowerCase() as any,
        ),
        translateMultipleTexts(
          menu.migrateurs,
          // biome-ignore lint/suspicious/noExplicitAny: type SupportedLanguages which is string
          currentLanguage.toLocaleLowerCase() as any,
        ),
      ]);

      return {
        ...menu,
        accompMidi: translatedAccompMidi,
        grilladesMidi: translatedGrilladesMidi,
        accompSoir: translatedAccompSoir,
        grilladesSoir: translatedGrilladesSoir,
        cibo: translatedCibo,
        migrateurs: translatedMigrateurs,
      };
    }

    return menu;
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    // Return a default menu structure to prevent undefined errors
    return {
      accompMidi: [],
      grilladesMidi: [],
      accompSoir: [],
      grilladesSoir: [],
      cibo: [],
      migrateurs: [],
      updated_date: new Date().toISOString(),
    };
  }
}
