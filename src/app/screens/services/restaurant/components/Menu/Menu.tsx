import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import RestaurantCard from "@/components/custom/card/RestaurantCard";
import type { MenuData } from "@/dto";

interface RestaurantMenuProps {
  menu: MenuData;
}

export const RestaurantMenu = ({ menu }: RestaurantMenuProps) => {
  const { t } = useTranslation();
  return (
    <View className="flex flex-col gap-8">
      {/* Lunch */}
      <View className="flex flex-col gap-4">
        <Text className="ml-4" variant="h3">
          {t("services.restaurant.lunch")}
        </Text>

        {menu?.grilladesMidi?.length > 0 && (
          <RestaurantCard
            title={t("services.restaurant.grill")}
            meals={menu.grilladesMidi}
            icon="Beef"
          />
        )}
        {menu?.migrateurs?.length > 0 && (
          <RestaurantCard
            title={t("services.restaurant.migrator")}
            meals={menu.migrateurs}
            icon="ChefHat"
          />
        )}
        {menu?.cibo?.length > 0 && (
          <RestaurantCard
            title={t("services.restaurant.vegetarian")}
            meals={menu.cibo}
            icon="Vegan"
          />
        )}
        {menu?.accompMidi?.length > 0 && (
          <RestaurantCard
            title={t("services.restaurant.sideDishes")}
            meals={menu.accompMidi}
            icon="Soup"
          />
        )}
      </View>

      {/* Dinner */}
      {(menu?.grilladesSoir?.length ?? 0) > 0 ||
      (menu?.accompSoir?.length ?? 0) > 0 ? (
        <View className="flex flex-col gap-4">
          <Text className="ml-4" variant="h3">
            {t("services.restaurant.dinner")}
          </Text>
          {menu?.grilladesSoir?.length > 0 && (
            <RestaurantCard
              title={t("services.restaurant.grill")}
              meals={menu.grilladesSoir}
              icon="Beef"
            />
          )}
          {menu?.accompSoir?.length > 0 && (
            <RestaurantCard
              title={t("services.restaurant.sideDishes")}
              meals={menu.accompSoir}
              icon="Soup"
            />
          )}
        </View>
      ) : null}
    </View>
  );
};
