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

  const getButtonStyle = () => {
    const buttonStyles: {
      [key: string]: {
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
      };
    } = {
      default: {
        backgroundColor: theme.primary,
        borderColor: "transparent",
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.secondary,
        borderColor: "transparent",
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: "transparent",
        borderColor: theme.primary,
        borderWidth: 1,
      },
      destructive: {
        backgroundColor: theme.destructive,
        borderColor: "transparent",
        borderWidth: 0,
      },
      ghost: {
        backgroundColor: theme.backdrop,
        borderColor: "transparent",
        borderWidth: 0,
      },
      link: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
      },
    };

    return buttonStyles[variant] || buttonStyles.default;
  };

  const getTextColor = () => {
    const textColors: { [key: string]: string } = {
      default: "#FFFFFF",
      secondary: "#FFFFFF",
      outlined: theme.primary,
      destructive: "#FFFFFF",
      ghost: theme.text,
      link: theme.primary,
    };

    return textColors[variant] || textColors.default;
  };

  const getSizeStyles = () => {
    const sizeStyles: {
      [key: string]: {
        height: number;
        paddingHorizontal: number;
        fontSize: number;
      };
    } = {
      default: {
        height: 40,
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

  const getButtonStyle = () => {
    const buttonStyles: {
      [key: string]: {
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
      };
    } = {
      default: {
        backgroundColor: theme.primary,
        borderColor: "transparent",
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.secondary,
        borderColor: "transparent",
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: "transparent",
        borderColor: theme.primary,
        borderWidth: 1,
      },
      destructive: {
        backgroundColor: theme.destructive,
        borderColor: "transparent",
        borderWidth: 0,
      },
      ghost: {
        backgroundColor: theme.muted,
        borderColor: "transparent",
        borderWidth: 0,
      },
      link: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
      },
    };

    return buttonStyles[variant] || buttonStyles.default;
  };

  const getSizeStyles = () => {
    const sizeStyles: { [key: string]: { height: number; width: number } } = {
      default: {
        height: 40,
        width: 40,
      },
      sm: {
        height: 32,
        width: 32,
      },
      lg: {
        height: 48,
        width: 48,
      },
    };

    return sizeStyles[size] || sizeStyles.default;
  };

  const buttonStyle = getButtonStyle();
  const sizeStyles = getSizeStyles();

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
