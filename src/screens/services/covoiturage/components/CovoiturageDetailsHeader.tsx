import React from "react";
import { View } from "react-native";
import { MapPin, Calendar, Clock, ShoppingCart, Sun, Car } from "lucide-react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { TextSkeleton } from "@/components/Skeleton";
import colors from "@/themes/colors";
import type { Covoiturage } from "@/dto";

type CovoiturageDetailsHeaderProps = {
  covoiturage: Covoiturage;
};

const getBadgeConfig = (tripType: string, t: (key: string) => string) => {
  const tagsColors = colors.shared.covoitTags;
  switch (tripType) {
    case "SHOPPING":
      return {
        color: tagsColors.shopping.color,
        bgColor: tagsColors.shopping.background,
        icon: <ShoppingCart color={tagsColors.shopping.color} size={14} />,
        label: t("services.covoit.tags.shopping")
      };
    case "LONG_TRIP":
      return {
        color: tagsColors.long_trip.color,
        bgColor: tagsColors.long_trip.background,
        icon: <Sun color={tagsColors.long_trip.color} size={14} />,
        label: t("services.covoit.tags.long_trip")
      };
    case "OTHER":
      return {
        color: tagsColors.other.color,
        bgColor: tagsColors.other.background,
        icon: <Car color={tagsColors.other.color} size={14} />,
        label: t("services.covoit.tags.other")
      };
    default:
      return null;
  }
};

export const CovoiturageDetailsHeader = ({ covoiturage }: CovoiturageDetailsHeaderProps) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const departureTime = new Date(covoiturage.departure_time);
  const formattedDate = departureTime.toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const hours = String(departureTime.getHours()).padStart(2, "0");
  const minutes = String(departureTime.getMinutes()).padStart(2, "0");
  const separator = i18n.language?.startsWith("fr") ? "h" : ":";
  const formattedTime = `${hours}${separator}${minutes}`;

  const badge = getBadgeConfig(covoiturage.trip_type, t);
  const isFull = covoiturage.status === "FULL";

  return (
    <View className="p-5 rounded-3xl gap-4 border mb-4" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <View className="flex-row items-start gap-3">
        <MapPin color={theme.primary} size={22} className="mt-1" />
        <View className="flex-1 gap-1">
          <Text variant="xs" color="muted" className="uppercase font-bold tracking-wider">{t("services.covoit.route")}</Text>
          <Text variant="h2" className="font-bold">
            {covoiturage.departure_place} → {covoiturage.destination}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t pt-4" style={{ borderColor: theme.border }}>
        <View className="flex-row items-center gap-2">
          <Calendar color={theme.muted} size={16} />
          <Text variant="sm" className="font-medium capitalize">{formattedDate}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Clock color={theme.muted} size={16} />
          <Text variant="sm" className="font-semibold">{formattedTime}</Text>
        </View>
      </View>

      {(badge || isFull) && (
        <View className="flex-row flex-wrap gap-2 pt-2">
          {badge && (
            <View 
              className="flex-row items-center gap-2 px-4 py-1.5 rounded-full border"
              style={{ borderColor: badge.color, backgroundColor: badge.bgColor }}
            >
              {badge.icon}
              <Text variant="xs" style={{ color: badge.color }} className="font-bold">
                {badge.label}
              </Text>
            </View>
          )}

          {isFull && (
            <View 
              className="flex-row items-center gap-2 px-4 py-1.5 rounded-full border"
              style={{ borderColor: theme.destructive, backgroundColor: theme.destructive + "15" }}
            >
              <Text variant="xs" style={{ color: theme.destructive }} className="font-bold uppercase tracking-wider">
                {t("services.covoit.status.full")}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export const CovoiturageDetailsHeaderSkeleton = () => {
  const { theme } = useTheme();
  return (
    <View className="p-5 rounded-3xl gap-4 border mb-4" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <View className="flex-row items-start gap-3">
        <View className="w-6 h-6 rounded-full bg-muted/20" />
        <View className="flex-1 gap-2">
          <TextSkeleton variant="sm" width={50} />
          <TextSkeleton variant="h2" lastLineWidth="80%" />
        </View>
      </View>
      <View className="flex-row items-center justify-between border-t pt-4" style={{ borderColor: theme.border }}>
        <TextSkeleton variant="sm" width={120} />
        <TextSkeleton variant="sm" width={60} />
      </View>
    </View>
  );
};