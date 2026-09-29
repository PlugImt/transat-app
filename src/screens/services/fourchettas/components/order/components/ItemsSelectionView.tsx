import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import type { FourchettasItem, OrderedItem } from "@/dto";
import { filterItemsByType, getOrderedQuantity } from "../utils/orderUtils";
import { FourchettasItemCard } from "./FourchettasItemCard";

interface ItemsSelectionViewProps {
  items: FourchettasItem[];
  types: Array<{ name: string }>;
  currentPage: number;
  orderedItems: OrderedItem[];
  onChangeOrderedQuantity: (itemId: number, delta: 1 | -1) => void;
  showWarning: boolean;
}

export const ItemsSelectionView = ({
  items,
  types,
  currentPage,
  orderedItems,
  onChangeOrderedQuantity,
  showWarning,
}: ItemsSelectionViewProps) => {
  const { t } = useTranslation();
  const currentType = types[currentPage - 1];
  const filteredItems = filterItemsByType(items, currentType.name);

  return (
    <View className="w-full items-center gap-4">
      <Text variant="h2" className="text-center text-primary">
        {t("services.fourchettas.chooseYourItem") +
          currentType.name.toLocaleLowerCase()}
      </Text>
      {filteredItems.map((item) => (
        <FourchettasItemCard
          key={item.id}
          item={item}
          orderedQuantity={getOrderedQuantity(orderedItems, item.id)}
          onChangeOrderedQuantity={(delta) =>
            onChangeOrderedQuantity(item.id, delta)
          }
        />
      ))}
      {showWarning && (
        <Text color="destructive">
          {t("services.fourchettas.noItemSelected") +
            currentType.name.toLowerCase()}
        </Text>
      )}
    </View>
  );
};
