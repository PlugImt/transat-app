import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
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

export const CardSkeleton = ({
  hasHeader = true,
  hasIcon = false,
  contentLines = 3,
  className,
  width = "100%",
  height,
}: CardSkeletonProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        width,
        height,
      }}
      className={`p-4 rounded-lg ${className}`}
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
          <TextSkeleton lines={1} width="60%" variant="h2" className="flex-1" />
        </View>
      )}
      <TextSkeleton lines={contentLines} width="100%" spacing={8} />
    </View>
  );
};

export default CardSkeleton;
