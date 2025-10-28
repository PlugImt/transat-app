import { Minus, Plus} from "lucide-react-native";
import { MotiView } from "moti";
import { Image, TouchableOpacity, View } from "react-native";
import { Button, Card } from "@/components/common";
import { Text } from "@/components/common/Text";
import { ImgSkeleton, TextSkeleton } from "@/components/Skeleton";
import type { Item } from "@/dto";

interface FourchettasItemCardProps {
  item: Item;
  key: number;
  selected: boolean;
  onPress: () => void;
  orderedQuantity: number;
  onChangeOrderedQuantity: (quantity: 1 | -1) => void;
}

function FourchettasItemCard({
  item,
  selected,
  onPress,
  orderedQuantity,
  onChangeOrderedQuantity,
}: FourchettasItemCardProps) {
  return (
    <Card
      className={"w-4/5 items-center"}
      onPress={onPress}
      active={selected}
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
        
        {item.quantity > 0 && (
          <View className="absolute bottom-0 right-0 bg-primary rounded-md px-3 py-1">
            <Text variant="h3" color="primaryText">x{item.quantity}</Text>
          </View>
        )}
      </MotiView>

      <Text variant="h1" className="text-center" >
        {item.name}
      </Text>
      <Text variant="h3" className="text-center">
        {item.price} €
      </Text>

      <Text className=" text-center">{item.description}</Text>

      {orderedQuantity > 0 && (
        <TouchableOpacity
          //this container prevent the user from accidentally unselecting the item when trying to press the buttons
          onPress={() => {}}
          className="p-1 flex flex-row items-center justify-center gap-4"
        >
          <Button
            onPress={() => onChangeOrderedQuantity(-1)}
            size="sm"
            icon={<Minus />}
          />
          <Text variant="h3">{orderedQuantity}</Text>
          <Button
            onPress={() => onChangeOrderedQuantity(1)}
            size="sm"
            icon={<Plus />}
          />
        </TouchableOpacity>
      )}
    </Card>
  );
}

function FourchettasItemCardLoading() {

  return (
    <Card 
      className={"w-4/5 items-center"}
    >
      <ImgSkeleton width={160} height={160} />
      <TextSkeleton width={"50%"} textCenter />
      <TextSkeleton width={"40%"} textCenter />
      <TextSkeleton width={"100%"} textCenter />
    </Card>
  );
}

export { FourchettasItemCard, FourchettasItemCardLoading };
