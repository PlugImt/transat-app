import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export interface TextSkeletonProps {
  lines?: number;
  width?: number | "auto" | `${number}%`;
  lastLineWidth?: number | "auto" | `${number}%`;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "lg" | "sm" | "default";
  textCenter?: boolean;
}

const VARIANT_SIZES = {
  h1: { height: 30, gap: 9 },
  h2: { height: 24, gap: 8 },
  h3: { height: 20, gap: 7 },
  lg: { height: 18, gap: 7 },
  default: { height: 16, gap: 6 },
  sm: { height: 14, gap: 5 },
} as const;

export const TextSkeleton = ({
  lines = 1,
  width = "100%",
  lastLineWidth = "70%",
  variant = "default",
  className,
  textCenter = false,
}: TextSkeletonProps) => {
  const { actualTheme } = useTheme();
  const { height, gap } = VARIANT_SIZES[variant];

  return (
    <View
      className={className + (textCenter ? "flex items-center" : "")}
      style={{ gap, marginVertical: gap }}
    >
      {Array.from({ length: lines }, (_, index) => {
        const isLastLine = index === lines - 1 && index > 0;
        return (
          <Skeleton
            key={`skeleton-line-${isLastLine ? "last" : index}`}
            width={isLastLine ? lastLineWidth : width}
            height={height}
            colorMode={actualTheme}
          />
        );
      })}
    </View>
  );
};

export default TextSkeleton;
