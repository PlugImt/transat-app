import { View } from "react-native";
import Skeleton from "./Skeleton";
import TextSkeleton from "./TextSkeleton";

export interface WidgetSkeletonProps {
  title?: boolean;
  contentType?: "default" | "grid" | "list";
  gridColumns?: number;
  gridItems?: number;
  listItems?: number;
  className?: string;
}

export function WidgetSkeleton({
  title = true,
  contentType = "default",
  gridColumns = 2,
  gridItems = 4,
  listItems = 3,
  className,
}: WidgetSkeletonProps) {
  return (
    <View className={`flex flex-col gap-2 ${className}`}>
      {title && (
        <TextSkeleton lines={1} width="40%" lineHeight={24} className="mb-1" />
      )}
      <View className="bg-card p-4 rounded-lg">
        {contentType === "default" && (
          <TextSkeleton lines={4} width="100%" lineHeight={16} spacing={8} />
        )}

        {contentType === "grid" && (
          <View className="flex-row flex-wrap">
            {Array.from({ length: gridItems }).map((_, index) => (
              <View
                key={index}
                style={{ width: `${100 / gridColumns}%` }}
                className="p-1"
              >
                <Skeleton
                  width="100%"
                  height={60}
                  variant="rounded"
                  className="mb-2"
                />
                <TextSkeleton
                  lines={1}
                  width="80%"
                  lineHeight={16}
                  className="mb-1"
                />
                <TextSkeleton lines={1} width="60%" lineHeight={14} />
              </View>
            ))}
          </View>
        )}

        {contentType === "list" && (
          <View className="flex-col">
            {Array.from({ length: listItems }).map((_, index) => (
              <View
                key={index}
                className={`flex-row items-center ${
                  index < listItems - 1 ? "mb-4" : ""
                }`}
              >
                <Skeleton
                  variant="circle"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <View className="flex-1">
                  <TextSkeleton
                    lines={1}
                    width="60%"
                    lineHeight={18}
                    className="mb-1"
                  />
                  <TextSkeleton lines={1} width="40%" lineHeight={14} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default WidgetSkeleton;
