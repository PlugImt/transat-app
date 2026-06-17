import type { BottomTabNavigationProp } from "expo-router/js-tabs";
import { useNavigation } from "expo-router/react-navigation";
import { Clock, MapPin, User, ShoppingCart, Sun, Car } from "lucide-react-native";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { UserStackSkeleton } from "@/components/custom";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import type { Covoiturage } from "@/dto";
import colors from "@/themes/colors";

type NavigationProp = BottomTabNavigationProp<{
  CovoiturageDetails: { id: number };
}>;

type CovoiturageCardProps = {
  covoiturage: Covoiturage;
};

const getBadgeConfig = (tripType: string, t: (key: string) => string) => {
  const tagsColors = colors.shared.covoitTags;
  const BADGE_ICON_SIZE = 12;

  switch (tripType) {
    case "SHOPPING":
      return {
        color: tagsColors.shopping.color,
        bgColor: tagsColors.shopping.background, 
        icon: <ShoppingCart color={tagsColors.shopping.color} size={BADGE_ICON_SIZE} />,
        label: t("services.covoit.tags.shopping")
      };
    case "LONG_TRIP":
    case "LONG_TRIP":
      return {
        color: tagsColors.long_trip.color,
        bgColor: tagsColors.long_trip.background,
        icon: <Sun color={tagsColors.long_trip.color} size={BADGE_ICON_SIZE} />,
        label: t("services.covoit.tags.long_trip")
      };
    case "OTHER":
      return {
        color: tagsColors.other.color,
        bgColor: tagsColors.other.background, 
        icon: <Car color={tagsColors.other.color} size={BADGE_ICON_SIZE} />, 
        label: t("services.covoit.tags.other")
      };
    default:
      return null;
  }
};

export const CovoiturageCard = ({ covoiturage }: CovoiturageCardProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t, i18n } = useTranslation();

  const departureTime = new Date(covoiturage.departure_time);
  
  const formattedDate = departureTime.toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const hours = String(departureTime.getHours()).padStart(2, "0");
  const minutes = String(departureTime.getMinutes()).padStart(2, "0");
  const separator = i18n.language?.startsWith("fr") ? "h" : ":";
  const formattedTime = `${hours}${separator}${minutes}`;

  const badge = getBadgeConfig(covoiturage.trip_type, t);
  const driverName = `${covoiturage.creator.first_name} ${covoiturage.creator.last_name?.charAt(0)}.`;

  return (
    <Card
      className="p-4 gap-3 mb-2"
      onPress={() => {
        navigation.navigate("CovoiturageDetails", { id: covoiturage.id });
      }}
    >
      <View className="flex-row items-center gap-2">
        <MapPin color={theme.primary} size={16} className="shrink-0" />
        <Text variant="h3" className="font-semibold flex-1" numberOfLines={1}>
          {covoiturage.departure_place} → {covoiturage.destination}
        </Text>
      </View>

      <View className="flex-row items-center justify-between gap-4">
        <Text variant="sm" color="muted" className="capitalize flex-1" numberOfLines={1}>
          {formattedDate}
        </Text>
        <View className="flex-row items-center gap-1.5 shrink-0">
          <Clock color={theme.muted} size={14} />
          <Text variant="sm" color="muted">
            {formattedTime}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2 flex-1">
          <User color={theme.muted} size={14} className="shrink-0" />
          <Text variant="sm" className="font-medium flex-1" numberOfLines={1}>
            {driverName}
          </Text>
        </View>

        {badge && (
          <View 
            className="flex-row items-center gap-2 px-3.5 py-0.5 rounded-full border shrink-0"
            style={{ 
              borderColor: badge.color,
              backgroundColor: badge.bgColor
            }}
          >
            {badge.icon}
            <Text 
              variant="xs" 
              style={{ color: badge.color }}
              className="font-bold text-[11px]"
            >
              {badge.label}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export const CovoiturageCardSkeleton = () => {
  const { theme } = useTheme();
  return (
    <Card className="p-4 gap-3 mb-2">
      <View className="flex-row items-center gap-2">
        <MapPin color={theme.muted} size={16} />
        <TextSkeleton variant="h3" lastLineWidth="60%" />
      </View>
      <View className="flex-row items-center justify-between gap-4">
        <TextSkeleton variant="sm" lastLineWidth={100} />
        <TextSkeleton variant="sm" lastLineWidth={40} />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2 flex-1">
          <UserStackSkeleton size="sm" borderColor="card" />
          <TextSkeleton variant="sm" lastLineWidth={80} />
        </View>
        <View className="w-16 h-5 rounded-full bg-muted/20" />
      </View>
    </Card>
  );
};