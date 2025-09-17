import { useTranslation } from 'react-i18next';
import { Trash } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

import { Text } from '@/components/common/Text';
import { TextSkeleton, ImgSkeleton } from '@/components/Skeleton';
import { IconButton, Button } from '@/components/common/Button';
import type { Event } from '@/dto';
import { useState } from 'react';
import { Counter } from '@/app/screens/services/fourchettas/components/Counter';
import { useDeleteOrder } from '@/hooks/useFourchettas';
import FourchettasDeleteModal from './order/FourchettasDeleteModal';
interface CardProps {
    event: Event;
    onPress?: () => void;
}

function DateFromTimestampAndTime(timestamp: string, time: string): Date {
    return new Date(`${timestamp.split('T')[0]}T${time}.000Z`);
}

function correctDate(date: string): string {
    const split = date.split('T')[0].split('-');
    return `${split[2]}/${split[1]}/${split[0]}`;
}

export const FourchettasEventCard = ({ event, onPress }: CardProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [timediff, setTimediff] = useState(
        DateFromTimestampAndTime(event.form_closing_date, event.form_closing_time).getTime() -
            Date.now()
    );

    const orderId = event.orderuser?.id;
    const deleteOrderMut = useDeleteOrder(orderId || 0, event.orderuser?.phone || '');

    function onPressDelete() {
        if (orderId) {
            deleteOrderMut.mutate();
        }
    }

    return (
        <View
            style={{ backgroundColor: theme.card }}
            className="px-6 py-8 rounded-lg gap-3 relative items-center w-10/12"
        >
            <Image
                source={{ uri: event.img_url }}
                resizeMode="contain"
                className="w-28 h-28 rounded-lg"
            />
            <Text variant="h1" className="text-center" color="primary">
                {event.title}
            </Text>
            <Text variant="lg" className="text-center font-semibold">
                {event.description}
            </Text>
            <Text variant="lg" className="text-center">
                {t('services.fourchettas.eventDateTime', {
                    date: correctDate(event.date),
                    time: event.time,
                })}
            </Text>
            <Text variant="lg" className="text-center -mb-2" color="primary">
                {t('services.fourchettas.orderClosingIn')}
            </Text>
            <Counter
                date={DateFromTimestampAndTime(event.form_closing_date, event.form_closing_time)}
            />
            <View className="relative flex flex-row items-center justify-center w-full gap-2">
                <Button
                    label={
                        event.orderuser === null
                            ? t('services.fourchettas.orderButton')
                            : t('services.fourchettas.modifyOrderButton')
                    }
                    onPress={onPress}
                    disabled={timediff <= 0}
                />
                {timediff <= 0 && (
                    <Text
                        variant="sm"
                        className="absolute -right-8 -top-2 p-1 font-bold rounded-lg text-center"
                        style={{ backgroundColor: theme.warning }}
                        color="warningText"
                    >
                        {t('services.fourchettas.tooLate')}
                    </Text>
                )}
                {timediff <= 1000 * 60 * 60 * 5 && timediff > 0 && (
                    <Text
                        variant="sm"
                        className="absolute -right-4 -top-2 p-1 font-bold rounded-lg text-center"
                        style={{ backgroundColor: theme.warning }}
                        color="warningText"
                    >
                        {t('services.fourchettas.hurryUp')}
                    </Text>
                )}
                {event.orderuser !== null && (
                    <FourchettasDeleteModal onConfirm={onPressDelete}>
                        <IconButton
                            variant="destructive"
                            icon={<Trash className="absolute -left-20" />}
                            disabled={timediff <= 0}
                        />
                    </FourchettasDeleteModal>
                )}
            </View>
        </View>
    );
};

export const FourchettasEventCardLoading = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <View
            style={{ backgroundColor: theme.card }}
            className="px-6 py-8 rounded-lg gap-6 justify-center items-center w-4/5"
        >
            <ImgSkeleton width={80} height={80} />
            <TextSkeleton lastLineWidth={100} variant="h1" />
            <TextSkeleton textCenter variant="h2" lines={3} />
            <TextSkeleton variant="h3" />
            <View className="flex-row items-center justify-between w-full">
                <ImgSkeleton width={50} height={50} />
                <ImgSkeleton width={50} height={50} />
                <ImgSkeleton width={50} height={50} />
                <ImgSkeleton width={50} height={50} />
            </View>

            <Button label={t('services.fourchettas.orderButton')} disabled={true} />
        </View>
    );
};
