import { View } from "react-native";
import Skeleton from "./Skeleton";
import TextSkeleton from "./TextSkeleton";

export interface CardSkeletonProps {
  hasHeader?: boolean;
  hasIcon?: boolean;
  contentLines?: number;
  className?: string;
  width?: number | "auto" | `${number}%`;
  height?: number | "auto" | `${number}%`;
}

export function CardSkeleton({
  hasHeader = true,
  hasIcon = false,
  contentLines = 3,
  className,
  width = "100%",
  height,
}: CardSkeletonProps) {
  return (
    <View
      className={`bg-card p-4 rounded-lg ${className}`}
      style={{ width, height }}
    >
      {hasHeader && (
        <View className="flex-row items-center mb-4">
          {hasIcon && (
            <Skeleton
              variant="circle"
              width={40}
              height={40}
              className="mr-3"
            />
          )}
          <TextSkeleton
            lines={1}
            width="60%"
            lineHeight={24}
            className="flex-1"
          />
        </View>
      )}
      <TextSkeleton
        lines={contentLines}
        width="100%"
        lineHeight={16}
        spacing={8}
      />
    </View>
  );
}

export default CardSkeleton;
