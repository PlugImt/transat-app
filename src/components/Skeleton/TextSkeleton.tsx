import { cn } from "@/lib/utils";
import { View } from "react-native";
import Skeleton from "./Skeleton";

export interface TextSkeletonProps {
  lines?: number;
  width?: number | "auto" | `${number}%`;
  lastLineWidth?: number | "auto" | `${number}%`;
  lineHeight?: number;
  spacing?: number;
  className?: string;
}

export function TextSkeleton({
  lines = 3,
  width = "100%",
  lastLineWidth = "70%",
  lineHeight = 16,
  spacing = 8,
  className,
}: TextSkeletonProps) {
  return (
    <View className={cn("flex flex-col", className)}>
      {[...Array(lines).keys()].map((index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lastLineWidth ? lastLineWidth : width}
          height={lineHeight}
          className={index !== lines - 1 ? `mb-${spacing}` : ""}
        />
      ))}
    </View>
  );
}

export default TextSkeleton;
