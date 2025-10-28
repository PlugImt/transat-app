import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import Animated from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import Steps from "@/components/custom/Steps";
import { Page } from "@/components/page/Page";
import type { Item, OrderedItem } from "@/dto";
import { useUser } from "@/hooks/account/useUser";
import {
  useItemsFromEventId,
  usePostOrder,
  useTypesFromEventId,
  useUpdateOrder,
} from "@/hooks/services/fourchettas/useFourchettas";
import type { BottomTabParamList } from "@/types";
import { phoneWithoutSpaces } from "../../utils/common";
import {
  FourchettasItemCard,
  FourchettasItemCardLoading,
} from "./components/FourchettasItemCard";
import { RecipeOrder } from "./components/RecipeOrder";

export type FourchettasOrderRouteProp = RouteProp<
  BottomTabParamList,
  "FourchettasOrder"
>;

export const FourchettasOrder = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const route = useRoute<FourchettasOrderRouteProp>();
  const { id, orderUser } = route.params;

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const { data: items = [], isLoading, isError } = useItemsFromEventId(id);
  const { data: types = [] } = useTypesFromEventId(id);

  const itemsMap = useMemo(() => {
    const map = new Map<number, Item>();
    items.forEach((item) => {
      map.set(item.id, item);
    });
    return map;
  }, [items]);

  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>([]);
  const [noDishSelected, setNoDishSelected] = useState(false);

  const [success, setSuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (orderUser) {
      setOrderedItems(orderUser);
      console.log("Pre-filling order with existing order data:", orderUser);
    }
  }, [orderUser]);

  console.log("Ordered Items:", orderedItems);

  function scrollToTop() {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 10);
  }

  function nextPage() {
    if (currentPage < nbPages && types[currentPage - 1].is_required) {
      if (
        !orderedItems.find((oi) => {
          const item = itemsMap.get(oi.id);
          return item?.type === types[currentPage - 1].name;
        })
      ) {
        setNoDishSelected(true);
        return;
      }
    }
    if (currentPage < nbPages) {
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

  const nbPages = types.length + 1;

  const phone = phoneWithoutSpaces(user?.phone_number);
  const postOrderMut = usePostOrder(phone);
  const updateOrderMut = useUpdateOrder(phone);

  const postLoading = postOrderMut.isPending || updateOrderMut.isPending;
  const postError = postOrderMut.isError || updateOrderMut.isError;

  function order() {
    if (orderedItems.length === 0) return;
    postOrderMut.mutate(
      {
        event_id: id,
        name: user?.last_name || "",
        firstname: user?.first_name || "",
        phone,
        items: orderedItems,
      },
      {
        onSuccess: () => setSuccess(true),
      },
    );
  }

  function modifyOrder() {
    if (orderedItems.length === 0) return;
    updateOrderMut.mutate(
      {
        phone,
        event_id: id,
        items: orderedItems,
      },
      {
        onSuccess: () => setSuccess(true),
      },
    );
  }

  function handleItemPress(itemId: number) {
    setNoDishSelected(false);
    const item = itemsMap.get(itemId);
    if (!item) return;
    if (orderedItems.find((oi) => oi.id === itemId)) {
      setOrderedItems(orderedItems.filter((oi) => oi.id !== itemId));
    } else {
      setOrderedItems([...orderedItems, { id: itemId, ordered_quantity: 1 }]);
    }
  }

  function handleChangeOrderedQuantity(itemId: number, toAdd: 1 | -1) {
    setNoDishSelected(false);
    setOrderedItems((prevOrderedItems) => {
      const updatedItems = prevOrderedItems
        .map((oi) => {
          if (oi.id === itemId) {
            const newQuantity = oi.ordered_quantity + toAdd;
            if (newQuantity > 0) {
              return {
                id: itemId,
                ordered_quantity: newQuantity,
              };
            }
            return "toDelete";
          }
          return oi;
        })
        .filter(
          (oi): oi is { id: number; ordered_quantity: number } =>
            oi !== "toDelete",
        );
      return updatedItems;
    });
  }
  if (isError) {
    return (
      <Page title={t("services.fourchettas.orderTitle")}>
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
      <Page title={t("services.fourchettas.orderTitle")}>
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
    <Page title={t("services.fourchettas.orderTitle")} asChildren>
      <Animated.ScrollView ref={scrollViewRef}>
        <View className="flex-col justify-between items-center gap-8 w-full">
          {currentPage < nbPages &&
            (isLoading ? (
              <>
                <FourchettasItemCardLoading />
                <FourchettasItemCardLoading />
              </>
            ) : (
              <View className="w-full flex flex-col items-center gap-4">
                <Text variant="h1" className="text-center text-primary">
                  {t("services.fourchettas.chooseYourItem") +
                    types[currentPage - 1].name}{" "}
                  :
                </Text>
                {items
                  .filter((item) => item.type === types[currentPage - 1].name)
                  .map((item) => (
                    <FourchettasItemCard
                      key={item.id}
                      item={item}
                      selected={orderedItems.some((oi) => oi.id === item.id)}
                      onPress={() => handleItemPress(item.id)}
                      orderedQuantity={
                        orderedItems.find((oi) => oi.id === item.id)
                          ?.ordered_quantity || 0
                      }
                      onChangeOrderedQuantity={(number: 1 | -1) =>
                        handleChangeOrderedQuantity(item.id, number)
                      }
                    />
                  ))}
                {noDishSelected && (
                  <Text variant="sm" color="warning">
                    {t("services.noItemSelected") + types[currentPage - 1].name}
                  </Text>
                )}
              </View>
            ))}

          {currentPage === nbPages && (
            <>
              <RecipeOrder
                orderedItems={orderedItems}
                itemsMap={itemsMap}
                types={types}
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
                    ? `${t("services.fourchettas.modifyOrderButton")}!!`
                    : `${t("services.fourchettas.orderButton")}!!`
                }
                onPress={orderUser ? modifyOrder : order}
                className="w-2/3"
                disabled={postLoading}
              />
            </>
          )}

          <View className="flex-row justify-center items-center w-full gap-4">
            <Button
              label={t("services.fourchettas.previous")}
              onPress={previousPage}
              className="w-1/3"
              disabled={currentPage === 1 || postLoading}
              variant="secondary"
            />
            <Button
              label={t("services.fourchettas.next")}
              onPress={nextPage}
              disabled={currentPage === nbPages || isLoading || noDishSelected}
              className="w-1/3"
            />
          </View>

          <Steps
            steps={types
              .map((type) => ({ title: type.name }))
              .concat({ title: t("services.fourchettas.StepShortReciept") })}
            currentStep={currentPage}
          />
        </View>
      </Animated.ScrollView>
    </Page>
  );
};

export default FourchettasOrder;
