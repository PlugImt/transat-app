import { TextSkeleton } from "@/components/Skeleton";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { isDinner, isLunch, isWeekend, outOfService } from "@/lib/utils";
import type { AppStackParamList } from "@/services/storage/types";
import { useTheme } from "@/themes/useThemeProvider";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function RestaurantWidget() {
  const { t } = useTranslation();
  const theme = useTheme();

  const navigation = useNavigation<AppScreenNavigationProp>();
  const { data: menu, isPending, error } = useRestaurantMenu();

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const lunch: boolean = useMemo(() => isLunch(), []);
  const dinner: boolean = useMemo(() => isDinner(), []);
  const outOfHours: boolean = useMemo(
    () => (menu?.updated_date ? outOfService(menu.updated_date) : false),
    [menu?.updated_date],
  );

  const title =
    !weekend && lunch
      ? t("services.restaurant.widgetLunch")
      : !weekend && dinner
        ? t("services.restaurant.widgetDinner")
        : "";

  if (isPending) {
    return <RestaurantWidgetLoading />;
  }

  if (error || weekend || outOfHours || (!lunch && !dinner)) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3">{title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Restaurant")}
        className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6"
      >
        {lunch ? (
          <>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <Beef color={theme.primary} />
                <Text
                  className="text-lg font-bold text-primary"
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.grill")}
                </Text>
              </View>

              {menu?.grilladesMidi.map((item) => (
                <Text key={item} className="text-foreground">
                  {item}
                </Text>
              ))}
            </View>

            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <ChefHat color={theme.primary} />
                <Text
                  className="text-lg font-bold text-primary"
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.migrator")}
                </Text>
              </View>

              {menu?.migrateurs.map((item) => (
                <Text key={item} className="text-foreground">
                  {item}
                </Text>
              ))}
            </View>

            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <Vegan color={theme.primary} />
                <Text
                  className="text-lg font-bold text-primary"
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.vegetarian")}
                </Text>
              </View>

              {menu?.cibo.map((item) => (
                <Text key={item} className="text-foreground">
                  {item}
                </Text>
              ))}
            </View>

            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <Soup color={theme.primary} />
                <Text
                  className="text-lg font-bold text-primary"
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.sideDishes")}
                </Text>
              </View>

              {menu?.accompMidi.map((item) => (
                <Text key={item} className="text-foreground">
                  {item}
                </Text>
              ))}
            </View>
          </>
        ) : dinner ? (
          <>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <Beef color={theme.primary} />
                <Text
                  className="text-lg font-bold text-primary"
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.grill")}
                </Text>
              </View>

              {menu?.grilladesSoir.map((item) => (
                <Text key={item} className="text-foreground">
                  {item}
                </Text>
              ))}
            </View>

            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <Soup color={theme.primary} />
                <Text
                  className="text-lg font-bold text-primary"
                  ellipsizeMode="tail"
                >
                  {t("services.restaurant.sideDishes")}
                </Text>
              </View>

              {menu?.accompSoir.map((item) => (
                <Text key={item} className="text-foreground">
                  {item}
                </Text>
              ))}
            </View>
          </>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

export default RestaurantWidget;

const RestaurantWidgetLoading = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const skeletonCount = () => Math.floor(Math.random() * 3) + 1;

  return (
    <View className="flex flex-col gap-2">
      <TextSkeleton lines={1} lastLineWidth={128} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Restaurant")}
        className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6"
      >
        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center gap-2">
            <Beef color={theme.primary} />
            <Text
              className="text-lg font-bold text-primary"
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
              className="text-lg font-bold text-primary"
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
              className="text-lg font-bold text-primary"
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
              className="text-lg font-bold text-primary"
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
