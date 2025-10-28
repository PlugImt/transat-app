import { MotiView } from 'moti';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/common/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { Image } from 'react-native';
import { Plus, X, Minus } from 'lucide-react-native';

import type { Item } from '@/dto';
import { ImgSkeleton, TextSkeleton } from '@/components/Skeleton';
import { Button } from '@/components/common';

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
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            style={{ backgroundColor: theme.card }}
            className={`flex-col w-4/5 border-primary ${
                selected ? 'border-2' : ''
            } justify-between items-center p-4 gap-4 rounded-lg shadow`}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <MotiView
                className="relative"
                from={{ rotate: '-5deg' }}
                animate={{ rotate: '5deg' }}
                transition={{
                    type: 'timing',
                    duration: 2500,
                    loop: true,
                    repeatReverse: true,
                }}
            >
                {item.id === 0 ? (
                    <X size={160} color={theme.text} />
                ) : (
                    <Image
                        source={{
                            uri: item.img_url,
                        }}
                        resizeMode="contain"
                        className="w-40 h-40 rounded-lg"
                    />
                )}
                {item.quantity > 0 && (
                    <View className="absolute bottom-0 right-0 bg-primary rounded-md px-3 py-1">
                        <Text variant="h3">x{item.quantity}</Text>
                    </View>
                )}
            </MotiView>

            <Text variant="h1" className="text-center" color="primary">
                {item.name}
            </Text>
            <Text variant="h3" className="text-center">
                {item.price} €
            </Text>

            <Text className=" text-center">{item.description}</Text>

            {orderedQuantity > 0 && (
                <TouchableOpacity
                    onPress={() => {}}
                    className="p-1 flex flex-row items-center justify-center gap-4"
                >
                    <Button
                        onPress={() => onChangeOrderedQuantity(-1)}
                        size="sm"
                        icon={<Minus />}
                    />
                    <Text variant="h3">{orderedQuantity}</Text>
                    <Button onPress={() => onChangeOrderedQuantity(1)} size="sm" icon={<Plus />} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

function FourchettasItemCardLoading() {
    const { theme } = useTheme();

    return (
        <View
            className="flex-col w-4/5 justify-between items-center p-4 gap-4 rounded-lg shadow"
            style={{ backgroundColor: theme.card }}
        >
            <ImgSkeleton width={160} height={160} />
            <TextSkeleton width={'50%'} textCenter />
            <TextSkeleton width={'40%'} textCenter />
            <TextSkeleton width={'100%'} textCenter />
        </View>
    );
}

export { FourchettasItemCard, FourchettasItemCardLoading };
