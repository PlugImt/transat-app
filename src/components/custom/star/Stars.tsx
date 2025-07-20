import { View } from "react-native";
import { SingleStar } from "@/components/custom/star/SingleStar";
import { cn } from "@/utils";

type StarSize = "default" | "sm" | "lg";

const STAR_SIZES: Record<StarSize, number> = {
  sm: 16,
  default: 20,
  lg: 24,
};

interface StarProps {
  value?: number;
  max?: number;
  size?: StarSize;
  onRatingChange?: (rating: number) => void;
  className?: string;
  disabled?: boolean;
}

export const Stars = ({
  value = 0,
  max = 5,
  className,
  size = "default",
  onRatingChange,
  disabled,
}: StarProps) => {
  const starSize = STAR_SIZES[size];
  const fullStars = Math.floor(value);
  const emptyStars = max - fullStars;

  const handleStarPress = (starIndex: number) => {
    if (onRatingChange && !disabled) {
      onRatingChange(starIndex + 1);
    }
  };

  if (onRatingChange) {
    return (
      <View className={cn("flex-row items-center gap-1", className)}>
        {Array.from({ length: max }).map((_, index) => {
          return (
            <SingleStar
              key={`review-star-${index}-${max}`}
              index={index}
              isFilled={index < value}
              size={starSize}
              onPress={handleStarPress}
              disabled={disabled}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View className={cn("flex-row items-center gap-1", className)}>
      {/* Étoiles pleines */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <SingleStar
          key={`full-star-${index}-${value}`}
          index={index}
          isFilled={true}
          size={starSize}
          disabled={disabled}
        />
      ))}

      {/* Étoiles vides */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <SingleStar
          key={`empty-star-${index}-${value}`}
          index={index}
          isFilled={false}
          size={starSize}
          disabled={disabled}
        />
      ))}
    </View>
  );
};
