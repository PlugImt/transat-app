import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { MenuItem } from "@/dto";
import { useMenuRestaurant } from "@/hooks/useMenuRestaurant";
import type { AppStackParamList } from "@/types";
import { isDinner, isLunch, isWeekend, outOfService } from "@/utils";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <View className="flex flex-row items-center py-1">
      <Text className="flex-1">{item.name}</Text>
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
        <Text className="ml-4" variant="h3">
          {t("services.restaurant.title")}
        </Text>
        <Card className="flex flex-row gap-4 items-center">
          <Image
            source={require("@/assets/images/services/restaurant.png")}
            className="w-24 h-24"
            style={{ tintColor: theme.muted }}
          />
          <View style={{ maxWidth: Dimensions.get("window").width - 200 }}>
            {weekend ? (
              <>
                <Text variant="lg" numberOfLines={2}>
                  {t("services.restaurant.closedNight.title")}
                </Text>

                <Text numberOfLines={3}>
                  {t("services.restaurant.closedNight.description")}
                </Text>
              </>
            ) : !updatedToday ? (
              <>
                <Text variant="lg" numberOfLines={2}>
                  {t("services.restaurant.closedUpdated.title")}
                </Text>

                <Text numberOfLines={3}>
                  {t("services.restaurant.closedUpdated.description")}
                </Text>
              </>
            ) : (
              <>
                <Text variant="lg" numberOfLines={2}>
                  {t("services.restaurant.closedWeekends.title")}
                </Text>

                <Text numberOfLines={3}>
                  {t("services.restaurant.closedNight.description")}
                </Text>
              </>
            )}
          </View>
        </Card>
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
        <Text className="ml-4" variant="h3">
          {title}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Restaurant")}>
          <Text variant="sm" color="primary" className="px-4">
            {t("common.seeMore")}
          </Text>
        </TouchableOpacity>
      </View>
      <Card
        onPress={() => navigation.navigate("Restaurant")}
        className="relative overflow-hidden h-60"
      >
        <View className="gap-6">
          {lunch ? (
            <>
              {menu?.grilladesMidi && menu.grilladesMidi.length > 0 && (
                <View className="gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Beef color={theme.text} />
                    <Text variant="lg">{t("services.restaurant.grill")}</Text>
                  </View>

                  {menu.grilladesMidi.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </View>
              )}

              {menu?.migrateurs && menu.migrateurs.length > 0 && (
                <View className="gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <ChefHat color={theme.text} />
                    <Text variant="lg">
                      {t("services.restaurant.migrator")}
                    </Text>
                  </View>

                  {menu.migrateurs.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </View>
              )}

              {menu?.cibo && menu.cibo.length > 0 && (
                <View className="gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Vegan color={theme.text} />
                    <Text variant="lg">
                      {t("services.restaurant.vegetarian")}
                    </Text>
                  </View>

                  {menu.cibo.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </View>
              )}

              {menu?.accompMidi && menu.accompMidi.length > 0 && (
                <View className="gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Soup color={theme.text} />
                    <Text variant="lg">
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
                <View className="gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Beef color={theme.text} />
                    <Text variant="lg">{t("services.restaurant.grill")}</Text>
                  </View>

                  {menu.grilladesSoir.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </View>
              )}

              {menu?.accompSoir && menu.accompSoir.length > 0 && (
                <View className="gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Soup color={theme.text} />
                    <Text variant="lg">
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
          colors={[`${theme.card}00`, theme.card, theme.card]}
          locations={[0, 0.8, 1]}
          style={{
            height: 260,
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
          }}
        />
      </Card>
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
    <CardGroup
      title={t("services.restaurant.title")}
      onPress={() => navigation.navigate("Restaurant")}
    >
      <Card
        onPress={() => navigation.navigate("Restaurant")}
        className="relative overflow-hidden h-60"
      >
        <View className="gap-6">
          <View className="gap-2">
            <View className="flex flex-row items-center gap-2">
              <Beef color={theme.text} />
              <Text variant="lg">{t("services.restaurant.grill")}</Text>
            </View>

            {[...Array(skeletonCount()).keys()].map((index) => (
              <TextSkeleton key={index} />
            ))}
          </View>

          <View className="gap-2">
            <View className="flex flex-row items-center gap-2">
              <ChefHat color={theme.text} />
              <Text variant="lg">{t("services.restaurant.migrator")}</Text>
            </View>

            {[...Array(skeletonCount()).keys()].map((index) => (
              <TextSkeleton key={index} />
            ))}
          </View>

          <View className="gap-2">
            <View className="flex flex-row items-center gap-2">
              <Vegan color={theme.text} />
              <Text variant="lg">{t("services.restaurant.vegetarian")}</Text>
            </View>

            {[...Array(skeletonCount()).keys()].map((index) => (
              <TextSkeleton key={index} />
            ))}
          </View>

          <View className="gap-2">
            <View className="flex flex-row items-center gap-2">
              <Soup color={theme.text} />
              <Text variant="lg">{t("services.restaurant.sideDishes")}</Text>
            </View>

            {[...Array(skeletonCount()).keys()].map((index) => (
              <TextSkeleton key={index} />
            ))}
          </View>
        </View>
        <LinearGradient
          colors={[`${theme.card}00`, theme.card, theme.card]}
          locations={[0, 0.8, 1]}
          style={{
            height: 260,
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
          }}
        />
      </Card>
    </CardGroup>
  );
};
