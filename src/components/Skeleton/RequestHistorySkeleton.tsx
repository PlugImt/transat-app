import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import Skeleton from "./Skeleton";

interface RequestHistorySkeletonProps {
  count?: number;
}

export const RequestHistorySkeleton = ({
  count = 3,
}: RequestHistorySkeletonProps) => {
  const { theme } = useTheme();

  return (
    <View className="gap-4">
      {Array.from(
        { length: count },
        (_, index) => `skeleton-${index}-${Date.now()}`,
      ).map((key) => (
        <View
          key={key}
          className="rounded-lg p-4"
          style={{ backgroundColor: theme.card }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <Skeleton height={20} width={120} variant="rounded" />
            <Skeleton height={16} width={80} variant="rounded" />
          </View>
          <Skeleton height={16} width="90%" className="mb-2" />
          <Skeleton height={16} width="70%" className="mb-3" />
          <View className="flex-row justify-between items-center">
            <Skeleton height={24} width={100} variant="rounded" />
            <Skeleton height={20} width={20} variant="circle" />
          </View>
        </View>
      ))}
    </View>
  );
};

export default RequestHistorySkeleton;
