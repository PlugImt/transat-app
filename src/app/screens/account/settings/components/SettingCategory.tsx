import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";

interface SettingCategoryProps {
  title: string;
  children: React.ReactNode;
}

const SettingCategory = ({ title, children }: SettingCategoryProps) => {
  return (
    <View className="gap-2">
      <Text variant="h3" className="ml-4">
        {title}
      </Text>
      <Card className="px-4 py-2">{children}</Card>
    </View>
  );
};

export default SettingCategory;
