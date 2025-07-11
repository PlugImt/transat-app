import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { MenuItem } from "@/dto";
import { useMenuRestaurant } from "@/hooks/useMenuRestaurant";
import type { AppStackParamList } from "@/services/storage/types";
import { isDinner, isLunch, isWeekend, outOfService } from "@/utils";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const { theme } = useTheme();

  return (
    <View className="flex flex-row items-center py-1">
      <Text style={{ color: theme.text }} className="flex-1">
        {item.name}
      </Text>
    </View>
  );
};

export const RestaurantWidget = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navigation = useNavigation<AppScreenNavigationProp>();

  const { menu, error, isPending } = useMenuRestaurant();

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const lunch: boolean = useMemo(() => isLunch(), []);
  const dinner: boolean = useMemo(() => isDinner(), []);
  const outOfHours: boolean = useMemo(
    () => (menu?.updatedDate ? outOfService(String(menu.updatedDate)) : false),
    [menu?.updatedDate],
  );
  const updatedToday: boolean = useMemo(() => {
    if (!menu?.updatedDate) {
      return false;
    }

    const menuDate = new Date(menu.updatedDate);
    const today = new Date();

    if (Number.isNaN(menuDate.getTime()) || Number.isNaN(today.getTime())) {
      return false;
    }

    return (
      menuDate.getFullYear() === today.getFullYear() &&
      menuDate.getMonth() === today.getMonth() &&
      menuDate.getDate() === today.getDate()
    );
  }, [menu?.updatedDate]);

  const title =
    !weekend && lunch
      ? t("services.restaurant.widgetLunch")
      : !weekend && dinner
        ? t("services.restaurant.widgetDinner")
        : "";

  if (isPending) {
    return <RestaurantWidgetLoading />;
  }

  if (error || weekend || outOfHours || (!lunch && !dinner) || !updatedToday) {
    return (
      <View className="flex flex-col gap-2">
        <Text style={{ color: theme.text }} className="h3 ml-4">
          {t("services.restaurant.title")}
        </Text>
        <View
          style={{ backgroundColor: theme.card }}
          className="px-6 py-4 rounded-lg flex flex-row gap-6 items-center overflow-hidden"
        >
          <Image
            source={require("@/assets/images/Logos/restaurant_bw.png")}
            className="w-24 h-24"
          />
          <View
            className="flex flex-col gap-2"
            style={{ maxWidth: Dimensions.get("window").width - 200 }}
          >
            {weekend ? (
              <>
                <Text
                  className="text-lg font-bold text-center"
                  style={{ color: theme.text }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.closedNight.title")}
                </Text>

                <Text
                  className="text-center"
                  style={{ color: theme.text }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.closedNight.description")}
                </Text>
              </>
            ) : !updatedToday ? (
              <>
                <Text
                  className="text-lg font-bold text-center"
                  style={{ color: theme.text }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.closedUpdated.title")}
                </Text>

                <Text
                  className="text-center"
                  style={{ color: theme.text }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.closedUpdated.description")}
                </Text>
              </>
            ) : (
              <>
                <Text
                  className="text-lg font-bold text-center"
                  style={{ color: theme.text }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.closedWeekends")}
                </Text>

                <Text
                  className="text-center"
                  style={{ color: theme.text }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.closedNight.description")}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  }

  const hasMenuItems =
    (lunch &&
      menu &&
      (menu.grilladesMidi.length > 0 ||
        menu.cibo.length > 0 ||
        menu.accompMidi.length > 0)) ||
    (dinner &&
      menu &&
      (menu.accompSoir.length > 0 || menu.grilladesSoir.length > 0));

  if (!hasMenuItems) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-row items-center justify-between gap-2">
        <Text style={{ color: theme.text }} className="h3 ml-4">
          {title}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Restaurant")}>
          <Text
            style={{ color: theme.primary }}
            className="text-sm font-medium px-4"
          >
            {t("common.seeMore")}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Restaurant")}
        style={{ backgroundColor: theme.card }}
        className="px-6 pt-4 rounded-lg overflow-hidden"
      >
        <View className="relative">
          <View
            style={{ maxHeight: 200, overflow: "hidden" }}
            className="flex flex-col gap-6"
          >
            {lunch ? (
              <>
                {menu?.grilladesMidi && menu.grilladesMidi.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Beef />
                      <Text
                        // style={{ color: theme.primary }}
                        className="text-lg font-bold"
                        ellipsizeMode="tail"
                      >
                        {t("services.restaurant.grill")}
                      </Text>
                    </View>

                    {menu.grilladesMidi.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                )}

                {menu?.migrateurs && menu.migrateurs.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <ChefHat />
                      <Text
                        // style={{ color: theme.primary }}
                        className="text-lg font-bold"
                        ellipsizeMode="tail"
                      >
                        {t("services.restaurant.migrator")}
                      </Text>
                    </View>

                    {menu.migrateurs.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                )}

                {menu?.cibo && menu.cibo.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Vegan />
                      <Text
                        // style={{ color: theme.primary }}
                        className="text-lg font-bold"
                        ellipsizeMode="tail"
                      >
                        {t("services.restaurant.vegetarian")}
                      </Text>
                    </View>

                    {menu.cibo.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                )}

                {menu?.accompMidi && menu.accompMidi.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Soup />
                      <Text
                        // style={{ color: theme.primary }}
                        className="text-lg font-bold"
                        ellipsizeMode="tail"
                      >
                        {t("services.restaurant.sideDishes")}
                      </Text>
                    </View>

                    {menu.accompMidi.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                )}
              </>
            ) : dinner ? (
              <>
                {menu?.grilladesSoir && menu.grilladesSoir.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Beef />
                      <Text
                        // style={{ color: theme.primary }}
                        className="text-lg font-bold"
                        ellipsizeMode="tail"
                      >
                        {t("services.restaurant.grill")}
                      </Text>
                    </View>

                    {menu.grilladesSoir.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                )}

                {menu?.accompSoir && menu.accompSoir.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Soup />
                      <Text
                        // style={{ color: theme.primary }}
                        className="text-lg font-bold"
                        ellipsizeMode="tail"
                      >
                        {t("services.restaurant.sideDishes")}
                      </Text>
                    </View>

                    {menu.accompSoir.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                )}
              </>
            ) : null}
          </View>

          <LinearGradient
            colors={[theme.card, "transparent"]}
            className="absolute left-0 right-0 bottom-0 h-[200px] transform rotate-180"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantWidget;

export const RestaurantWidgetLoading = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <View className="flex flex-col gap-2">
      <TextSkeleton lines={1} lastLineWidth={128} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Restaurant")}
        style={{ backgroundColor: theme.card }}
        className="px-6 py-4 rounded-lg flex flex-col gap-6"
      >
        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center gap-2">
            <Beef />
            <Text
              // style={{ color: theme.primary }}
              className="text-lg font-bold"
              ellipsizeMode="tail"
            >
              {t("services.restaurant.grill")}
            </Text>
          </View>

          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center gap-2">
            <ChefHat />
            <Text
              // style={{ color: theme.primary }}
              className="text-lg font-bold"
              ellipsizeMode="tail"
            >
              {t("services.restaurant.migrator")}
            </Text>
          </View>

          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center gap-2">
            <Vegan />
            <Text
              // style={{ color: theme.primary }}
              className="text-lg font-bold"
              ellipsizeMode="tail"
            >
              {t("services.restaurant.vegetarian")}
            </Text>
          </View>

          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>

        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center gap-2">
            <Soup />
            <Text
              // style={{ color: theme.primary }}
              className="text-lg font-bold"
              ellipsizeMode="tail"
            >
              {t("services.restaurant.sideDishes")}
            </Text>
          </View>

          {[...Array(skeletonCount()).keys()].map((index) => (
            <TextSkeleton lines={1} key={index} />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};
