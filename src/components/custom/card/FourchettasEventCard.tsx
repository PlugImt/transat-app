import { useTranslation } from "react-i18next";

import { Dimensions, Image, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import { Text } from "@/components/common/Text";
import { TextSkeleton, ImgSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/common/Button";
import type { Event } from "@/dto";
interface CardProps {
  event: Event;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

const FourchettasEventCard = ({ event, onPress }: CardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-8 rounded-lg gap-6 relative items-center w-4/5"
    >
      <Image
        source={{ uri: event.img_url }}
        resizeMode="contain"
        className="w-20 h-20 rounded-lg"
      />
      <Text variant="h1" className="text-center" color="primary">
        {event.title}
      </Text>
      <Text variant="lg" className="text-center">
        {event.description}
      </Text>
      <Text variant="sm" className="text-center">
        Le {event.date} à {event.time}
      </Text>
      <Text variant="sm" className="text-center">
        Clôture des commandes le {event.form_closing_date} à{" "}
        {event.form_closing_time}
      </Text>
      <Button
        label={
          event.orderedOfUser === undefined
            ? t("services.fourchettas.orderButton")
            : t("services.fourchettas.modifyOrderButton")
        }
        onPress={onPress}
      />
    </View>
  );
};

export default FourchettasEventCard;

export const FourchettasEventCardLoading = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-8 rounded-lg gap-6 justify-center items-center w-4/5"
    >
      <ImgSkeleton width={80} height={80} />
      <TextSkeleton lastLineWidth={100} variant="h1" />
      <TextSkeleton textCenter variant="h2" lines={3} />
      <TextSkeleton variant="h3" />
      <TextSkeleton variant="h3" />

      <Button label={t("services.fourchettas.orderButton")} disabled={true} />
    </View>
  );
};
