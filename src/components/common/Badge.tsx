import type { LucideIcon } from "lucide-react-native";
import type React from "react";
import { TouchableOpacity, type ViewStyle } from "react-native";
import { Text, type TextVariant } from "@/components/common/Text";
import { type ThemeType, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "ghost"
  | "warning";
type BadgeSize = "default" | "sm";

const getBadgeStyle = (variant: BadgeVariant, theme: ThemeType) => {
  const badgeStyles: {
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
    warning: {
      backgroundColor: theme.warning,
    },
  };

  return badgeStyles[variant] || badgeStyles.default;
};

const getTextColor = (variant: BadgeVariant) => {
  const badgeTextStyles: { [key in BadgeVariant]: keyof ThemeType } = {
    default: "primaryText",
    secondary: "primary",
    destructive: "destructiveText",
    ghost: "muted",
    warning: "warningText",
  };
  return badgeTextStyles[variant] || "primaryText";
};

const getSize = (size: BadgeSize) => {
  const badgeSize: {
    [key: string]: {
      container: ViewStyle;
      text: {
        size: number;
        variant: TextVariant;
      };
    };
  } = {
    default: {
      container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
      },
      text: {
        size: 14,
        variant: "default",
      },
    },
    sm: {
      container: {
        paddingHorizontal: 10,
        paddingVertical: 6,
      },
      text: {
        size: 12,
        variant: "sm",
      },
    },
  };
  return badgeSize[size] || badgeSize.default;
};

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  label: string;
  labelClasses?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  onPress?: () => void;
  isDisabled?: boolean;
  icon?: LucideIcon;
}

const Badge = ({
  label,
  labelClasses,
  className,
  variant = "default",
  size = "default",
  onPress,
  isDisabled,
  icon: Icon,
  ...props
}: BadgeProps) => {
  const { theme } = useTheme();

  const badgeStyle = getBadgeStyle(variant, theme);
  const textColor = getTextColor(variant);
  const sizeStyles = getSize(size);

  return (
    <TouchableOpacity
      className={cn(
        className,
        "flex-row items-center rounded-xl justify-center gap-1.5",
      )}
      onPress={onPress}
      activeOpacity={onPress ? 0.2 : 1}
      style={[
        {
          ...badgeStyle,
          ...sizeStyles.container,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      {...props}
    >
      {Icon && <Icon size={sizeStyles.text.size} color={theme[textColor]} />}
      <Text
        className={labelClasses}
        color={textColor}
        variant={sizeStyles.text.variant}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Badge;

interface BadgeSkeletonProps {
  className?: string;
  variant?: BadgeVariant;
  label?: string;
}

export const BadgeSkeleton = ({
  className,
  label = "",
  variant = "default",
}: BadgeSkeletonProps) => {
  return (
    <Badge
      label={label}
      variant={variant}
      className={cn("animate-pulse w-20", className)}
    />
  );
};
