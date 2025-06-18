import { BadgeEuro, Beer, CircleX, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Text, View } from "react-native";
import { Avatar, AvatarImage } from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";

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
}: CardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-8 rounded-lg gap-6 relative items-center"
    >
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
            label={t("services.traq.outOfStock")}
            size="sm"
            icon={CircleX}
            variant="destructive"
          />
        )}
      </View>

      <View>
        <Text className="h2 text-center" style={{ color: theme.primary }}>
          {name}
        </Text>
        {description && (
          <Text className="text-sm text-center" style={{ color: theme.text }}>
            {description}
          </Text>
        )}
      </View>

      <View className="w-full px-4 gap-2">
        {alcohol !== undefined && alcohol > 0 && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Beer size={18} color={theme.text} />
              <Text className="font-bold" style={{ color: theme.text }}>
                {t("services.traq.alcohol")}
              </Text>
            </View>
            <Text className="font-bold" style={{ color: theme.text }}>
              {alcohol}°
            </Text>
          </View>
        )}

        {price !== undefined && (
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2 ">
              <BadgeEuro size={18} color={theme.text} />
              <Text className="font-bold" style={{ color: theme.text }}>
                {t("services.traq.price")}{" "}
                {alcohol && alcohol > 0 ? " (50cl)" : ""}
              </Text>
            </View>
            <Text className="font-bold" style={{ color: theme.text }}>
              {price > 0 ? `${price}€` : t("common.free")}
            </Text>
          </View>
        )}

        {priceHalf !== undefined && priceHalf > 0 && (
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2 ">
              <BadgeEuro size={18} color={theme.text} />
              <Text className="font-bold" style={{ color: theme.text }}>
                {t("services.traq.priceHalf")}{" "}
                {alcohol && alcohol > 0 ? " (25cl)" : ""}
              </Text>
            </View>
            <Text className="font-bold" style={{ color: theme.text }}>
              {priceHalf}€
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TraqCard;

export const TraqCardLoading = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-8 rounded-lg gap-6 relative items-center"
    >
      <Avatar className="w-40 h-40">
        <AvatarImage loading />
      </Avatar>

      <View className="gap-2 items-center justify-center">
        <TextSkeleton variant="h2" lines={1} lastLineWidth={200} />
        <TextSkeleton variant="sm" lines={2} width={300} />
      </View>

      <View className="w-full px-4 gap-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Beer size={18} color={theme.text} />
            <Text className="font-bold" style={{ color: theme.text }}>
              {t("services.traq.alcohol")}
            </Text>
          </View>
          <TextSkeleton lines={1} lastLineWidth={50} />
        </View>

        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-2 ">
            <BadgeEuro size={18} color={theme.text} />
            <Text className="font-bold" style={{ color: theme.text }}>
              {t("services.traq.price")}
            </Text>
          </View>
          <TextSkeleton lines={1} lastLineWidth={50} />
        </View>
      </View>
    </View>
  );
};
