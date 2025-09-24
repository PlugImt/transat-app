import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/contexts/ThemeContext";

export interface ImgSkeletonProps {
  width?: number | "auto" | `${number}%`;
  height?: number | "auto" | `${number}%`;
}

export const ImgSkeleton = ({
  width = "100%",
  height = "100%",
}: ImgSkeletonProps) => {
  const { actualTheme } = useTheme();

  return <Skeleton width={width} height={height} colorMode={actualTheme} />;
};

export default ImgSkeleton;
