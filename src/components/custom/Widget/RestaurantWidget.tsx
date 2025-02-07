import { getRestaurant } from "@/lib/restaurant";
import { isDinner, isLunch, isWeekend } from "@/lib/utils";
import type { AppStackParamList } from "@/services/storage/types";
import theme from "@/themes";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../../common/Loading";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

interface RestaurantSummaryProps {
  setRefreshing: (refreshing: boolean) => void;
  refreshing: boolean;
}

interface MenuData {
  grilladesMidi: string[];
  migrateurs: string[];
  cibo: string[];
  accompMidi: string[];
  grilladesSoir: string[];
  accompSoir: string[];
}

export function RestaurantWidget({
  setRefreshing,
  refreshing,
}: RestaurantSummaryProps) {
  const { t } = useTranslation();

  const navigation = useNavigation<AppScreenNavigationProp>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<MenuData | undefined>({
    grilladesMidi: [],
    migrateurs: [],
    cibo: [],
    accompMidi: [],
    grilladesSoir: [],
    accompSoir: [],
  });

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const lunch: boolean = useMemo(() => isLunch(), []);
  const dinner: boolean = useMemo(() => isDinner(), []);
  const empty: boolean = useMemo(
    () =>
      menuData?.grilladesMidi.length === 0 &&
      menuData?.migrateurs.length === 0 &&
      menuData?.cibo.length === 0 &&
      menuData?.accompMidi.length === 0 &&
      menuData?.grilladesSoir.length === 0 &&
      menuData?.accompSoir.length === 0,
    [menuData],
  );

  const title = `${t("services.restaurant.title")} ${
    !weekend && lunch
      ? t("services.restaurant.lunch")
      : !weekend && dinner
        ? t("services.restaurant.dinner")
        : ""
  }`;

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await getRestaurant(setRefreshing);
        setMenuData(data);
      } catch (error) {
        console.error("Error while getting the menu :", error);
        setError(`${error}`);
      } finally {
        setRefreshing(false);
        setIsLoading(false);
      }
    };

    fetchMenuData().then((r) => r);
  }, [setRefreshing]);

  if (isLoading) {
    return (
      <View className="flex flex-col gap-2">
        <Text className="h3">{title}</Text>
        <View className="bg-card p-4 rounded-lg flex justify-center items-center">
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      </View>
    );
  }

  if (error || weekend || empty) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3">{title}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Restaurant")}
        accessible={true}
        activeOpacity={0.4}
      >
        <View className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6">
          {lunch ? (
            <View className="flex gap-2 flex-wrap">
              <View style={styles.container}>
                <View style={styles.row}>
                  <Beef size={18} color="#ec7f32" />
                  <Text style={styles.title}>
                    {t("services.restaurant.grill")}
                  </Text>
                </View>

                {menuData?.grilladesMidi.map((item) => (
                  <Text key={item} style={styles.itemText}>
                    {item}
                  </Text>
                ))}
              </View>

              <View style={styles.container}>
                <View style={styles.row}>
                  <ChefHat size={18} color="#ec7f32" />
                  <Text style={styles.title}>
                    {t("services.restaurant.migrator")}
                  </Text>
                </View>

                {menuData?.migrateurs.map((item) => (
                  <Text key={item} style={styles.itemText}>
                    {item}
                  </Text>
                ))}
              </View>

              <View style={styles.container}>
                <View style={styles.row}>
                  <Vegan size={18} color="#ec7f32" />
                  <Text style={styles.title}>
                    {t("services.restaurant.vegetarian")}
                  </Text>
                </View>

                {menuData?.cibo.map((item) => (
                  <Text key={item} style={styles.itemText}>
                    {item}
                  </Text>
                ))}
              </View>

              <View style={styles.container}>
                <View style={styles.row}>
                  <Soup size={18} color="#ec7f32" />
                  <Text style={styles.title}>
                    {t("services.restaurant.side_dishes")}
                  </Text>
                </View>

                {menuData?.accompMidi.map((item) => (
                  <Text key={item} style={styles.itemText}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>
          ) : dinner ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View
                  style={{ alignItems: "flex-start", flex: 1, paddingRight: 5 }}
                >
                  <View style={styles.container}>
                    <View style={styles.row}>
                      <Beef size={18} color="#ec7f32" />
                      <Text style={styles.title}>
                        {t("services.restaurant.grill")}
                      </Text>
                    </View>

                    {menuData?.grilladesSoir.map((item) => (
                      <Text key={item} style={styles.itemText}>
                        {item}
                      </Text>
                    ))}
                  </View>
                </View>

                <View
                  style={{ alignItems: "flex-start", flex: 1, paddingLeft: 5 }}
                >
                  <View style={styles.container}>
                    <View style={styles.row}>
                      <Soup size={18} color="#ec7f32" />
                      <Text style={styles.title}>
                        {t("services.restaurant.side_dishes")}
                      </Text>
                    </View>

                    {menuData?.accompSoir.map((item) => (
                      <Text key={item} style={styles.itemText}>
                        {item}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.error}>
                {t("services.restaurant.closed_night")}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0505",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  subTitle: {
    color: "#ffe6cc",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
    marginTop: 5,
  },
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    color: "#ffe6cc",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  itemText: {
    fontSize: 12,
    color: "#ffe6cc",
    fontWeight: "300",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  closed: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    paddingLeft: 50,
    paddingRight: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RestaurantWidget;
