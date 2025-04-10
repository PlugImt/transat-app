import { cn } from "@/lib/utils";
import { Text, View } from "react-native";

type DividerProps = {
  label?: string;
  className?: string;
};

const Divider = ({ label, className }: DividerProps) => {
  if (label) {
    return (
      <View className={cn("flex-row items-center my-2", className)}>
        <View className="h-px rounded-full bg-muted/60 flex-1" />
        <Text className="text-foreground/60 text-sm mx-3">{label}</Text>
        <View className="h-px rounded-full bg-muted/60 flex-1" />
      </View>
    );
  }

  return (
    <View
      className={`h-px rounded-full bg-muted/60 w-full my-2 ${className || ""}`}
    />
  );
};

export default Divider;
