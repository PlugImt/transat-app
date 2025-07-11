import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Beef, ChefHat, Soup, Star, Vegan } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useMenuRestaurant } from "@/hooks/useMenuRestaurant";
import type { AppStackParamList } from "@/services/storage/types";
import type { MenuItem } from "@/dto";
import { isDinner, isLunch, isWeekend, outOfService } from "@/utils";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const handlePress = () => {
    navigation.navigate("RestaurantReviews", { id: item.id });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex flex-row items-center justify-between py-2"
      activeOpacity={0.7}
    >
      <Text style={{ color: theme.text }} className="flex-1">
        {item.name}
      </Text>
      {item.average_rating && (
        <View className="flex flex-row items-center gap-1 ml-2">
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={{ color: theme.textSecondary }} className="text-xs">
            {item.average_rating.toFixed(1)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
    () => (menu?.updated_date ? outOfService(menu.updated_date.toISOString()) : false),
    [menu?.updated_date],
  );
  const updatedToday: boolean = useMemo(() => {
    if (!menu?.updated_date) {
      return false; // If no date available, assume not updated today
    }

    const menuDate = new Date(menu.updated_date);
    const today = new Date();
    
    // Check if the dates are valid
    if (Number.isNaN(menuDate.getTime()) || Number.isNaN(today.getTime())) {
      return false;
    }

    // Compare year, month, and day
    return (
      menuDate.getFullYear() === today.getFullYear() &&
      menuDate.getMonth() === today.getMonth() &&
      menuDate.getDate() === today.getDate()
    );
  }, [menu?.updated_date]);

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

  return (
    <View className="flex flex-col gap-2">
      {(lunch &&
        menu &&
        (menu.grilladesMidi.length > 0 ||
          menu.cibo.length > 0 ||
          menu.accompMidi.length > 0)) ||
      (dinner &&
        menu &&
        (menu.accompSoir.length > 0 || menu.grilladesSoir.length > 0)) ? (
        <>
          <Text style={{ color: theme.text }} className="h3 ml-4">
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Restaurant")}
            style={{ backgroundColor: theme.card }}
            className="px-6 py-4 rounded-lg flex flex-col gap-6"
          >
            {lunch ? (
              <>
                {menu?.grilladesMidi && menu.grilladesMidi.length > 0 && (
                  <View className="flex flex-col gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Beef color={theme.primary} />
                      <Text
                        style={{ color: theme.primary }}
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
                      <ChefHat color={theme.primary} />
                      <Text
                        style={{ color: theme.primary }}
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
                      <Vegan color={theme.primary} />
                      <Text
                        style={{ color: theme.primary }}
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
                      <Soup color={theme.primary} />
                      <Text
                        style={{ color: theme.primary }}
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
                      <Beef color={theme.primary} />
                      <Text
                        style={{ color: theme.primary }}
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
                      <Soup color={theme.primary} />
                      <Text
                        style={{ color: theme.primary }}
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
          </TouchableOpacity>
        </>
      ) : null}
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
            <Beef color={theme.primary} />
            <Text
              style={{ color: theme.primary }}
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
            <ChefHat color={theme.primary} />
            <Text
              style={{ color: theme.primary }}
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
            <Vegan color={theme.primary} />
            <Text
              style={{ color: theme.primary }}
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
            <Soup color={theme.primary} />
            <Text
              style={{ color: theme.primary }}
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
