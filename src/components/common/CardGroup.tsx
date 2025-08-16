import type React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { cn } from "@/utils/class.utils";
import { Button } from "./Button";

interface CardGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

const CardGroup = ({ title, children, className, onPress }: CardGroupProps) => {
  const { t } = useTranslation();
  return (
    <View className={cn(!onPress && "gap-2", className)}>
      <View className="flex-row items-center justify-between gap-4">
        <Text variant="h3" className="ml-4">
          {title}
        </Text>
        {onPress && (
          <Button
            label={t("common.seeMore")}
            onPress={onPress}
            variant="link"
          />
        )}
      </View>
      {children}
    </View>
  );
};

export default CardGroup;
