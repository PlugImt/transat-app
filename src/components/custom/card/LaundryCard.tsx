import { Bell, BellRing, WashingMachineIcon, Wind } from "lucide-react-native";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { BubbleAnimation, WindAnimation } from "@/components/animations";
import Badge, { BadgeSkeleton } from "@/components/common/Badge";
import Card from "@/components/common/Card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useLaundryNotifications,
  useLaundryTimer,
} from "@/hooks/services/laundry";

interface LaundryProps {
  number: string;
  type: string;
  initialTimeLeft: number;
  icon: "WASHING MACHINE" | "DRYER";
}

const getIcon = (icon: "WASHING MACHINE" | "DRYER", color: string) => {
  const iconMap: { [key: string]: React.ReactElement } = {
    "WASHING MACHINE": <WashingMachineIcon size={24} color={color} />,
    DRYER: <Wind size={24} color={color} />,
  };

  return iconMap[icon] || null;
};

const MINUTES_BEFORE_NOTIFICATION = 5;

const LaundryCard = ({ number, type, initialTimeLeft, icon }: LaundryProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { timeRemaining, progressPercentage, getMachineStatus } =
    useLaundryTimer(initialTimeLeft, icon);

  const {
    isNotificationSet,
    scheduleNotification,
    cancelNotification,
    shouldDisableButton: shouldDisableNotificationButton,
  } = useLaundryNotifications(number);

  const shouldDisableButton =
    initialTimeLeft === 0 || shouldDisableNotificationButton(timeRemaining);

  const handleSetNotification = useCallback(async () => {
    await scheduleNotification(
      type,
      timeRemaining,
      MINUTES_BEFORE_NOTIFICATION,
    );
  }, [scheduleNotification, type, timeRemaining]);

  const handleBellPress = useCallback(async () => {
    if (shouldDisableButton) return;

    if (isNotificationSet) {
      await cancelNotification();
    } else {
      await handleSetNotification();
    }
  }, [
    isNotificationSet,
    shouldDisableButton,
    cancelNotification,
    handleSetNotification,
  ]);

  return (
    <Card className="overflow-hidden">
      {initialTimeLeft > 0 && (
        <View
          className="absolute left-0 top-0 h-[200%]"
          style={{
            width: `${progressPercentage}%`,
            overflow: "hidden",
            backgroundColor:
              icon === "DRYER" ? `${theme.primary}40` : `${theme.secondary}40`,
          }}
        >
          {icon === "WASHING MACHINE" && <BubbleAnimation />}
          {icon === "DRYER" && <WindAnimation />}
        </View>
      )}
      <View className="flex-row justify-between gap-6 items-center z-10">
        <View className="flex-row items-center gap-2">
          {getIcon(icon, theme.text)}
          <Text className="font-bold" numberOfLines={1}>
            N°{number}
          </Text>
        </View>

        <Text className="flex-1" numberOfLines={1}>
          {type}
        </Text>

        <Badge
          label={getMachineStatus(timeRemaining)}
          variant={initialTimeLeft === 0 ? "secondary" : "default"}
        />

        {!shouldDisableButton && (
          <Dialog>
            <DialogTrigger>
              <TouchableOpacity onPress={handleBellPress}>
                {isNotificationSet ? (
                  <BellRing color={theme.primary} />
                ) : (
                  <Bell color={theme.primary} />
                )}
              </TouchableOpacity>
            </DialogTrigger>

            <DialogContent
              title={t("services.laundry.getNotification")}
              className="gap-2"
              cancelLabel={t("common.cancel")}
              confirmLabel={t("settings.notifications.setNotification")}
              onConfirm={handleSetNotification}
            >
              <Text>
                {t("services.laundry.getNotificationDesc", {
                  type: type.toLowerCase(),
                  minutes: MINUTES_BEFORE_NOTIFICATION,
                })}
              </Text>
            </DialogContent>
          </Dialog>
        )}
      </View>
    </Card>
  );
};

export default LaundryCard;

interface LaundryCardSkeletonProps {
  icon: "WASHING MACHINE" | "DRYER";
}

export const LaundryCardSkeleton = ({ icon }: LaundryCardSkeletonProps) => {
  const { theme } = useTheme();

  return (
    <Card className="flex-row justify-between gap-6 items-center">
      <View className="flex-row items-center gap-2">
        {getIcon(icon, theme.muted)}
        <Text color="muted" className="font-bold">
          N°--
        </Text>
      </View>
      <TextSkeleton lastLineWidth={100} />

      <BadgeSkeleton label="Libre" variant="secondary" />
    </Card>
  );
};
