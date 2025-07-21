import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppStackParamList } from "@/types";
import { useUser } from "@/hooks/account/useUser";
import { FourchettasItemCard } from "./components/FourchettasItemCard";
import { useEffect, useState } from "react";
import { getItemsFromEventId } from "@/api/endpoints/fourchettas";
import { Item } from "@/dto";
import { Text } from "@/components/common/Text";
import { Button } from "@/components/common/Button";

export type FourchettasOrderRouteProp = RouteProp<
  AppStackParamList,
  "FourchettasOrder"
>;

export const FourchettasOrder = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const route = useRoute<FourchettasOrderRouteProp>();
  const { id } = route.params;

  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [dish, setDish] = useState<Item | null>(null);
  const [side, setSide] = useState<Item | null>(null);
  const [drink, setDrink] = useState<Item | null>(null);

  useEffect(() => {
    getItemsFromEventId(
      id,
      setDishes,
      setSides,
      setDrinks,
      () => {},
      () => {},
    );
  }, [id]);

  return (
    <Page title={`Fourchettas Order ID: ${id}`}>
      <View className="flex-col justify-between items-center gap-8 w-full">
        <Text variant="h1" className="text-center text-primary">
          Choisi ton Plat :
        </Text>
        {dishes.map((item) => (
          <FourchettasItemCard
            key={item.id}
            item={item}
            selected={dish?.id === item.id}
            onPress={() => setDish(item)}
          />
        ))}
        <Button label="Suivant" onPress={() => {}} className="w-4/5" />
      </View>
    </Page>
  );
};

export default FourchettasOrder;
