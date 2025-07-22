import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";
import { useRef, useEffect, useState } from "react";
import Animated from "react-native-reanimated";

import { Page } from "@/components/page/Page";
import type { AppStackParamList } from "@/types";
import { useUser } from "@/hooks/account/useUser";
import {
  FourchettasItemCard,
  FourchettasItemCardLoading,
} from "./components/FourchettasItemCard";
import { RecipeOrder } from "./components/RecipeOrder";
import {
  getItemsFromEventId,
  postOrder,
  updateOrderContentByPhoneAndEvent,
} from "@/api/endpoints/fourchettas";
import type { Item } from "@/dto";
import { Text } from "@/components/common/Text";
import { Button } from "@/components/common/Button";
import Steps from "@/components/custom/Steps";
import { phoneWithoutSpaces } from "../../utils/common";

export type FourchettasOrderRouteProp = RouteProp<
  AppStackParamList,
  "FourchettasOrder"
>;

export const FourchettasOrder = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const route = useRoute<FourchettasOrderRouteProp>();
  const { id, orderUser } = route.params;

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [dishId, setDishId] = useState<number | null>(null);
  const [sideId, setSideId] = useState<number>(0);
  const [drinkId, setDrinkId] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [postError, setPostError] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [noDishSelected, setNoDishSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getItemsFromEventId(
      id,
      setDishes,
      setSides,
      setDrinks,
      () => {
        setError(true);
      },
      () => {
        setLoading(false);
      },
    );
  }, [id]);

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
    if (currentPage === 1 && dishId === null) {
      setNoDishSelected(true);
      return;
    }
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
    setPostLoading(true);
    postOrder({
      event_id: id,
      name: user?.last_name || "",
      firstName: user?.first_name || "",
      phone: phoneWithoutSpaces(user?.phone_number),
      dish_id: dishId || 0,
      side_id: sideId || 0,
      drink_id: drinkId || 0,
      onRequestStart() {
        setPostError(false);
      },
      onRequestEnd() {},
      onSuccess() {
        setSuccess(true);
      },
      onError() {
        setPostError(true);
      },
    });
    setPostLoading(false);
  }

  function modifyOrder() {
    setPostLoading(true);
    updateOrderContentByPhoneAndEvent(
      phoneWithoutSpaces(user?.phone_number),
      id,
      dishId || 0,
      sideId,
      drinkId,
      () => {
        setPostError(false);
      },
      () => {},
      () => {
        setPostError(true);
      },
      () => {
        setSuccess(true);
      },
    );
    setPostLoading(false);
  }

  const noSide: Item = {
    id: 0,
    name: t("services.fourchettas.nothing"),
    description: t("services.fourchettas.noSideDesc"),
    price: 0,
    img_url: "",
    type: "side",
    quantity: 0,
    event_id: id,
  };

  const noDrink: Item = {
    id: 0,
    name: t("services.fourchettas.nothing"),
    description: t("services.fourchettas.noDrinkDesc"),
    price: 0,
    img_url: "",
    type: "drink",
    quantity: 0,
    event_id: id,
  };

  if (error) {
    return (
      <Page title={t("services.fourchettas.title")} asChildren>
        <View className="flex flex-col items-center gap-4 h-full justify-center">
          <Image
            source={require("@/assets/images/services/fourchettas_dead.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-center w-3/4" color="primary">
            {t("services.fourchettas.apiError")}
          </Text>
        </View>
      </Page>
    );
  }

  if (success) {
    return (
      <Page title={`Fourchettas Order ID: ${id}`} asChildren>
        <View className="flex-col justify-center items-center h-full gap-8 w-full">
          <Image
            source={require("@/assets/images/services/fourchettas.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text variant="h1">{t("services.fourchettas.orderThanks")}</Text>
          <Text variant="h3">
            {orderUser
              ? t("services.fourchettas.orderModified")
              : t("services.fourchettas.orderSent")}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page title={`Fourchettas Order ID: ${id}`} asChildren>
      <Animated.ScrollView ref={scrollViewRef}>
        <View className="flex-col justify-between items-center gap-8 w-full">
          {currentPage === 1 &&
            (loading ? (
              <>
                <FourchettasItemCardLoading />
                <FourchettasItemCardLoading />
              </>
            ) : (
              <View className="w-full flex flex-col items-center gap-4">
                <Text variant="h1" className="text-center text-primary">
                  {t("services.fourchettas.chooseYourDish")} :
                </Text>
                {dishes.map((item) => (
                  <FourchettasItemCard
                    key={item.id}
                    item={item}
                    selected={dishId === item.id}
                    onPress={() => {
                      setDishId(item.id);
                      if (noDishSelected) {
                        setNoDishSelected(false);
                      }
                    }}
                  />
                ))}
                {noDishSelected && (
                  <Text variant="sm" color="warning">
                    {t("services.fourchettas.noDishSelected")}
                  </Text>
                )}
              </View>
            ))}

          {currentPage === 2 && (
            <View className="w-full flex flex-col items-center gap-4">
              <Text variant="h1" className="text-center text-primary">
                {t("services.fourchettas.chooseYourSide")} :
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
                {t("services.fourchettas.chooseYourDrink")} :
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
              <Text
                variant="sm"
                color="warning"
                className={`-m-2 ${postError ? "" : "invisible"}`}
              >
                {t("services.fourchettas.orderFailed")}
              </Text>
              <Text
                variant="sm"
                color="warning"
                className={`-m-2 ${postLoading ? "" : "invisible"}`}
              >
                {t("services.fourchettas.ordering")}
              </Text>
              <Button
                label={
                  orderUser
                    ? `${t("services.fourchettas.modifyOrder")}!!`
                    : `${t("services.fourchettas.order")}!!`
                }
                onPress={orderUser ? modifyOrder : order}
                className="w-2/3"
                disabled={postLoading}
              />
            </>
          )}

          <View className="flex-row justify-center items-center w-full gap-4">
            <Button
              label="Précédent"
              onPress={previousPage}
              className="w-1/3"
              disabled={currentPage === 1 || postLoading}
              variant="secondary"
            />
            <Button
              label="Suivant"
              onPress={nextPage}
              disabled={currentPage === 4 || loading || noDishSelected}
              className="w-1/3"
            />
          </View>

          <Steps
            steps={[
              { title: t("services.fourchettas.StepShortDish") },
              { title: t("services.fourchettas.StepShortSide") },
              { title: t("services.fourchettas.StepShortDrink") },
              { title: t("services.fourchettas.StepShortReciept") },
            ]}
            currentStep={currentPage}
          />
        </View>
      </Animated.ScrollView>
    </Page>
  );
};

export default FourchettasOrder;
