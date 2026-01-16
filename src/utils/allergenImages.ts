import type { ImageSourcePropType } from "react-native";

// Mapping of allergen/marker names to their local asset paths
// This maps the name stored in the database to the actual file in assets/icons/allergens/

// Import all allergen PNG files
const allergenImages: Record<string, ImageSourcePropType> = {
  // Allergens (capitalized)
  Arachide: require("@/assets/icons/allergens/Arachide.png"),
  FruitaCoque: require("@/assets/icons/allergens/FruitaCoque.png"),
  Soja: require("@/assets/icons/allergens/Soja.png"),
  Crustace: require("@/assets/icons/allergens/Crustace.png"),
  Celeri: require("@/assets/icons/allergens/Celeri.png"),
  Gluten: require("@/assets/icons/allergens/Gluten.png"),
  Lupin: require("@/assets/icons/allergens/Lupin.png"),
  Mollusque: require("@/assets/icons/allergens/Mollusque.png"),
  Moutarde: require("@/assets/icons/allergens/Moutarde.png"),
  Oeuf: require("@/assets/icons/allergens/Oeuf.png"),
  Poisson: require("@/assets/icons/allergens/Poisson.png"),
  ProduitLaitier: require("@/assets/icons/allergens/ProduitLaitier.png"),
  Sesame: require("@/assets/icons/allergens/Sesame.png"),
  Sulfites: require("@/assets/icons/allergens/Sulfites.png"),
  vide: require("@/assets/icons/allergens/vide.svg"), // Fallback to SVG if PNG not available
  undefined: require("@/assets/icons/allergens/undefined.svg"), // Fallback to SVG if PNG not available

  // Markers (lowercase)
  ardoise: require("@/assets/icons/allergens/ardoise.png"),
  formule: require("@/assets/icons/allergens/formule.png"),
  vitalite: require("@/assets/icons/allergens/vitalite.png"),
  vegetarien: require("@/assets/icons/allergens/vegetarien.png"),
  bio: require("@/assets/icons/allergens/bio.png"),
  local: require("@/assets/icons/allergens/local.png"),
  saison: require("@/assets/icons/allergens/saison.png"),
  equitable: require("@/assets/icons/allergens/equitable.png"),
  weightWatcher: require("@/assets/icons/allergens/weightWatcher.png"),
  peche: require("@/assets/icons/allergens/peche.png"),
  france: require("@/assets/icons/allergens/france.png"),
};

/**
 * Get the local asset for an allergen/marker by its name or filename
 * @param nameOrFilename - The allergen name (e.g., "ProduitLaitier") or filename (e.g., "ProduitLaitier.svg" or "ProduitLaitier.png")
 * @returns The local asset require() result, or null if not found
 */
export const getAllergenImage = (
  nameOrFilename: string | null | undefined,
): ImageSourcePropType | null => {
  if (!nameOrFilename) return null;

  // Remove .svg or .png extension if present
  const name = nameOrFilename.replace(/\.(svg|png)$/i, "");

  // Try exact match first
  if (allergenImages[name]) {
    return allergenImages[name];
  }

  // Try case-insensitive match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(allergenImages)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  return null;
};
