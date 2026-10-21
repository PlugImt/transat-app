import React, {
  type ComponentPropsWithoutRef,
  cloneElement,
  useEffect,
} from "react";
import {
  ActivityIndicator,
  type GestureResponderEvent,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/common/Text";
import { type ThemeType, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";
import { hapticFeedback } from "@/utils/haptics.utils";

type ButtonVariant = "default" | "secondary" | "destructive" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "xl";

const getButtonStyle = (variant: ButtonVariant, theme: ThemeType) => {
  const buttonStyles: {
    [key: string]: ViewStyle;
  } = {
    default: {
      backgroundColor: theme.primary,
    },
    secondary: {
      backgroundColor: `${theme.primary}40`, // 25% opacity (40 en hex = 25% en décimal)
    },
    destructive: {
      backgroundColor: theme.destructive,
    },
    ghost: {
      backgroundColor: theme.border,
    },
    link: {
      backgroundColor: "transparent",
    },
  };

  return buttonStyles[variant] || buttonStyles.default;
};

const getTextColor = (variant: ButtonVariant, theme: ThemeType) => {
  const textColors: { [key: string]: string } = {
    default: theme.primaryText,
    secondary: theme.primary,
    destructive: theme.destructiveText,
    ghost: theme.text,
    link: theme.primary,
  };

  return textColors[variant] || textColors.default;
};

const getSizeStyles = (size: ButtonSize) => {
  const sizeStyles: {
    [key: string]: {
      height: number;
      paddingHorizontal: number;
    };
  } = {
    default: {
      height: 40,
      paddingHorizontal: 16,
    },
    sm: {
      height: 32,
      paddingHorizontal: 8,
    },
    lg: {
      height: 48,
      paddingHorizontal: 16,
    },
    xl: {
      height: 64,
      paddingHorizontal: 24,
    },
  };

  return sizeStyles[size] || sizeStyles.default;
};

/** Tints the left part of the button, up to `value` (0 to 1). */
const ProgressFill = ({ value, color }: { value: number; color: string }) => {
  const clamped = Math.min(1, Math.max(0, value));
  const width = useSharedValue(clamped);

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 200 });
  }, [clamped, width]);

  const style = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          backgroundColor: `${color}40`,
        },
        style,
      ]}
    />
  );
};

interface ButtonProps
  extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
  label?: string;
  labelClasses?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactElement<{ color: string; size?: number }>;
  isUpdating?: boolean;
  /** 0 to 1 while `isUpdating`: the button fills up instead of showing a spinner. */
  progress?: number;
}

const Button = ({
  label,
  labelClasses,
  className,
  variant = "default",
  size = "default",
  icon,
  isUpdating,
  progress,
  onPress,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = props.disabled || isUpdating;
  const showProgress = isUpdating && progress !== undefined;

  const buttonStyle = getButtonStyle(variant, theme);
  const textColor = getTextColor(variant, theme);
  const sizeStyles = getSizeStyles(size);

  const handlePress = (event: GestureResponderEvent) => {
    hapticFeedback.light();
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      style={[
        {
          ...buttonStyle,
          ...sizeStyles,
          opacity: isDisabled && !showProgress ? 0.5 : 1,
        },
      ]}
      className={cn(
        className,
        "overflow-hidden rounded-lg gap-1 flex-row items-center justify-center",
      )}
      activeOpacity={1}
      {...props}
      disabled={isDisabled}
      onPress={handlePress}
    >
      {showProgress && <ProgressFill value={progress} color={textColor} />}
      {label && (
        <Text
          style={{
            color: textColor,
          }}
          className={cn(labelClasses, "text-center")}
        >
          {label}
        </Text>
      )}
      {isUpdating && !showProgress ? (
        <ActivityIndicator color={textColor} />
      ) : (
        icon && cloneElement(icon, { color: textColor })
      )}
    </TouchableOpacity>
  );
};

interface IconButtonProps extends Omit<ButtonProps, "label" | "labelClasses"> {
  icon: React.ReactElement<{ color: string; size?: number }>;
}

const IconButton = ({
  icon,
  variant = "default",
  size = "default",
  isUpdating,
  className,
  onPress,
  ...props
}: IconButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = props.disabled || isUpdating;

  const buttonStyle = getButtonStyle(variant, theme);
  const sizeStyles = getSizeStyles(size);
  const iconColor = getTextColor(variant, theme);

  const handlePress = (event: GestureResponderEvent) => {
    hapticFeedback.light();
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      style={[
        {
          ...buttonStyle,
          ...sizeStyles,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      className={cn(
        className,
        "rounded-full aspect-square items-center justify-center",
      )}
      activeOpacity={1}
      disabled={isDisabled}
      {...props}
      onPress={handlePress}
    >
      {isUpdating ? (
        <ActivityIndicator color={iconColor} />
      ) : icon.props.color ? (
        icon
      ) : (
        cloneElement(icon, { color: iconColor, size: sizeStyles.height / 2 })
      )}
    </TouchableOpacity>
  );
};

export { Button, IconButton };
