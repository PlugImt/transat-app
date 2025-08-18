import { useTranslation } from "react-i18next";
import {
  LoadingState,
  RestaurantMenu,
} from "@/app/screens/services/restaurant/components";
import { AboutModal } from "@/components/custom/AboutModal";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useMenuRestaurant } from "@/hooks/services/restaurant/useMenuRestaurant";
import { getOpeningHoursData, isWeekend, outOfService } from "@/utils";
import { RestaurantClosed } from "./components/RestaurantMenu/RestaurantClosed";

export const Restaurant = () => {
  const { t } = useTranslation();

  const { menu, isPending, refetch, isError, error } = useMenuRestaurant();
  const openingHoursData = getOpeningHoursData(t);
  const weekend: boolean = isWeekend();
  const outOfHours: boolean = menu?.updatedDate
    ? outOfService(menu.updatedDate.toString())
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
        isRefetching={isPending}
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
      refreshing={isPending}
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
