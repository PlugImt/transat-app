import { Star as LucidStar } from "lucide-react-native";
import type { ComponentPropsWithoutRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type StarVariant =
  | "default"
  | "secondary"
  | "outlined"
  | "destructive"
  | "ghost"
  | "link";
type StarSize = "default" | "sm" | "lg";
type Layout = "filled" | "split";

interface StarProps extends ComponentPropsWithoutRef<typeof TouchableOpacity> {
  value?: number;
  max: number;
  variant?: StarVariant;
  size?: StarSize;
  layout?: Layout;
  showValue?: boolean;
  onPress?: () => void;
}

const Star = ({
  value = 0,
  max = 5,
  className,
  variant = "default",
  size = "default",
  layout = "split",
  showValue = true,
  ...props
}: StarProps) => {
  const { theme } = useTheme();

  const isDisabled = props.disabled;
  const starSize = size === "lg" ? 24 : size === "sm" ? 16 : 20;

  const getStarColor = (isFilled: boolean) => {
    if (value === 0) return theme.textSecondary;
    if (isDisabled) return theme.textSecondary;
    return isFilled ? theme.primary : theme.textSecondary;
  };

  const renderFilledLayout = () => {
    const fillPercentage = Math.min((value / max) * 100, 100);

    return (
      <View style={{ position: "relative" }}>
        <LucidStar
          size={starSize}
          color={getStarColor(false)}
          fill="transparent"
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${fillPercentage}%`,
            overflow: "hidden",
          }}
        >
          <LucidStar
            size={starSize}
            color={getStarColor(true)}
            fill={getStarColor(true)}
          />
        </View>
      </View>
    );
  };

  const renderSplitLayout = () => {
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    const emptyStars = max - Math.ceil(value);

    return (
      <View className="flex-row">
        {Array.from({ length: fullStars }).map((_, index) => (
          <LucidStar
            key={`full-${index.toString()}`}
            size={starSize}
            color={getStarColor(true)}
            fill={getStarColor(true)}
            style={{ marginRight: 2 }}
          />
        ))}

        {hasHalfStar && (
          <View style={{ position: "relative", marginRight: 2 }}>
            <LucidStar
              size={starSize}
              color={getStarColor(false)}
              fill="transparent"
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                overflow: "hidden",
              }}
            >
              <LucidStar
                size={starSize}
                color={getStarColor(true)}
                fill={getStarColor(true)}
              />
            </View>
          </View>
        )}

        {Array.from({ length: emptyStars }).map((_, index) => (
          <LucidStar
            key={`empty-${index.toString()}`}
            size={starSize}
            color={getStarColor(false)}
            fill="transparent"
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`flex-row items-center ${className}`}
      {...props}
    >
      {showValue && (
        <Text className="mr-2" style={{ color: theme.primary }}>
          {value}/{max}
        </Text>
      )}

      {layout === "filled" ? renderFilledLayout() : renderSplitLayout()}
    </TouchableOpacity>
  );
};

export { Star };
