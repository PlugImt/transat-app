import { Badge } from "@/components/common/Badge";
import { useTheme } from "@/themes/useThemeProvider";
import { BadgeEuro, Beer, CircleX, Clock } from "lucide-react-native";
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
  const theme = useTheme();

  return (
    <View className="px-6 py-8 rounded-lg bg-card gap-6 relative items-center">
      <Image
        source={{ uri: image }}
        resizeMode="contain"
        className="w-4/5 h-[100px] rounded-lg"
        style={{ width: cardWidth * 0.7 }}
      />

      <View className="absolute top-8 right-8 items-end gap-2">
        {limited && (
          <Badge label={t("services.traq.limited")} size="sm" icon={Clock} />
        )}
        {outOfStock && (
          <Badge
            label={t("services.traq.out_of_stock")}
            size="sm"
            icon={CircleX}
            variant="destructive"
          />
        )}
      </View>

      <View>
        <Text className="h2 text-primary text-center">{name}</Text>
        {description && (
          <Text className="text-sm text-foreground text-center">
            {description}
          </Text>
        )}
      </View>

      <View className="w-full px-4 gap-2">
        {alcohol !== undefined && alcohol > 0 && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Beer size={18} color={theme.foreground} />
              <Text className="font-bold text-foreground">
                {t("services.traq.alcohol")}
              </Text>
            </View>
            <Text className="font-bold text-foreground">{alcohol}°</Text>
          </View>
        )}

        {price !== undefined && (
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2 ">
              <BadgeEuro size={18} color={theme.foreground} />
              <Text className="font-bold text-foreground">
                {t("services.traq.price")}{" "}
                {alcohol && alcohol > 0 ? " (50cl)" : ""}
              </Text>
            </View>
            <Text className="font-bold text-foreground">
              {price > 0 ? `${price}€` : t("common.free")}
            </Text>
          </View>
        )}

        {priceHalf !== undefined && priceHalf > 0 && (
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2 ">
              <BadgeEuro size={18} color={theme.foreground} />
              <Text className="font-bold text-foreground">
                {t("services.traq.price_half")}{" "}
                {alcohol && alcohol > 0 ? " (25cl)" : ""}
              </Text>
            </View>
            <Text className="font-bold text-foreground">{priceHalf}€</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TraqCard;
