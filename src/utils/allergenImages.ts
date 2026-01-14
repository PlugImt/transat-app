// Mapping of allergen/marker names to their local asset paths
// This maps the name stored in the database to the actual file in assets/icons/allergens/

// Import all allergen SVG files
const allergenImages: Record<string, any> = {
  // Allergens (capitalized)
  Arachide: require("@/assets/icons/allergens/Arachide.svg"),
  FruitaCoque: require("@/assets/icons/allergens/FruitaCoque.svg"),
  Soja: require("@/assets/icons/allergens/Soja.svg"),
  Crustace: require("@/assets/icons/allergens/Crustace.svg"),
  Celeri: require("@/assets/icons/allergens/Celeri.svg"),
  Gluten: require("@/assets/icons/allergens/Gluten.svg"),
  Lupin: require("@/assets/icons/allergens/Lupin.svg"),
  Mollusque: require("@/assets/icons/allergens/Mollusque.svg"),
  Moutarde: require("@/assets/icons/allergens/Moutarde.svg"),
  Oeuf: require("@/assets/icons/allergens/Oeuf.svg"),
  Poisson: require("@/assets/icons/allergens/Poisson.svg"),
  ProduitLaitier: require("@/assets/icons/allergens/ProduitLaitier.svg"),
  Sesame: require("@/assets/icons/allergens/Sesame.svg"),
  Sulfites: require("@/assets/icons/allergens/Sulfites.svg"),
  vide: require("@/assets/icons/allergens/vide.svg"),
  undefined: require("@/assets/icons/allergens/undefined.svg"),
  
  // Markers (lowercase)
  ardoise: require("@/assets/icons/allergens/ardoise.svg"),
  formule: require("@/assets/icons/allergens/formule.svg"),
  vitalite: require("@/assets/icons/allergens/vitalite.svg"),
  vegetarien: require("@/assets/icons/allergens/vegetarien.svg"),
  bio: require("@/assets/icons/allergens/bio.svg"),
  local: require("@/assets/icons/allergens/local.svg"),
  saison: require("@/assets/icons/allergens/saison.svg"),
  equitable: require("@/assets/icons/allergens/equitable.svg"),
  weightWatcher: require("@/assets/icons/allergens/weightWatcher.svg"),
  peche: require("@/assets/icons/allergens/peche.svg"),
  france: require("@/assets/icons/allergens/france.svg"),
};

/**
 * Get the local asset for an allergen/marker by its name or filename
 * @param nameOrFilename - The allergen name (e.g., "ProduitLaitier") or filename (e.g., "ProduitLaitier.svg")
 * @returns The local asset require() result, or null if not found
 */
export const getAllergenImage = (
  nameOrFilename: string | null | undefined,
): any => {
  if (!nameOrFilename) return null;

  // Remove .svg extension if present
  const name = nameOrFilename.replace(/\.svg$/i, "");

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
