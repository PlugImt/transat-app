import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <View className="flex-row items-center gap-4">
      {icon}
      <View className="flex-1">
        <Text>{label}</Text>
        {value ? (
          <Text color="muted" variant="sm">
            {value}
          </Text>
        ) : (
          <TextSkeleton lines={1} variant="sm" />
        )}
      </View>
    </View>
  );
};

export default InfoItem;
