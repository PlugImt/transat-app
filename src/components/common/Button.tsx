import type { ComponentPropsWithoutRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";

type ButtonVariant =
  | "default"
  | "secondary"
  | "outlined"
  | "destructive"
  | "ghost"
  | "link";
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

  // Get button styles based on variant and theme
  const getButtonStyle = () => {
    let backgroundColor = theme.primary;
    let borderColor = "transparent";
    let borderWidth = 0;

    switch (variant) {
      case "secondary":
        backgroundColor = theme.secondary;
        break;
      case "outlined":
        backgroundColor = "transparent";
        borderColor = theme.primary;
        borderWidth = 1;
        break;
      case "destructive":
        backgroundColor = theme.destructive;
        break;
      case "ghost":
        backgroundColor = theme.backdrop;
        break;
      case "link":
        backgroundColor = "transparent";
        break;
      default:
        backgroundColor = theme.primary;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
    };
  };

  // Get text color based on variant and theme
  const getTextColor = () => {
    switch (variant) {
      case "outlined":
        return theme.primary;
      case "ghost":
        return theme.text;
      case "link":
        return theme.primary;
      default:
        return "#FFFFFF"; // White text for filled buttons
    }
  };

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          height: 32,
          paddingHorizontal: 8,
          fontSize: 14,
        };
      case "lg":
        return {
          height: 48,
          paddingHorizontal: 32,
          fontSize: 18,
        };
      default:
        return {
          height: 40,
          paddingHorizontal: 16,
          fontSize: 16,
        };
    }
  };

  const buttonStyle = getButtonStyle();
  const textColor = getTextColor();
  const sizeStyles = getSizeStyles();

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

  // Get button styles based on variant and theme
  const getButtonStyle = () => {
    let backgroundColor = theme.primary;
    let borderColor = "transparent";
    let borderWidth = 0;

    switch (variant) {
      case "secondary":
        backgroundColor = theme.secondary;
        break;
      case "outlined":
        backgroundColor = "transparent";
        borderColor = theme.primary;
        borderWidth = 1;
        break;
      case "destructive":
        backgroundColor = theme.destructive;
        break;
      case "ghost":
        backgroundColor = theme.muted;
        break;
      case "link":
        backgroundColor = "transparent";
        break;
      default:
        backgroundColor = theme.primary;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
    };
  };

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          height: 32,
          width: 32,
        };
      case "lg":
        return {
          height: 48,
          width: 48,
        };
      default:
        return {
          height: 40,
          width: 40,
        };
    }
  };

  const buttonStyle = getButtonStyle();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20, // Fully rounded for icon buttons
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
