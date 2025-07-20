import { type ComponentPropsWithoutRef, cloneElement } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import { Text } from "@/components/common/Text";
import { type ThemeType, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

type ButtonVariant = "default" | "secondary" | "destructive" | "ghost" | "link";
type ButtonSize = "default" | "sm";

interface ButtonProps
  extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
  label: string;
  labelClasses?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isUpdating?: boolean;
}

const Button = ({
  label,
  labelClasses,
  className,
  variant = "default",
  size = "default",
  icon,
  isUpdating,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = props.disabled || isUpdating;

  const buttonStyle = getButtonStyle(variant, theme);
  const textColor = getTextColor(variant, theme);
  const sizeStyles = getSizeStyles(size);

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
        "rounded-lg gap-2 flex-row items-center justify-center",
      )}
      {...props}
      disabled={isDisabled}
    >
      <Text
        style={{
          color: textColor,
        }}
        className={cn(labelClasses, "text-center")}
      >
        {label}
      </Text>
      {isUpdating ? <ActivityIndicator color={textColor} /> : icon}
    </TouchableOpacity>
  );
};

interface IconButtonProps extends Omit<ButtonProps, "label" | "labelClasses"> {
  icon: React.ReactElement<{ color: string }>;
}

const IconButton = ({
  icon,
  variant = "default",
  size = "default",
  isUpdating,
  className,
  ...props
}: IconButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = props.disabled || isUpdating;

  const buttonStyle = variant === "default" && getButtonStyle(variant, theme);
  const sizeStyles = getSizeStyles(size);
  const iconColor = getTextColor(variant, theme);

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
      disabled={isDisabled}
      {...props}
    >
      {isUpdating ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        cloneElement(icon, {
          color: iconColor,
        })
      )}
    </TouchableOpacity>
  );
};

export { Button, IconButton };

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
      backgroundColor: theme.backdrop,
    },
    link: {
      backgroundColor: "transparent",
    },
  };

  return buttonStyles[variant] || buttonStyles.default;
};

const getTextColor = (variant: ButtonVariant, theme: ThemeType) => {
  const textColors: { [key: string]: string } = {
    default: "#FFFFFF",
    secondary: theme.primary,
    destructive: "#FFFFFF",
    ghost: theme.muted,
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
  };

  return sizeStyles[size] || sizeStyles.default;
};
