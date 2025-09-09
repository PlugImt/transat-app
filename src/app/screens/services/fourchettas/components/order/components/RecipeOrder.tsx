import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { useUser } from "@/hooks/account/useUser";
import { useTheme } from "@/contexts/ThemeContext";

import { Text } from "@/components/common/Text";
import type { Item } from "@/dto";
import Card from "@/components/common/Card";
interface RecipeProps {
  dish: Item | null;
  side: Item;
  drink: Item;
}

const RecipeOrder = ({ dish, side, drink }: RecipeProps) => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (typeof dish?.price === "string") {
    dish.price = Number.parseFloat(dish.price);
  }
  if (typeof side?.price === "string") {
    side.price = Number.parseFloat(side.price);
  }
  if (typeof drink?.price === "string") {
    drink.price = Number.parseFloat(drink.price);
  }

  return (
    <View className="w-full flex flex-col items-center gap-4">
      <Text variant="h1" className="text-center text-primary mb-3">
        {t("services.fourchettas.recieptTitle")}{" "}
        <Text variant="h1" color={"primary"}>
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

          {dish && (
            <View className="flex-row py-2 border-b border-border/50">
              <Text variant="h3" className="flex-1">
                {dish.name}
              </Text>
              <Text variant="h3" className="w-20 text-center">
                {dish.quantity}
              </Text>
              <Text variant="h3" className="w-16 text-right">
                {dish.price} €
              </Text>
            </View>
          )}

          {side && side.id > 0 && (
            <View className="flex-row py-2 border-b border-border/50">
              <Text variant="h3" className="flex-1">
                {side.name}
              </Text>
              <Text variant="h3" className="w-20 text-center">
                {side.quantity}
              </Text>
              <Text variant="h3" className="w-16 text-right">
                {side.price} €
              </Text>
            </View>
          )}

          {drink && drink.id > 0 && (
            <View className="flex-row py-2 border-b border-border/50">
              <Text variant="h3" className="flex-1">
                {drink.name}
              </Text>
              <Text variant="h3" className="w-20 text-center">
                {drink.quantity}
              </Text>
              <Text variant="h3" className="w-16 text-right">
                {drink.price} €
              </Text>
            </View>
          )}

          <View className="flex-row py-3 mt-2">
            <Text variant="h3" className="flex-1 font-bold">
              {t("services.fourchettas.total")}
            </Text>
            <Text variant="h3" className="w-20 text-center">
              {(
                (dish?.price || 0) +
                (side?.price || 0) +
                (drink?.price || 0)
              ).toFixed(2)}
              €
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export { RecipeOrder };
