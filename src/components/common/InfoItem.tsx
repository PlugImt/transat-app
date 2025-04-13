import { Text, View } from "react-native";
import { TextSkeleton } from "../Skeleton";

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <View className="flex-row items-center gap-4">
      {icon}
      <View className="gap-0.5 w-full">
        <Text className="text-sm text-muted-foreground">{label}</Text>
        {value ? (
          <Text className="text-sm text-muted-foreground/80">{value}</Text>
        ) : (
          <TextSkeleton lines={1} lineHeight={14} />
        )}
      </View>
    </View>
  );
};

export default InfoItem;
