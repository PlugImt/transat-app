import { BadgeEuro, Beer, CircleX, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
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
    <Card className="relative items-center">
      <Image
        source={{ uri: image }}
        resizeMode="contain"
        className="w-4/5 h-[100px] rounded-lg"
      />

      <View className="absolute top-8 right-8 items-end gap-2">
        {outOfStock && (
          <Badge
            label={t("services.traq.outOfStock")}
            size="sm"
            icon={CircleX}
            variant="destructive"
          />
        )}
        {limited && (
          <Badge
            label={t("services.traq.limited")}
            size="sm"
            icon={Clock}
            variant="ghost"
          />
        )}
      </View>

      <View>
        <Text variant="h2" className="text-center">
          {name}
        </Text>
        {description && <Text className="text-center">{description}</Text>}
      </View>

      <View className="w-full p-4 gap-2">
        {alcohol !== undefined && alcohol > 0 && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Beer size={18} color={theme.text} />
              <Text className="font-bold">{t("services.traq.alcohol")}</Text>
            </View>
            <Text className="font-bold">{alcohol}°</Text>
          </View>
        )}

        {price !== undefined && (
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2 ">
              <BadgeEuro size={18} color={theme.text} />
              <Text className="font-bold">
                {t("services.traq.price")}{" "}
                {alcohol && alcohol > 0 ? " (50cl)" : ""}
              </Text>
            </View>
            <Text className="font-bold">
              {price > 0 ? `${price}€` : t("common.free")}
            </Text>
          </View>
        )}

        {priceHalf !== undefined && priceHalf > 0 && (
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row items-center gap-2 ">
              <BadgeEuro size={18} color={theme.text} />
              <Text className="font-bold">
                {t("services.traq.priceHalf")}{" "}
                {alcohol && alcohol > 0 ? " (25cl)" : ""}
              </Text>
            </View>
            <Text className="font-bold">{priceHalf}€</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export default TraqCard;

export const TraqCardLoading = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Card className="items-center">
      <AvatarSkeleton size={160} />

      <View className="gap-2 items-center justify-center">
        <TextSkeleton variant="h2" lastLineWidth={200} />
        <TextSkeleton variant="sm" lines={2} width={300} />
      </View>

      <View className="w-full px-4 gap-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Beer size={18} color={theme.text} />
            <Text className="font-bold">{t("services.traq.alcohol")}</Text>
          </View>
          <TextSkeleton lastLineWidth={50} />
        </View>

        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-2 ">
            <BadgeEuro size={18} color={theme.text} />
            <Text className="font-bold">{t("services.traq.price")}</Text>
          </View>
          <TextSkeleton lastLineWidth={50} />
        </View>
      </View>
    </Card>
  );
};
