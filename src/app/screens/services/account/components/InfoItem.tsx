import { Text, View } from "react-native";

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <View className="flex-row items-center gap-4">
      {icon}
      <View className="gap-0.5">
        <Text className="text-sm text-muted-foreground">{label}</Text>
        <Text className="text-foreground">{value}</Text>
      </View>
    </View>
  );
};
