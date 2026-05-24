import type { FourchettasItem, OrderedItem } from "@/dto";

/**
 * Crée une Map pour accéder rapidement aux items par leur ID
 */
export const createItemsMap = (
  items: FourchettasItem[],
): Map<number, FourchettasItem> => {
  const map = new Map<number, FourchettasItem>();
  items.forEach((item) => {
    map.set(item.id, item);
  });
  return map;
};

/**
 * Trouve un item commandé par son ID
 */
export const findOrderedItem = (
  orderedItems: OrderedItem[],
  itemId: number,
): OrderedItem | undefined => {
  return orderedItems.find((oi) => oi.id === itemId);
};

/**
 * Obtient la quantité commandée d'un item
 */
export const getOrderedQuantity = (
  orderedItems: OrderedItem[],
  itemId: number,
): number => {
  return findOrderedItem(orderedItems, itemId)?.ordered_quantity || 0;
};

/**
 * Met à jour la quantité d'un item commandé
 */
export const updateOrderedQuantity = (
  orderedItems: OrderedItem[],
  itemId: number,
  delta: 1 | -1,
): OrderedItem[] => {
  const existingItem = findOrderedItem(orderedItems, itemId);

  // Ajouter un nouvel item si on incrémente et qu'il n'existe pas
  if (!existingItem && delta === 1) {
    return [...orderedItems, { id: itemId, ordered_quantity: 1 }];
  }

  // Mettre à jour ou supprimer un item existant
  if (existingItem) {
    const newQuantity = existingItem.ordered_quantity + delta;

    if (newQuantity > 0) {
      return orderedItems.map((oi) =>
        oi.id === itemId ? { id: itemId, ordered_quantity: newQuantity } : oi,
      );
    }

    // Supprimer l'item si la quantité devient 0
    return orderedItems.filter((oi) => oi.id !== itemId);
  }

  return orderedItems;
};

/**
 * Vérifie si un type requis a au moins un item sélectionné
 */
export const hasRequiredTypeSelected = (
  orderedItems: OrderedItem[],
  itemsMap: Map<number, FourchettasItem>,
  typeName: string,
): boolean => {
  return orderedItems.some((oi) => {
    const item = itemsMap.get(oi.id);
    return item?.type === typeName;
  });
};

/**
 * Filtre les items par type
 */
export const filterItemsByType = (
  items: FourchettasItem[],
  typeName: string,
): FourchettasItem[] => {
  return items.filter((item) => item.type === typeName);
};
