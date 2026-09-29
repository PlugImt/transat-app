import React from "react";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Divider } from "@/components/common/Divider";
import { Text } from "@/components/common/Text";

interface SettingCategoryProps {
  title: string;
  children: React.ReactNode;
}

const SettingCategory = ({ title, children }: SettingCategoryProps) => {
  const childrenArray = React.Children.toArray(children);
  const childrenWithSeparators = childrenArray.map((child, index) => {
    const childKey =
      React.isValidElement(child) && child.key ? child.key : `child-${index}`;

    return (
      <React.Fragment key={childKey}>
        {child}
        {index < childrenArray.length - 1 && <Divider />}
      </React.Fragment>
    );
  });

  return (
    <View className="gap-2">
      <Text variant="h3" className="ml-4">
        {title}
      </Text>
      <Card className="px-4 py-2 gap-0">{childrenWithSeparators}</Card>
    </View>
  );
};

export default SettingCategory;
