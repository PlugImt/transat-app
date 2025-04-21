import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/themes/useThemeProvider";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Bell, BellRing, WashingMachineIcon, Wind } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, type ColorValue, Text, TouchableOpacity, View } from "react-native";
import Badge, { BadgeLoading } from "../../common/Badge";
import { Dialog, DialogContent, DialogTrigger } from "../../common/Dialog";

interface WashingMachineProps {
  number: string;
  type: string;
  status: number;
  icon: "WASHING MACHINE" | "DRYER";
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getIcon = (icon: "WASHING MACHINE" | "DRYER", color: ColorValue) => {
  switch (icon) {
    case "WASHING MACHINE":
      return <WashingMachineIcon size={24} color={color} />;
    case "DRYER":
      return <Wind size={24} color={color} />;
    default:
      return null;
  }
};

// Animation components
const BubbleAnimation = () => {
  const bubbles = [...Array(8)].map((_, i) => {
    const positionY = useRef(new Animated.Value(-20)).current;
    const positionX = useRef(new Animated.Value(Math.random() * 100)).current;
    const scale = useRef(new Animated.Value(Math.random() * 0.5 + 0.5)).current;
    const opacity = useRef(new Animated.Value(Math.random() * 0.3 + 0.2)).current;
    
    useEffect(() => {
      const moveBubble = () => {
        const duration = Math.random() * 3000 + 2000;
        Animated.parallel([
          Animated.sequence([
            Animated.timing(positionY, {
              toValue: 120, // Move down (top to bottom)
              duration,
              useNativeDriver: false,
            }),
            Animated.timing(positionY, {
              toValue: -20, // Reset to top
              duration: 0,
              useNativeDriver: false,
            })
          ]),
          Animated.sequence([
            Animated.timing(positionX, {
              toValue: Math.random() * 100,
              duration: duration / 2,
              useNativeDriver: false,
            }),
            Animated.timing(positionX, {
              toValue: Math.random() * 100,
              duration: duration / 2, 
              useNativeDriver: false,
            })
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: Math.random() * 0.3 + 0.2,
              duration: duration / 2,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: Math.random() * 0.3 + 0.2,
              duration: duration / 2,
              useNativeDriver: false,
            })
          ])
        ]).start(moveBubble);
      };
      
      moveBubble();
    }, []);
    
    return (
      <Animated.View
        key={i}
        style={{
          position: 'absolute',
          left: positionX,
          top: positionY, // Use top instead of bottom
          width: scale.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 12]
          }),
          height: scale.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 12]
          }),
          borderRadius: 20,
          backgroundColor: 'white',
          opacity,
        }}
      />
    );
  });
  
  return <View style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.3 }}>{bubbles}</View>;
};

const WindAnimation = () => {
  const windPatterns = [...Array(5)].map((_, i) => {
    const translateX = useRef(new Animated.Value(-30)).current;
    const translateY = useRef(new Animated.Value(Math.random() * 100)).current;
    const scaleY = useRef(new Animated.Value(Math.random() * 0.6 + 0.2)).current;
    const opacity = useRef(new Animated.Value(Math.random() * 0.3 + 0.2)).current;
    
    useEffect(() => {
      const moveWind = () => {
        const duration = Math.random() * 2000 + 1000;
        Animated.parallel([
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 100, // Reduced to stay within container
              duration,
              useNativeDriver: false,
            }),
            Animated.timing(translateX, {
              toValue: -30,
              duration: 0,
              useNativeDriver: false,
            })
          ]),
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: Math.random() * 100,
              duration: 0,
              useNativeDriver: false,
            })
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: Math.random() * 0.3 + 0.2,
              duration: duration / 2,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: Math.random() * 0.3 + 0.2,
              duration: duration / 2,
              useNativeDriver: false,
            })
          ])
        ]).start(moveWind);
      };
      
      moveWind();
    }, []);
    
    return (
      <Animated.View
        key={i}
        style={{
          position: 'absolute',
          left: translateX,
          top: translateY,
          width: 30,
          height: scaleY.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3]
          }),
          backgroundColor: 'white',
          borderRadius: 5,
          opacity,
        }}
      />
    );
  });
  
  return <View style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }}>{windPatterns}</View>;
};

const MINUTES_BEFORE_NOTIFICATION = 5;
const WASHING_MACHINE_DURATION = 40 * 60;
const DRYER_DURATION = 40 * 60;
const DRYER_DOUBLE_DURATION = 80 * 60;

