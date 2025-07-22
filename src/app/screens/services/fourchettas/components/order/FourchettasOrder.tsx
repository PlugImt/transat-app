import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";
import { useRef, useEffect, useState } from "react";
import Animated from "react-native-reanimated";

import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppStackParamList } from "@/types";
import { useUser } from "@/hooks/account/useUser";
import { FourchettasItemCard } from "./components/FourchettasItemCard";
import { RecipeOrder } from "./components/RecipeOrder";
import { getItemsFromEventId, postOrder } from "@/api/endpoints/fourchettas";
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
  const { id, orderUser } = route.params;
  console.log("FourchettasOrder ID:", id, "Order User:", orderUser);

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [dishId, setDishId] = useState<number | null>(null);
  const [sideId, setSideId] = useState<number>(0);
  const [drinkId, setDrinkId] = useState<number>(0);

  const [success, setSuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (orderUser) {
      setDishId(orderUser.dish_id);
      setSideId(orderUser.side_id || 0);
      setDrinkId(orderUser.drink_id || 0);
    }
  }, [orderUser]);

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

  function order() {
    postOrder({
      event_id: id,
      name: user?.last_name || "",
      firstName: user?.first_name || "",
      phone: user?.phone_number || "",
      dish_id: dishId || 0,
      side_id: sideId,
      drink_id: drinkId,
      onRequestStart() {
        console.log("Placing order...");
      },
      onRequestEnd() {},
      onSuccess() {
        setSuccess(true);
      },
      onError() {},
    });
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

  if (success) {
    return (
      <Page title={`Fourchettas Order ID: ${id}`} asChildren>
        <View className="flex-col justify-center items-center h-full gap-8 w-full">
          <Image
            source={require("@/assets/images/services/fourchettas.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text variant="h1">Merci pour votre commande !!</Text>
          <Text variant="h3">
            {orderUser
              ? "Commande modifiée avec succès !"
              : "Commande passée avec succès !"}
          </Text>
        </View>
      </Page>
    );
  }

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
            <>
              <RecipeOrder
                dish={dishes.find((d) => d.id === dishId) || null}
                side={sides.find((s) => s.id === sideId) || noSide}
                drink={drinks.find((d) => d.id === drinkId) || noDrink}
              />
              <Button
                label={orderUser ? "Modifier la commande !!" : "Commander !!"}
                onPress={order}
                className="w-2/3"
              />
            </>
          )}

          <View className="flex-row justify-center items-center w-full gap-4">
            <Button
              label="Précédent"
              onPress={previousPage}
              className="w-1/3"
              disabled={currentPage === 1}
              variant="secondary"
            />
            <Button
              label="Suivant"
              onPress={nextPage}
              disabled={currentPage === 4}
              className="w-1/3"
            />
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
