import { MotiView } from "moti";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "react-native";

import type { Item } from "@/dto";

interface FourchettasItemCardProps {
  item: Item;
  selected: boolean;
  onPress: () => void;
}

function FourchettasItemCard({
  item,
  selected,
  onPress,
}: FourchettasItemCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={{ backgroundColor: theme.card }}
      className={`flex-col w-4/5 border-primary ${selected ? "border-2" : ""} justify-between items-center p-4 gap-4 rounded-lg shadow`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MotiView
        className="relative"
        from={{ rotate: "-5deg" }}
        animate={{ rotate: "5deg" }}
        transition={{
          type: "timing",
          duration: 2500,
          loop: true,
          repeatReverse: true,
        }}
      >
        <Image
          source={{
            uri: item.img_url,
          }}
          resizeMode="contain"
          className="w-40 h-40 rounded-lg"
        />
        <View className="absolute bottom-0 right-0 bg-primary rounded-md px-3 py-1">
          <Text variant="h3">x{item.quantity}</Text>
        </View>
      </MotiView>

      <Text variant="h1" className="text-center" color="primary">
        {item.name}
      </Text>
      <Text variant="h3" className="text-center">
        {item.price} €
      </Text>

      <Text className=" text-center">{item.description}</Text>
    </TouchableOpacity>
  );
}

export { FourchettasItemCard };
