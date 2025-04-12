import { View } from "react-native";
import { CardSkeleton, ProfileSkeleton, TextSkeleton } from "../Skeleton";

export interface SkeletonLoadingScreenProps {
  type?: "default" | "profile" | "card" | "list";
  items?: number;
}

export function SkeletonLoadingScreen({
  type = "default",
  items = 3,
}: SkeletonLoadingScreenProps) {
  return (
    <View className="bg-background px-5 justify-center items-center h-screen">
      {type === "default" && (
        <View className="w-full max-w-md">
          <TextSkeleton
            lines={1}
            width="60%"
            lineHeight={32}
            className="mb-6"
          />
          <CardSkeleton hasHeader contentLines={4} className="mb-4" />
          <CardSkeleton hasHeader contentLines={2} className="mb-4" />
        </View>
      )}

      {type === "profile" && (
        <View className="w-full max-w-md">
          <ProfileSkeleton avatarSize={100} infoLines={3} className="mb-6" />
          <TextSkeleton
            lines={1}
            width="40%"
            lineHeight={24}
            className="mb-4"
          />
          <CardSkeleton hasHeader={false} contentLines={4} className="mb-4" />
          <CardSkeleton hasHeader={false} contentLines={3} className="mb-4" />
        </View>
      )}

      {type === "card" && (
        <View className="w-full max-w-md">
          <TextSkeleton
            lines={1}
            width="50%"
            lineHeight={32}
            className="mb-6"
          />
          <CardSkeleton
            hasHeader
            hasIcon
            contentLines={6}
            className="mb-4"
            height={300}
          />
        </View>
      )}

      {type === "list" && (
        <View className="w-full max-w-md">
          <TextSkeleton
            lines={1}
            width="50%"
            lineHeight={32}
            className="mb-6"
          />
          {Array.from({ length: items }).map((_, index) => (
            <CardSkeleton
              key={index}
              hasHeader
              hasIcon
              contentLines={2}
              className="mb-4"
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default SkeletonLoadingScreen;
