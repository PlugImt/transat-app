import type { MenuData, MenuItem } from "@/types/restaurant";

const TARGET_URL =
  "https://toast-js.ew.r.appspot.com/coteresto?key=1ohdRUdCYo6e71aLuBh7ZfF2lc_uZqp9D78icU4DPufA";
const REGEX = /var loadingData = (\[.*?])/;

const getMenuCategory = (
  pole: string,
  accompagnement: string,
  periode: string,
) => {
  if (accompagnement === "TRUE") {
    return periode === "midi" ? "accompMidi" : "accompSoir";
  }
  switch (pole) {
    case "Grillades / Plats traditions":
      return periode === "midi" ? "grilladesMidi" : "grilladesSoir";
    case "Les Cuistots migrateurs":
      return "migrateurs";
    case "Le Végétarien":
      return "cibo";
    default:
      return null;
  }
};

export async function getRestaurant(): Promise<MenuData | undefined> {
  try {
    const response = await fetch(TARGET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();

    const match = data.match(REGEX);
    if (!match) return;

    const loadingData = match[1];
    const json: MenuItem[] = JSON.parse(loadingData.substring(1));

    const newMenuData: MenuData = {
      grilladesMidi: [],
      migrateurs: [],
      cibo: [],
      accompMidi: [],
      grilladesSoir: [],
      accompSoir: [],
    };

    for (const item of json) {
      const category = getMenuCategory(
        item.pole,
        item.accompagnement,
        item.periode,
      );
      if (category) {
        const menuItem = `${item.nom} ${item.info1}${item.info2}`.trim();
        if (!newMenuData[category].includes(menuItem)) {
          newMenuData[category].push(menuItem);
        }
      }
    }

    return newMenuData;
  } catch (error) {
    console.error("Error fetching the restaurant menu:", error);
    return;
  }
}
