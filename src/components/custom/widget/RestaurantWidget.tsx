import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { isDinner, isLunch, isWeekend, outOfService } from "@/lib/utils";
import type { AppStackParamList } from "@/services/storage/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function RestaurantWidget() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const navigation = useNavigation<AppScreenNavigationProp>();
  const { data: menu, isPending, error } = useRestaurantMenu();

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const lunch: boolean = useMemo(() => isLunch(), []);
  const dinner: boolean = useMemo(() => isDinner(), []);
  const outOfHours: boolean = useMemo(
    () => (menu?.updated_date ? outOfService(menu.updated_date) : false),
    [menu?.updated_date],
  );
  const updatedToday: boolean = useMemo(
    () =>
      menu?.updated_date
        ? new Date(menu.updated_date).getDay() === new Date().getDay()
        : true,
    [menu?.updated_date],
  ); // TODO: fix this because the menu date is undefined/NaN so it's never displayed

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
                      <Text key={item} style={{ color: theme.text }}>
                        {item}
                      </Text>
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
                      <Text key={item} style={{ color: theme.text }}>
                        {item}
                      </Text>
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
                      <Text key={item} style={{ color: theme.text }}>
                        {item}
                      </Text>
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
                      <Text key={item} style={{ color: theme.text }}>
                        {item}
                      </Text>
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
                      <Text key={item} style={{ color: theme.text }}>
                        {item}
                      </Text>
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
                      <Text key={item} style={{ color: theme.text }}>
                        {item}
                      </Text>
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
}

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
