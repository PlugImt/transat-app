import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";

import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Item, Type } from "@/dto";
import { useUser } from "@/hooks/account/useUser";

interface RecipeProps {
  orderedItems: { id: number; ordered_quantity: number }[];
  itemsMap: Map<number, Item>;
  types: Type[];
}

const RecipeOrder = ({ orderedItems, itemsMap, types }: RecipeProps) => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const totalPrice = orderedItems.reduce((total, item) => {
    const itemData = itemsMap.get(item.id);
    return total + (itemData ? itemData.price * item.ordered_quantity : 0);
  }, 0);

  const typesMap = useMemo(() => {
    const map = new Map<string, Type>();
    types.forEach((type) => {
      map.set(type.name, type);
    });
    return map;
  }, [types]);

  const sortedOrderedItems = useMemo(() => {
    return orderedItems.sort(
      (a, b) =>
        (typesMap.get(itemsMap.get(a.id)?.type ?? "")?.order_index || 0) -
        (typesMap.get(itemsMap.get(b.id)?.type ?? "")?.order_index || 0),
    );
  }, [orderedItems, itemsMap, typesMap]);

  return (
    <View className="w-full flex flex-col items-center gap-4">
      <Text variant="h2" className="text-center text-primary mb-3">
        {t("services.fourchettas.recieptTitle")}{" "}
        <Text variant="h2" color={"primary"}>
          Fourchettas
        </Text>
      </Text>

      <Card className="p-4 w-full max-w-sm">
        <Text variant="h2" className="text-xl text-center mb-4">
          {t("services.fourchettas.orderOf")}{" "}
          <Text variant="h2" color={"primary"}>
            {user?.first_name}
            {user?.last_name}
          </Text>
        </Text>

        <View className="w-full">
          <View className="flex-row border-b border-border pb-2 mb-2">
            <Text variant="h3" className="flex-1 font-semibold">
              {t("services.fourchettas.article")}
            </Text>
            <Text variant="h3" className="w-20 text-center font-semibold">
              {t("services.fourchettas.quantity")}
            </Text>
            <Text variant="h3" className="w-16 text-right font-semibold">
              {t("services.fourchettas.price")}
            </Text>
          </View>

          {sortedOrderedItems.map((item) => (
            <View
              key={item.id}
              className="flex-row py-2 border-b border-border/50"
            >
              <Text variant="h3" className="flex-1">
                {itemsMap.get(item.id)?.name}
              </Text>
              <Text variant="h3" className="w-20 text-center">
                {item.ordered_quantity * (itemsMap.get(item.id)?.quantity || 0)}
              </Text>
              <Text variant="h3" className="w-16 text-right">
                {(itemsMap.get(item.id)?.price || 0) * item.ordered_quantity} €
              </Text>
            </View>
          ))}

          <View className="flex-row py-3 mt-2">
            <Text variant="h3" className="flex-1 font-bold">
              {t("services.fourchettas.total")}
            </Text>
            <Text variant="h3" className="w-20 text-center">
              {totalPrice.toFixed(2)}€
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export { RecipeOrder };
