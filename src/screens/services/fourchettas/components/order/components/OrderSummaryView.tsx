import { useTranslation } from "react-i18next";
import { Text } from "@/components/common/Text";
import type { FourchettasItem, OrderedItem } from "@/dto";
import type { FourchettasType } from "@/dto/fourchettas";
import { RecipeOrder } from "./RecipeOrder";

interface OrderSummaryViewProps {
  orderedItems: OrderedItem[];
  itemsMap: Map<number, FourchettasItem>;
  types: FourchettasType[];
  hasError: boolean;
}

export const OrderSummaryView = ({
  orderedItems,
  itemsMap,
  types,
  hasError,
}: OrderSummaryViewProps) => {
  const { t } = useTranslation();

  return (
    <>
      <RecipeOrder
        orderedItems={orderedItems}
        itemsMap={itemsMap}
        types={types}
      />
      {hasError && (
        <Text color="destructive">{t("services.fourchettas.orderFailed")}</Text>
      )}
    </>
  );
};
