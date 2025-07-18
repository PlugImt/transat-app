import { Bell, BellRing, WashingMachineIcon, Wind } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  type ColorValue,
  TouchableOpacity,
  View,
} from "react-native";
import Badge, { BadgeLoading } from "@/components/common/Badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useWashingMachineNotifications } from "@/hooks/useWashingMachineNotifications";

interface WashingMachineProps {
  number: string;
  type: string;
  status: number;
  icon: "WASHING MACHINE" | "DRYER";
}

const getIcon = (icon: "WASHING MACHINE" | "DRYER", color: ColorValue) => {
  const iconMap: { [key: string]: React.ReactElement } = {
    "WASHING MACHINE": <WashingMachineIcon size={24} color={color} />,
    DRYER: <Wind size={24} color={color} />,
  };

  return iconMap[icon] || null;
};

const Bubble = ({ index }: { index: number }) => {
  const positionY = useRef(new Animated.Value(20)).current;
  const positionX = useRef(new Animated.Value(Math.random() * 100)).current;
  const scale = useRef(new Animated.Value(Math.random() * 0.5 + 0.5)).current;
  const opacity = useRef(new Animated.Value(Math.random() * 0.3 + 0.2)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const duration = Math.random() * 4000 + 3000;

    const bubbleAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(positionY, {
            toValue: 120,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(positionY, {
            toValue: 20,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(positionX, {
            toValue: Math.random() * 100,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(positionX, {
            toValue: Math.random() * 100,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.3 + 0.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: Math.random() * 0.3 + 0.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animationRef.current = bubbleAnimation;
    bubbleAnimation.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      positionY.stopAnimation();
      positionX.stopAnimation();
      opacity.stopAnimation();
    };
  }, [opacity, positionX, positionY]);

  return (
    <Animated.View
      key={`bubble-${index}`}
      style={{
        position: "absolute",
        transform: [
          {
            translateX: positionX.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 100],
            }),
          },
          {
            translateY: positionY,
          },
          {
            scale: scale,
          },
        ],
        width: 8,
        height: 8,
        borderRadius: 20,
        backgroundColor: "white",
        opacity,
      }}
    />
  );
};

const BubbleAnimation = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        opacity: 0.3,
      }}
    >
      <Bubble key="bubble-0" index={0} />
      <Bubble key="bubble-1" index={1} />
      <Bubble key="bubble-2" index={2} />
      <Bubble key="bubble-3" index={3} />
    </View>
  );
};

const WindPattern = ({ index }: { index: number }) => {
  const translateX = useRef(new Animated.Value(-30)).current;
  const translateY = useRef(new Animated.Value(Math.random() * 100)).current;
  const opacity = useRef(new Animated.Value(Math.random() * 0.3 + 0.2)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const duration = Math.random() * 3000 + 2000;

    const windAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 100,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -30,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: Math.random() * 100,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.3 + 0.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: Math.random() * 0.3 + 0.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animationRef.current = windAnimation;
    windAnimation.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      translateX.stopAnimation();
      translateY.stopAnimation();
      opacity.stopAnimation();
    };
  }, [opacity, translateX, translateY]);

  return (
    <Animated.View
      key={`wind-${index}`}
      style={{
        position: "absolute",
        transform: [
          {
            translateX: translateX.interpolate({
              inputRange: [-30, 130],
              outputRange: [-15, 130],
            }),
          },
          {
            translateY: translateY,
          },
        ],
        width: 40,
        height: 3,
        backgroundColor: "white",
        borderRadius: 5,
        opacity,
      }}
    />
  );
};

const WindAnimation = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        opacity: 0.2,
      }}
    >
      <WindPattern key="wind-0" index={0} />
      <WindPattern key="wind-1" index={1} />
      <WindPattern key="wind-2" index={2} />
    </View>
  );
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
  const { theme } = useTheme();

  const [timeRemaining, setTimeRemaining] = useState<number>(status);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  // Use the notification hook
  const {
    isNotificationSet,
    scheduleNotification,
    cancelNotification,
    shouldDisableButton: shouldDisableNotificationButton,
  } = useWashingMachineNotifications(number);

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

  useEffect(() => {
    if (status === 0) {
      setProgressPercentage(0);
      return;
    }

    let totalDuration = 0;
    if (icon === "WASHING MACHINE") {
      totalDuration = WASHING_MACHINE_DURATION;
    } else {
      totalDuration =
        timeRemaining > DRYER_DURATION ? DRYER_DOUBLE_DURATION : DRYER_DURATION;
    }

    const elapsed = totalDuration - timeRemaining;
    const progress = Math.min(
      Math.max((elapsed / totalDuration) * 100, 0),
      100,
    );
    setProgressPercentage(progress);
  }, [timeRemaining, status, icon]);

  // Check if notification button should be disabled
  const shouldDisableButton =
    status === 0 || shouldDisableNotificationButton(timeRemaining);

  const handleSetNotification = useCallback(async () => {
    const success = await scheduleNotification(
      type,
      timeRemaining,
      MINUTES_BEFORE_NOTIFICATION,
    );

    if (!success) {
      // Could show an error message here
      console.warn(
        "Could not schedule notification - not enough time remaining",
      );
    }
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
    <View
      className="relative px-6 py-4 rounded-lg  overflow-hidden"
      style={{ backgroundColor: theme.card }}
    >
      {status > 0 && (
        <View
          className={`absolute left-0 top-0 h-[200%] ${icon === "DRYER" ? "bg-primary/10" : "bg-blue-500/10"}`}
          style={{ width: `${progressPercentage}%`, overflow: "hidden" }}
        >
          {icon === "WASHING MACHINE" && <BubbleAnimation />}
          {icon === "DRYER" && <WindAnimation />}
        </View>
      )}
      <View className="flex-row justify-between gap-6 items-center z-10">
        <View className="flex-row items-center gap-2">
          {getIcon(icon, theme.primary)}
          <Text className="font-bold" numberOfLines={1}>
            N°{number}
          </Text>
        </View>

        <Text className="flex-1" numberOfLines={1}>
          {type}
        </Text>

        <Badge
          label={getMachineStatus(timeRemaining)}
          variant={status === 0 ? "secondary" : "default"}
        />

        <Dialog>
          <DialogTrigger>
            <TouchableOpacity
              onPress={handleBellPress}
              disabled={shouldDisableButton}
            >
              {isNotificationSet ? (
                <BellRing
                  color={shouldDisableButton ? theme.muted : theme.primary}
                />
              ) : (
                <Bell
                  color={shouldDisableButton ? theme.muted : theme.primary}
                />
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
            <Text>
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
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-4 rounded-lg flex-row justify-between gap-6 items-center"
    >
      <View className="flex-row items-center gap-2">
        {getIcon(icon, theme.muted)}
        <Text color="muted" className="font-bold">
          N°--
        </Text>
      </View>
      <TextSkeleton lines={1} lastLineWidth={100} />

      <BadgeLoading />

      <Bell color={theme.muted} />
    </View>
  );
};
