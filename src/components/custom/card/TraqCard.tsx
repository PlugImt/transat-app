import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Text, View } from "react-native";

interface CardProps {
  image: string;
  name: string;
  description?: string;
  limited?: boolean;
  alcohol?: number;
  outOfStock?: boolean;
  price?: number;
  priceHalf?: number;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

const TraqCard = ({
  image,
  name,
  description,
  limited,
  alcohol,
  outOfStock,
  price,
  priceHalf,
  onPress,
}: CardProps) => {
  const { t } = useTranslation();

  return (
    <View className="px-6 pt-4 pb-2 rounded-lg bg-card flex flex-col gap-6">
      <View className="relative pt-3 items-center ">
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          className="w-4/5 h-[100px] rounded-lg"
          style={{ width: cardWidth * 0.7 }}
        />

        <View className="absolute top-2 right-2 flex flex-col items-end gap-2">
          {limited && (
            <View className="flex flex-row items-center bg-primary px-2.5 py-1.5 rounded-full">
              <Ionicons
                name="time-outline"
                size={14}
                color="#fff"
                className="mr-1"
              />
              <Text className="text-foreground text-xs font-semibold">
                {t("services.traq.limited")}
              </Text>
            </View>
          )}

          {outOfStock && (
            <View className="flex flex-row items-center bg-red-500 px-2.5 py-1.5 rounded-full">
              <Ionicons
                name="close-circle-outline"
                size={14}
                color="#fff"
                className="mr-1"
              />
              <Text className="text-foreground text-xs font-semibold">
                {t("services.traq.out_of_stock")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="pb-4 pl-4 pr-4">
        <View className="mb-4">
          <Text className="text-xl font-bold text-primary mb-1.5 text-center">
            {name}
          </Text>
          {description && (
            <Text className="text-sm text-foreground text-center leading-5">
              {description}
            </Text>
          )}
        </View>

        <View className="bg-lightCard rounded-xl p-4 gap-2 border border-muted-100">
          {alcohol !== undefined && alcohol > 0 && (
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center">
                <Ionicons
                  name="wine-outline"
                  size={18}
                  color="#0049a8"
                  className="mr-2"
                />
                <Text className="text-base font-semibold text-foreground">
                  {t("services.traq.alcohol")}
                </Text>
              </View>
              <Text className="text-base font-bold text-white">{alcohol}°</Text>
            </View>
          )}

          {price !== undefined && (
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center">
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  color="#0049a8"
                  className="mr-2"
                />
                <Text className="text-base font-semibold text-foreground">
                  {t("services.traq.price")}{" "}
                  {alcohol && alcohol > 0 ? " (50cl)" : ""}
                </Text>
              </View>
              <Text className="text-base font-bold text-white">
                {price > 0 ? `${price}€` : t("common.free")}
              </Text>
            </View>
          )}

          {priceHalf !== undefined && priceHalf > 0 && (
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center">
                <Ionicons
                  name="pricetags-outline"
                  size={18}
                  color="#0049a8"
                  className="mr-2"
                />
                <Text className="text-base font-semibold text-foreground">
                  {t("services.traq.price_half")}{" "}
                  {alcohol && alcohol > 0 ? " (25cl)" : ""}
                </Text>
              </View>
              <Text className="text-base font-bold text-white">
                {priceHalf}€
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TraqCard;
