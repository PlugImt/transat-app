import { Clock, EuroIcon, Info, InfoIcon, MapPin, Plus } from 'lucide-react-native';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Dialog, DialogContent, DialogTrigger } from '../common/Dialog';
import theme from '@/themes';
import { IconButton } from '../common/Button';

interface AboutModalProps {
    title: string;
    description: string;
    openingHours: OpeningHours[];
    location: string;
    price: string;
    additionalInfo: string;
}

interface OpeningHours {
    day: string;
    lunch: string;
    dinner: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({
    title,
    description,
    openingHours,
    location,
    price,
    additionalInfo,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog>
            <DialogTrigger>
                <IconButton icon={<InfoIcon />} variant="link" />
            </DialogTrigger>
            <DialogContent title={title} confirmLabel={t('common.close')} className="gap-8">
                <Text className="text-foreground">{description}</Text>

                <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                        <Clock size={20} color={theme.primary} />
                        <Text className="text-foreground font-bold">
                            {t('services.opening_hours')}
                        </Text>
                    </View>

                    {openingHours.map((item) => (
                        <View key={item.day} className="flex-row justify-between w-full">
                            <Text className="text-foreground w-1/3">{item.day}</Text>
                            <Text className="text-foreground w-1/3 text-right">{item.lunch}</Text>
                            <Text className="text-foreground w-1/3 text-right">{item.dinner}</Text>
                        </View>
                    ))}
                </View>

                <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                        <MapPin size={20} color={theme.primary} />
                        <Text className="text-foreground font-bold">{t('services.location')}</Text>
                    </View>

                    <Text className="text-foreground">{location}</Text>
                </View>

                <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                        <EuroIcon size={20} color={theme.primary} />
                        <Text className="text-foreground font-bold">{t('services.price')}</Text>
                    </View>

                    <Text className="text-foreground">{price}</Text>
                </View>

                <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                        <Plus size={20} color={theme.primary} />
                        <Text className="text-foreground font-bold">
                            {t('services.additional_info')}
                        </Text>
                    </View>

                    <Text className="text-foreground">{additionalInfo}</Text>
                </View>
            </DialogContent>
        </Dialog>
    );
};
