import { useTranslation } from "react-i18next";
import Image from "@/components/common/Image";
import { Empty } from "@/components/page/Empty";
import { useTheme } from "@/contexts/ThemeContext";
import { useMenuRestaurant } from "@/hooks/services/restaurant/useMenuRestaurant";
import { isWeekend, outOfService } from "@/utils";

export const RestaurantClosed = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { menu } = useMenuRestaurant();
  const weekend: boolean = isWeekend();
  const outOfHours: boolean = menu?.updatedDate
    ? outOfService(menu.updatedDate.toString())
    : false;

  const getTitle = () => {
    if (weekend) {
      return t("services.restaurant.closedWeekends.title");
    }
    if (outOfHours) {
      return t("services.restaurant.closedNight.title");
    }
    return t("services.restaurant.noData");
  };

  const getDescription = () => {
    if (weekend) {
      return t("services.restaurant.closedWeekends.description");
    }
    if (outOfHours) {
      return t("services.restaurant.closedNight.description");
    }
    return t("services.restaurant.noData");
  };

  return (
    <Empty
      icon={
        <Image
          source={require("@/assets/images/services/restaurant.png")}
          size={100}
          style={{ tintColor: theme.muted }}
        />
      }
      title={getTitle()}
      description={getDescription()}
    />
  );
};
