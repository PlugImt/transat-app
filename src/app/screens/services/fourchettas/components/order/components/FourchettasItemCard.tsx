import { Minus, Plus } from "lucide-react-native";
import { MotiView } from "moti";
import { Image, View } from "react-native";
import { Card } from "@/components/common";
import { IconButton } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import type { FourchettasItem } from "@/dto";

interface FourchettasItemCardProps {
  item: FourchettasItem;
  orderedQuantity: number;
  onChangeOrderedQuantity: (quantity: 1 | -1) => void;
}

function FourchettasItemCard({
  item,
  orderedQuantity,
  onChangeOrderedQuantity,
}: FourchettasItemCardProps) {
  return (
    <Card className="items-center w-full">
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
          className="rounded-lg"
          height={160}
          width={160}
        />

        {item.quantity > 0 && (
          <View className="absolute bottom-0 right-0 bg-primary rounded-md px-3 py-1">
            <Text variant="h3" color="primaryText">
              x{item.quantity}
            </Text>
          </View>
        )}
      </MotiView>

      <View>
        <Text variant="h1" className="text-center">
          {item.name}
        </Text>
        <Text variant="h3" className="text-center" color="muted">
          {item.price} €
        </Text>
      </View>
      {item.description && (
        <Text className="text-center">{item.description}</Text>
      )}

      <View className="flex-row items-center justify-center">
        <IconButton
          onPress={() => onChangeOrderedQuantity(-1)}
          size="sm"
          icon={<Minus />}
          variant="secondary"
          disabled={orderedQuantity === 0}
        />
        <Text variant="h3" className="w-12 text-center">
          {orderedQuantity}
        </Text>
        <IconButton
          onPress={() => onChangeOrderedQuantity(1)}
          size="sm"
          icon={<Plus />}
          variant="secondary"
        />
      </View>
    </Card>
  );
}

function FourchettasItemCardLoading() {
  return (
    <Card className="items-center w-full">
      <View className="relative items-center">
        <ImageSkeleton size={160} radius={8} />
      </View>

      <View>
        <TextSkeleton variant="h1" width="70%" className="items-center" />
        <TextSkeleton variant="h3" width="40%" className="items-center" />
      </View>
      <TextSkeleton width="80%" className="items-center" />

      <View className="flex-row items-center justify-center gap-2">
        <IconButton size="sm" icon={<Minus />} variant="secondary" disabled />
        <TextSkeleton variant="h3" width={36} className="items-center" />
        <IconButton size="sm" icon={<Plus />} variant="secondary" disabled />
      </View>
    </Card>
  );
}

export { FourchettasItemCard, FourchettasItemCardLoading };
