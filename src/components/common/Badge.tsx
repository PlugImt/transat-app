import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import type React from "react";
import { Text, TouchableOpacity, type View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "flex flex-row items-center rounded-xl justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary",
        light: "bg-foreground",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        success: "bg-green-500",
      },
      size: {
        default: "px-4 py-1",
        sm: "px-2.5 py-1.5",
        lg: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const badgeTextVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      light: "text-background",
      secondary: "text-foreground",
      destructive: "text-destructive-foreground",
      success: "text-green-100",
    },
    size: {
      default: "text-base",
      sm: "text-xs",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {
  label: string;
  labelClasses?: string;
  onPress?: () => void;
  icon?: LucideIcon;
}

function Badge({
  label,
  labelClasses,
  className,
  variant,
  size,
  onPress,
  icon: Icon,
  ...props
}: BadgeProps) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      className={cn(
        badgeVariants({ variant, size }),
        className,
        "flex-row items-center gap-1.5",
      )}
      {...props}
      onPress={onPress}
      activeOpacity={onPress ? 0.2 : 1}
    >
      {Icon && <Icon size={14} color={theme.text} />}
      <Text
        className={cn(badgeTextVariants({ variant, size }), labelClasses)}
        style={{ color: "white" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default Badge;

interface BadgeLoadingProps {
  className?: string;
}

export const BadgeLoading = ({ className }: BadgeLoadingProps) => {
  const { theme } = useTheme();
  return (
    <Badge
      label=""
      variant="light"
      className={cn("bg-muted-foreground animate-pulse w-20", className)}
      labelClasses={`text-${theme.background} animate-pulse`}
    />
  );
};
