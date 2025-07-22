import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useRef, useEffect, useState } from "react";
import Animated from "react-native-reanimated";

import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppStackParamList } from "@/types";
import { useUser } from "@/hooks/account/useUser";
import { FourchettasItemCard } from "./components/FourchettasItemCard";
import { getItemsFromEventId } from "@/api/endpoints/fourchettas";
import { Item } from "@/dto";
import { Text } from "@/components/common/Text";
import { Button } from "@/components/common/Button";
import Steps from "@/components/custom/Steps";

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

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [dishId, setDishId] = useState<number | null>(null);
  const [sideId, setSideId] = useState<number>(0);
  const [drinkId, setDrinkId] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);

  function scrollToTop() {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 10);
  }

  function nextPage() {
    if (currentPage < 4) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  }
  function previousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  }

  const noSide: Item = {
    id: 0,
    name: "Rien",
    description: "J'ai une petite faim aujourd'hui",
    price: 0,
    img_url: "",
    type: "side",
    quantity: 0,
    event_id: id,
  };

  const noDrink: Item = {
    id: 0,
    name: "Rien",
    description: "Je ne veux pas de boisson aujourd'hui",
    price: 0,
    img_url: "",
    type: "drink",
    quantity: 0,
    event_id: id,
  };

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
    <Page title={`Fourchettas Order ID: ${id}`} asChildren>
      <Animated.ScrollView ref={scrollViewRef}>
        <View className="flex-col justify-between items-center gap-8 w-full">
          {currentPage === 1 && (
            <View className="w-full flex flex-col items-center gap-4">
              <Text variant="h1" className="text-center text-primary">
                Choisi ton Plat :
              </Text>
              {dishes.map((item) => (
                <FourchettasItemCard
                  key={item.id}
                  item={item}
                  selected={dishId === item.id}
                  onPress={() => setDishId(item.id)}
                />
              ))}
            </View>
          )}
          {currentPage === 2 && (
            <View className="w-full flex flex-col items-center gap-4">
              <Text variant="h1" className="text-center text-primary">
                Choisi ton Accompagnement :
              </Text>
              <FourchettasItemCard
                item={noSide}
                selected={sideId === noSide.id}
                onPress={() => setSideId(noSide.id)}
              />

              {sides.map((item) => (
                <FourchettasItemCard
                  key={item.id}
                  item={item}
                  selected={sideId === item.id}
                  onPress={() => setSideId(item.id)}
                />
              ))}
            </View>
          )}
          {currentPage === 3 && (
            <View className="w-full flex flex-col items-center gap-4">
              <Text variant="h1" className="text-center text-primary">
                Choisi ta Boisson :
              </Text>
              <FourchettasItemCard
                item={noDrink}
                selected={drinkId === noDrink.id}
                onPress={() => setDrinkId(noDrink.id)}
              />

              {drinks.map((item) => (
                <FourchettasItemCard
                  key={item.id}
                  item={item}
                  selected={drinkId === item.id}
                  onPress={() => setDrinkId(item.id)}
                />
              ))}
            </View>
          )}
          {currentPage === 4 && (
            <View className="w-full flex flex-col items-center gap-4">
              <Text variant="h1" className="text-center text-primary">
                Résumé de ta Commande :
              </Text>
            </View>
          )}

          <View className="flex-row justify-center items-center w-full gap-4">
            <Button
              label="Précédent"
              onPress={previousPage}
              className="w-1/3"
              disabled={currentPage === 1}
              variant="secondary"
            />
            <Button label="Suivant" onPress={nextPage} className="w-1/3" />
          </View>
          <Steps
            steps={[
              { title: "Plat" },
              { title: "Extras" },
              { title: "Boisson" },
              { title: "Résumé" },
            ]}
            currentStep={currentPage}
          />
        </View>
      </Animated.ScrollView>
    </Page>
  );
};

export default FourchettasOrder;
