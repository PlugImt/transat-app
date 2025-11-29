import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type Animated from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import Steps from "@/components/custom/Steps";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import type { OrderedItem } from "@/dto";
import { useUser } from "@/hooks/account/useUser";
import {
  useItemsFromEventId,
  usePostOrder,
  useTypesFromEventId,
  useUpdateOrder,
} from "@/hooks/services/fourchettas/useFourchettas";
import type { BottomTabParamList } from "@/types";
import { phoneWithoutSpaces } from "../../utils/common";
import { FourchettasItemCardLoading } from "./components/FourchettasItemCard";
import { ItemsSelectionView } from "./components/ItemsSelectionView";
import { OrderSummaryView } from "./components/OrderSummaryView";
import { SuccessScreen } from "./components/SuccessScreen";
import {
  createItemsMap,
  hasRequiredTypeSelected,
  updateOrderedQuantity as updateOrderedQuantityUtil,
} from "./utils/orderUtils";

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

  const phone = phoneWithoutSpaces(user?.phone_number);
  const postOrderMut = usePostOrder(phone);
  const updateOrderMut = useUpdateOrder(phone);

  const {
    data: items = [],
    isLoading: isItemsLoading,
    isError: isItemsError,
    refetch: refetchItems,
    isRefetching: isItemsRefetching,
  } = useItemsFromEventId(id);
  const {
    data: types = [],
    isLoading: isTypesLoading,
    isError: isTypesError,
    refetch: refetchTypes,
    isRefetching: isTypesRefetching,
  } = useTypesFromEventId(id);

  const isLoading = isItemsLoading || isTypesLoading;
  const isError = isItemsError || isTypesError;
  const [noDishSelected, setNoDishSelected] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const isPending = postOrderMut.isPending || updateOrderMut.isPending;
  const hasError = postOrderMut.isError || updateOrderMut.isError;
  const hasOrdered = orderUser != null;
  const totalPages = isLoading ? 4 : types.length + 1;
  const isLastPage = currentPage === totalPages;

  const itemsMap = useMemo(() => createItemsMap(items), [items]);
  const steps = useMemo(
    () =>
      types
        .map((type) => ({ title: type.name }))
        .concat({ title: t("services.fourchettas.StepShortReceipt") }),
    [types, t],
  );

  useEffect(() => {
    if (orderUser) {
      setOrderedItems(orderUser);
    }
  }, [orderUser]);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleNextPage = () => {
    const currentType = types[currentPage - 1];
    const isRequiredType = currentType?.is_required;

    if (
      isRequiredType &&
      !hasRequiredTypeSelected(orderedItems, itemsMap, currentType.name)
    ) {
      setNoDishSelected(true);
      return;
    }

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setNoDishSelected(false);
      scrollToTop();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setNoDishSelected(false);
      scrollToTop();
    }
  };

  const handleChangeOrderedQuantity = (itemId: number, delta: 1 | -1) => {
    setNoDishSelected(false);
    setOrderedItems((prev) => updateOrderedQuantityUtil(prev, itemId, delta));
  };

  const handleOrder = () => {
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
  };

  const handleModifyOrder = () => {
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
  };

  if (isError) {
    return (
      <ErrorPage
        title={t("services.fourchettas.orderTitle")}
        error={new Error(t("services.fourchettas.apiError"))}
        refetch={() => {
          refetchItems();
          refetchTypes();
        }}
        isRefetching={isItemsRefetching || isTypesRefetching}
      />
    );
  }

  if (success) {
    return <SuccessScreen hasOrdered={hasOrdered} />;
  }

  return (
    <Page title={t("services.fourchettas.orderTitle")}>
      <View className="justify-between items-center gap-8">
        {!isLastPage &&
          (isLoading ? (
            <>
              <FourchettasItemCardLoading />
              <FourchettasItemCardLoading />
            </>
          ) : (
            <ItemsSelectionView
              items={items}
              types={types}
              currentPage={currentPage}
              orderedItems={orderedItems}
              onChangeOrderedQuantity={handleChangeOrderedQuantity}
              showWarning={noDishSelected}
            />
          ))}

        {isLastPage && (
          <OrderSummaryView
            orderedItems={orderedItems}
            itemsMap={itemsMap}
            types={types}
            hasError={hasError}
          />
        )}

        <View className="flex-row justify-center items-center gap-4 flex-1">
          {currentPage > 1 && (
            <Button
              label={t("services.fourchettas.previous")}
              onPress={handlePreviousPage}
              disabled={currentPage === 1 || isPending}
              variant="secondary"
              className="flex-1"
            />
          )}
          {!isLastPage ? (
            <Button
              label={t("services.fourchettas.next")}
              onPress={handleNextPage}
              disabled={isLoading || noDishSelected}
              className="flex-1"
            />
          ) : (
            <Button
              label={
                hasOrdered
                  ? t("services.fourchettas.modifyOrderButton")
                  : t("services.fourchettas.orderButton")
              }
              onPress={hasOrdered ? handleModifyOrder : handleOrder}
              isUpdating={isPending}
              className="flex-1"
            />
          )}
        </View>

        <Steps steps={steps} currentStep={currentPage} />
      </View>
    </Page>
  );
};

export default FourchettasOrder;
