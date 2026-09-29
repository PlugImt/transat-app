import { useTranslation } from "react-i18next";
import { AboutModal } from "@/components/custom/AboutModal";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useMenuRestaurant } from "@/hooks/services/restaurant/useMenuRestaurant";
import {
  LoadingState,
  RestaurantMenu,
} from "@/screens/services/restaurant/components";
import { beforeToday, getOpeningHoursData, isWeekend } from "@/utils";
import { RestaurantClosed } from "./components/RestaurantMenu/RestaurantClosed";

export const Restaurant = () => {
  const { t } = useTranslation();

  const { menu, isPending, isFetching, refetch, isError, error } = useMenuRestaurant();
  const openingHoursData = getOpeningHoursData(t);
  const weekend: boolean = isWeekend();
  const outOfHours: boolean = menu?.updatedDate
    ? beforeToday(menu.updatedDate.toString())
    : false;

  if (isPending || !menu) {
    return <LoadingState />;
  }

  if (isError && error) {
    return (
      <ErrorPage
        title={t("services.restaurant.title")}
        error={error}
        refetch={refetch}
        isRefetching={getIsRefetching(isFetching, isPending)}
        refreshing={isFetching}
      />
    );
  }

  const getRestaurantStatus = () => {
    if (weekend || outOfHours) {
      return <RestaurantClosed />;
    }

    return <RestaurantMenu menu={menu} />;
  };

  return (
    <Page
      refreshing={isFetching}
      onRefresh={refetch}
      title={t("services.restaurant.title")}
      header={
        <AboutModal
          title={t("services.restaurant.title")}
          description={t("services.restaurant.about")}
          openingHours={openingHoursData}
          location={t("services.restaurant.location")}
          price={t("services.restaurant.price")}
          additionalInfo={t("services.restaurant.additionalInfo")}
        />
      }
    >
      {getRestaurantStatus()}
    </Page>
  );
};

export default Restaurant;
