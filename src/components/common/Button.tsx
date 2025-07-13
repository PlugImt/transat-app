import type { ComponentPropsWithoutRef } from "react";
import { Text, TouchableOpacity, type ViewStyle } from "react-native";
import { Skeleton } from "@/components/Skeleton";
import { type ThemeType, useTheme } from "@/contexts/ThemeContext";

type ButtonVariant = "default" | "secondary" | "destructive" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps
  extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
  label: string;
  labelClasses?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button = ({
  label,
  labelClasses,
  className,
  variant = "default",
  size = "default",
  icon,
  loading,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = props.disabled || loading;

  const buttonStyle = getButtonStyle(variant, theme);
  const textColor = getTextColor(variant, theme);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          gap: 8,
          ...buttonStyle,
          ...sizeStyles,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      className={className}
      {...props}
      disabled={isDisabled}
    >
      <Text
        style={{
          color: textColor,
          fontSize: sizeStyles.fontSize,
          fontWeight: "500",
          textAlign: "center",
          textDecorationLine: variant === "link" ? "underline" : "none",
        }}
        className={labelClasses}
      >
        {label}
      </Text>
      {loading ? (
        <Skeleton
          width={20}
          height={20}
          variant="circle"
          className="bg-white opacity-80"
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

interface IconButtonProps extends Omit<ButtonProps, "label" | "labelClasses"> {
  icon: React.ReactNode;
}

const IconButton = ({
  icon,
  variant = "default",
  size = "default",
  loading,
  className,
  ...props
}: IconButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = props.disabled || loading;

  const buttonStyle = getButtonStyle(variant, theme);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          ...buttonStyle,
          ...sizeStyles,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      className={className}
      {...props}
      disabled={isDisabled}
    >
      {loading ? (
        <Skeleton
          width={20}
          height={20}
          variant="circle"
          className="bg-white opacity-80"
        />
      ) : (
        icon
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
      fontSize: number;
    };
  } = {
    default: {
      height: 36,
      paddingHorizontal: 16,
      fontSize: 16,
    },
    sm: {
      height: 32,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    lg: {
      height: 48,
      paddingHorizontal: 32,
      fontSize: 18,
    },
  };

  return sizeStyles[size] || sizeStyles.default;
};
