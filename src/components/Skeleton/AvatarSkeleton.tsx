import { Skeleton } from "moti/skeleton";
import { useTheme } from "@/contexts/ThemeContext";

export interface AvatarSkeletonProps {
  size?: number;
}

export const AvatarSkeleton = ({ size = 100 }: AvatarSkeletonProps) => {
  const { actualTheme } = useTheme();

  return (
    <Skeleton
      width={size}
      height={size}
      radius="round"
      colorMode={actualTheme}
    />
  );
};

export default AvatarSkeleton;
