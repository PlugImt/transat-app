import { View } from "react-native";
import Skeleton from "./Skeleton";

export interface TextSkeletonProps {
  lines?: number;
  width?: number | "auto" | `${number}%`;
  lastLineWidth?: number | "auto" | `${number}%`;
  lineHeight?: number;
  spacing?: number;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "lg" | "sm" | "default";
}

export const TextSkeleton = ({
  lines = 3,
  width = "100%",
  lastLineWidth = "70%",
  lineHeight = 16,
  variant = "default",
  spacing = 8,
  className,
}: TextSkeletonProps) => {
  const lineHeightMap = {
    h1: 30,
    h2: 24,
    h3: 20,
    lg: 18,
    sm: 14,
    default: lineHeight,
  };
  return (
    <View className={className}>
      {[...Array(lines).keys()].map((index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lastLineWidth ? lastLineWidth : width}
          height={lineHeightMap[variant]}
          className={index !== lines - 1 ? `mb-${spacing}` : ""}
        />
      ))}
    </View>
  );
};

export default TextSkeleton;
