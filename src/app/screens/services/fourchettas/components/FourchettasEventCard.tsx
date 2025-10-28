import { Trash } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";

import { Counter } from "@/app/screens/services/fourchettas/components/Counter";
import { Button, IconButton } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { ImgSkeleton, TextSkeleton } from "@/components/Skeleton";
import type { Event } from "@/dto";
import { useUser } from "@/hooks/account/useUser";
import { useDeleteOrder } from "@/hooks/services/fourchettas/useFourchettas";
import { phoneWithoutSpaces } from "../utils/common";
import FourchettasDeleteModal from "./order/FourchettasDeleteModal";
import { Badge, Card } from "@/components/common";
import { format, parseISO ,set} from "date-fns";

interface CardProps {
  event: Event;
  onPress?: () => void;
}

function DateFromTimestampAndTime(timestamp: string, time: string): Date {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return set(parseISO(timestamp), { hours, minutes, seconds });
}

function correctDate(date: string): string {
  return format(parseISO(date), "dd/MM/yyyy");
}

export const FourchettasEventCard = ({ event, onPress }: CardProps) => {
  const { t } = useTranslation();
  const { data: user } = useUser();
  const phone = phoneWithoutSpaces(user?.phone_number);


  const [timediff] = useState(
    DateFromTimestampAndTime(
      event.form_closing_date,
      event.form_closing_time,
    ).getTime() - Date.now(),
  );

  const deleteOrderMut = useDeleteOrder(phone || "");

  function onPressDelete() {
    deleteOrderMut.mutate(
      { event_id: event.id || 0 }
    );
  }

  const isOrderClosed = timediff <= 0;
  // Warn the user if the order is closing in less than 12 hours
  const isOrderNearlyClosed = timediff <= 1000 * 60 * 60 * 12 && timediff > 0;
  const hasOrdered = event.orderuser !== null;
  return (
    <Card
      className=" relative items-center w-10/12"
    >
      <Image
        source={{ uri: event.img_url }}
        resizeMode="cover"
        className="w-48 h-52 rounded-sm"
      />
      <Text variant="h2"  className="text-center" >
        {event.title}
      </Text>
      <Text variant="lg" className="text-center font-semibold opacity-70">
        {event.description}
      </Text>
      <Text variant="lg" className="text-center">
        {t("services.fourchettas.eventDateTime", {
          date: correctDate(event.date),
          time: event.time,
        })}
      </Text>
      <Text variant="lg" className="text-center -mb-2 opacity-70" >
        {t("services.fourchettas.orderClosingIn")}
      </Text>
      <Counter
        date={DateFromTimestampAndTime(
          event.form_closing_date,
          event.form_closing_time,
        )}
      />
      <View className="relative flex flex-row items-center justify-center w-full gap-6">
        <View className="relative flex flex-row">
          <Button
            label={
              hasOrdered
                ? t("services.fourchettas.orderButton")
                : t("services.fourchettas.modifyOrderButton")
            }
            onPress={onPress}
            disabled={isOrderClosed}
          />
          {isOrderClosed && (
            <Badge
              label={t("services.fourchettas.tooLate")}
              className="absolute -right-8 -top-2 p-1 z-10"
              variant="warning"
            />
          )}
          {isOrderNearlyClosed && (
            <Badge
              label={t("services.fourchettas.hurryUp")}
              className="absolute -right-6 -top-4 p-1 z-10"
              variant="warning"
            />
          )}
        </View>
        {hasOrdered && (
          <FourchettasDeleteModal onConfirm={onPressDelete}>
            <IconButton
              variant="destructive"
              icon={<Trash />}
              disabled={isOrderClosed}
            />
          </FourchettasDeleteModal>
        )}
      </View>
    </Card>
  );
};

export const FourchettasEventCardLoading = () => {
  const { t } = useTranslation();

  return (
    <Card
      className=" relative items-center w-10/12"
    >
      <ImgSkeleton width={80} height={80} />
      <TextSkeleton lastLineWidth={100} variant="h1" />
      <TextSkeleton textCenter variant="h2" lines={3} />
      <TextSkeleton variant="h3" />
      <View className="flex-row items-center justify-between w-full">
        <ImgSkeleton width={50} height={50} />
        <ImgSkeleton width={50} height={50} />
        <ImgSkeleton width={50} height={50} />
        <ImgSkeleton width={50} height={50} />
      </View>

      <Button label={t("services.fourchettas.orderButton")} disabled={true} />
    </Card>
  );
};
