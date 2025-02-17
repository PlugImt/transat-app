import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { isDinner, isLunch, outOfService } from "@/lib/utils";
import type { AppStackParamList } from "@/services/storage/types";
import theme from "@/themes";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { isWeekend } from "date-fns";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function RestaurantWidget() {
  const { t } = useTranslation();

  const navigation = useNavigation<AppScreenNavigationProp>();
  const { data: menu, isPending, error, isError } = useRestaurantMenu();

  const weekend: boolean = useMemo(() => isWeekend(new Date()), []);
  const lunch: boolean = useMemo(() => isLunch(), []);
  const dinner: boolean = useMemo(() => isDinner(), []);
  const outOfHours = useMemo(() => outOfService(), []);

  const title =
    !weekend && lunch
      ? t("services.restaurant.widget_lunch")
      : !weekend && dinner
        ? t("services.restaurant.widget_dinner")
        : "";

  if (isPending) {
    return (
      <View className="flex flex-col gap-2">
        <Text className="h3">{title}</Text>
        <View className="bg-card p-4 rounded-lg flex justify-center items-center">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error || weekend || outOfHours) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3">{title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Restaurant")}
        accessible={true}
        activeOpacity={0.4}
        className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6"
      >
        {lunch ? (
          <>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center gap-2">
                <Beef color={theme.primary} />
                <Text className="text-lg font-bold text-primary text-ellipsis">
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
                <Text className="text-lg font-bold text-primary text-ellipsis">
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
                <Text className="text-lg font-bold text-primary text-ellipsis">
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
                <Text className="text-lg font-bold text-primary text-ellipsis">
                  {t("services.restaurant.side_dishes")}
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
                <Text className="text-lg font-bold text-primary text-ellipsis">
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
                <Text className="text-lg font-bold text-primary text-ellipsis">
                  {t("services.restaurant.side_dishes")}
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
