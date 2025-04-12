import { View } from "react-native";
import Skeleton from "./Skeleton";
import TextSkeleton from "./TextSkeleton";

export interface ProfileSkeletonProps {
  showAvatar?: boolean;
  avatarSize?: number;
  showInfo?: boolean;
  infoLines?: number;
  className?: string;
}

export function ProfileSkeleton({
  showAvatar = true,
  avatarSize = 80,
  showInfo = true,
  infoLines = 2,
  className,
}: ProfileSkeletonProps) {
  return (
    <View className={`flex ${className}`}>
      <View className="flex-row items-center">
        {showAvatar && (
          <Skeleton
            variant="circle"
            width={avatarSize}
            height={avatarSize}
            className="mr-4"
          />
        )}
        {showInfo && (
          <View className="flex-1">
            <TextSkeleton
              lines={infoLines}
              width="80%"
              lineHeight={20}
              spacing={8}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default ProfileSkeleton;