const WashingMachineCard = ({
  number,
  type,
  status,
  icon,
}: WashingMachineProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [timeRemaining, setTimeRemaining] = useState<number>(status);
  const [notificationSet, setNotificationSet] = useState<boolean>(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  }, []);

  const getMachineStatus = useCallback(
    (timeBeforeOff: number): string => {
      if (timeBeforeOff === 0) return t("common.freeToUse");
      return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : "UNKNOWN";
    },
    [formatTime, t],
  );

  useEffect(() => {
    if (timeRemaining > 0 && status > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeRemaining]);

  // Calculate progress percentage based on machine type and time remaining
  useEffect(() => {
    if (status === 0) {
      setProgressPercentage(0);
      return;
    }

    if (icon === "WASHING MACHINE") {
      const totalDuration = WASHING_MACHINE_DURATION;
      const elapsed = totalDuration - timeRemaining;
      const progress = Math.min(
        Math.max((elapsed / totalDuration) * 100, 0),
        100,
      );
      setProgressPercentage(progress);
    } else if (icon === "DRYER") {
      // Determine if it's a single or double cycle
      const totalDuration =
        timeRemaining > DRYER_DURATION ? DRYER_DOUBLE_DURATION : DRYER_DURATION;
      const elapsed = totalDuration - timeRemaining;
      const progress = Math.min(
        Math.max((elapsed / totalDuration) * 100, 0),
        100,
      );
      setProgressPercentage(progress);
    }
  }, [timeRemaining, status, icon]);

  const scheduleNotification = useCallback(
    async (minutes: number) => {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }

      // Calculate when to notify (5 minutes before completion)
      const notificationTriggerTime = Math.max(timeRemaining - minutes * 60, 1);

      if (timeRemaining > minutes * 60) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: t("services.washingMachine.almostDone", { number }),
            body: t("services.washingMachine.almostDoneBody", {
              type,
              minutes,
            }),
          },
          trigger: {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: notificationTriggerTime,
          },
        });
        setNotificationId(id);
        setNotificationSet(true);
      }
    },
    [notificationId, timeRemaining, t, number, type],
  );

  const handleSetNotification = useCallback(async () => {
    await scheduleNotification(MINUTES_BEFORE_NOTIFICATION);
  }, [scheduleNotification]);

  const handleBellPress = useCallback(async () => {
    if (status === 0) return;

    if (notificationSet) {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      setNotificationId(null);
      setNotificationSet(false);
    } else {
      await handleSetNotification();
    }
  }, [notificationId, notificationSet, status, handleSetNotification]);

  return (
    <View className="relative px-6 py-4 rounded-lg bg-card overflow-hidden">
      {status > 0 && (
        <View
          className="absolute left-0 top-0 h-[200%] bg-primary/10" // IDK why but h-full only does half of the height
          style={{ width: `${progressPercentage}%`, overflow: 'hidden' }}
        >
          {icon === "WASHING MACHINE" && <BubbleAnimation />}
          {icon === "DRYER" && <WindAnimation />}
        </View>
      )}
      <View className="flex-row justify-between gap-6 items-center z-10">
        <View className="flex-row items-center gap-2">
          {getIcon(icon, theme.primary)}
          <Text className="text-foreground font-bold" numberOfLines={1}>
            N°{number}
          </Text>
        </View>

        <Text
          className="text-foreground flex-1"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {type}
        </Text>

        <Badge
          label={getMachineStatus(timeRemaining)}
          variant={status === 0 ? "secondary" : "default"}
        />

        <Dialog>
          <DialogTrigger>
            <TouchableOpacity onPress={handleBellPress} disabled={status === 0}>
              {notificationSet ? (
                <BellRing color={status === 0 ? theme.muted : theme.primary} />
              ) : (
                <Bell color={status === 0 ? theme.muted : theme.primary} />
              )}
            </TouchableOpacity>
          </DialogTrigger>

          <DialogContent
            title={t("services.washingMachine.getNotification")}
            className="gap-2"
            cancelLabel={t("common.cancel")}
            confirmLabel={t("settings.notifications.setNotification")}
            onConfirm={handleSetNotification}
          >
            <Text className="text-foreground">
              {t("services.washingMachine.getNotificationDesc", {
                type: type.toLowerCase(),
                minutes: MINUTES_BEFORE_NOTIFICATION,
              })}
            </Text>
          </DialogContent>
        </Dialog>
      </View>
    </View>
  );
};

export default WashingMachineCard;

interface WashingMachineCardSkeletonProps {
  icon: "WASHING MACHINE" | "DRYER";
}

export const WashingMachineCardSkeleton = ({
  icon,
}: WashingMachineCardSkeletonProps) => {
  const theme = useTheme();

  return (
    <View className="px-6 py-4 rounded-lg bg-card flex-row justify-between gap-6 items-center">
      <View className="flex-row items-center gap-2">
        {getIcon(icon, theme.muted)}
        <Text className="text-muted-foreground font-bold">N°--</Text>
      </View>
      <TextSkeleton lines={1} lastLineWidth={100} />

      <BadgeLoading />

      <Bell color={theme.muted} />
    </View>
  );
};
