import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/contexts/ThemeContext";

export interface ImageSkeletonProps {
  size?: number;
  radius?: number | "round";
}

export const ImageSkeleton = ({ size = 100, radius }: ImageSkeletonProps) => {
  const { actualTheme } = useTheme();
  const borderRadius = radius === "round" ? 9999 : radius;

  return (
    <Skeleton
      width={size}
      height={size}
      radius={borderRadius}
      colorMode={actualTheme}
    />
  );
};

export default ImageSkeleton;
