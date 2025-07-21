import type { LucideIcon } from "lucide-react-native";
import type React from "react";
import { type TextStyle, TouchableOpacity, type ViewStyle } from "react-native";
import { Text } from "@/components/common/Text";
import { type ThemeType, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "ghost";
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
  };

  return badgeStyles[variant] || badgeStyles.default;
};

const getTextColor = (variant: BadgeVariant, theme: ThemeType) => {
  const badgeTextStyles: {
    [key: string]: TextStyle;
  } = {
    default: {
      color: theme.primaryText,
    },
    secondary: {
      color: theme.secondaryText,
    },
    destructive: {
      color: theme.destructiveText,
    },
    ghost: {
      color: theme.muted,
    },
  };

  return badgeTextStyles[variant] || badgeTextStyles.default;
};

const getSize = (size: BadgeSize) => {
  const badgeSize: {
    [key: string]: ViewStyle;
  } = {
    default: {
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    sm: {
      paddingHorizontal: 10,
      paddingVertical: 6,
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
  const textColor = getTextColor(variant, theme);
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
          ...sizeStyles,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      {...props}
    >
      {Icon && <Icon size={14} color={theme.text} />}
      <Text className={labelClasses} style={textColor}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Badge;

interface BadgeSkeletonProps {
  className?: string;
}

export const BadgeSkeleton = ({ className }: BadgeSkeletonProps) => {
  const { theme } = useTheme();
  return (
    <Badge
      label=""
      variant="ghost"
      className={cn("bg-muted-foreground animate-pulse w-20", className)}
      labelClasses={`text-${theme.background} animate-pulse`}
    />
  );
};
