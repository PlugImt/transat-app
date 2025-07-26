import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/contexts/ThemeContext";

export interface ImageSkeletonProps {
  size?: number;
  radius?: number | "round";
}

export const ImageSkeleton = ({ size = 100, radius }: ImageSkeletonProps) => {
  const { actualTheme } = useTheme();

  return (
    <Skeleton
      width={size}
      height={size}
      radius={radius}
      colorMode={actualTheme}
    />
  );
};

export default ImageSkeleton;
