import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, Trash } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Counter } from '@/app/screens/services/fourchettas/components/Counter';
import { Badge, Card } from '@/components/common';
import { Button, IconButton } from '@/components/common/Button';
import Image from '@/components/common/Image';
import { Text } from '@/components/common/Text';
import { TextSkeleton } from '@/components/Skeleton';
import ImageSkeleton from '@/components/Skeleton/ImageSkeleton';
import { useTheme } from '@/contexts/ThemeContext';
import type { FourchettasEvent } from '@/dto';
import { useUser } from '@/hooks/account/useUser';
import { useDeleteOrder } from '@/hooks/services/fourchettas/useFourchettas';
import { combineDateAndTimeString, formatDateToDayMonth } from '@/utils/date.utils';
import { phoneWithoutSpaces } from '../utils/common';
import FourchettasDeleteModal from './order/FourchettasDeleteModal';

interface CardProps {
    event: FourchettasEvent;
    onPress?: () => void;
}

const ORDER_CLOSING_WARNING_HOURS = 12;
const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

export const FourchettasEventCard = ({ event, onPress }: CardProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { data: user } = useUser();

    const phone = phoneWithoutSpaces(user?.phone_number);
    const deleteOrderMut = useDeleteOrder(phone || '');

    const closingDateTime = useMemo(
        () => combineDateAndTimeString(event.form_closing_date, event.form_closing_time),
        [event.form_closing_date, event.form_closing_time]
    );

    const timeDiff = useMemo(() => closingDateTime.getTime() - Date.now(), [closingDateTime]);

    const onPressDelete = () => {
        deleteOrderMut.mutate({ event_id: event.id || 0 });
    };

    const isOrderClosed = timeDiff <= 0;
    const isOrderNearlyClosed =
        timeDiff <= ORDER_CLOSING_WARNING_HOURS * MILLISECONDS_PER_HOUR && timeDiff > 0;
    const hasOrdered = event.orderuser !== null;

    const formattedDate = formatDateToDayMonth(event.date);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <Card className="relative overflow-hidden p-0">
            <View className="relative h-64">
                <Image source={event.img_url} resizeMode="cover" size={64} fill />
                <LinearGradient
                    colors={[`${theme.card}00`, `${theme.card}80`, theme.card]}
                    locations={[0, 0.6, 1]}
                    style={{
                        height: 256,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    pointerEvents="none"
                />

                <View className="absolute top-4 right-4 z-10 gap-2">
                    {isOrderClosed && (
                        <Badge
                            label={t('services.fourchettas.tooLate')}
                            variant="destructive"
                            size="sm"
                        />
                    )}
                    {isOrderNearlyClosed && !isOrderClosed && (
                        <Badge
                            label={t('services.fourchettas.hurryUp')}
                            variant="warning"
                            size="sm"
                        />
                    )}
                </View>

                <View className="absolute bottom-0 left-0 right-0 px-6">
                    <Text variant="h1">{event.title}</Text>
                    {event.description && <Text numberOfLines={2}>{event.description}</Text>}
                </View>
            </View>

            <View className="px-6 pb-6 gap-4">
                <View className="flex-row items-center gap-7">
                    <View className="flex-row items-center gap-2 flex-1">
                        <Calendar size={18} color={theme.text} />
                        <Text variant="default" className="font-medium">
                            {capitalizedDate}
                        </Text>
                    </View>
                    <View className="flex-row items-center  gap-2 flex-1">
                        <Clock size={18} color={theme.text} />
                        <Text variant="default" className="font-medium">
                            {event.time.slice(0, 5)}
                        </Text>
                    </View>
                </View>

                <View className="gap-2">
                    <Text variant="sm" className="font-semibold opacity-70 uppercase tracking-wide">
                        {t('services.fourchettas.orderClosingIn')}
                    </Text>
                    <Counter date={closingDateTime} />
                </View>

                <View className="flex-row items-center gap-3 pt-2">
                    <View className="flex-1">
                        <Button
                            label={
                                hasOrdered
                                    ? t('services.fourchettas.modifyOrderButton')
                                    : t('services.fourchettas.orderButton')
                            }
                            onPress={onPress}
                            disabled={isOrderClosed}
                            size="lg"
                        />
                    </View>
                    {hasOrdered && (
                        <FourchettasDeleteModal onConfirm={onPressDelete}>
                            <IconButton
                                variant="destructive"
                                icon={<Trash />}
                                disabled={isOrderClosed}
                                size="lg"
                            />
                        </FourchettasDeleteModal>
                    )}
                </View>
            </View>
        </Card>
    );
};

export const FourchettasEventCardLoading = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <Card className="relative overflow-hidden p-0">
            <View className="relative h-64">
                <View className="absolute bottom-0 left-0 right-0 px-6">
                    <TextSkeleton variant="h1" width="80%" />
                    <TextSkeleton variant="default" width="60%" lines={2} />
                </View>
            </View>

            <View className="px-6 pb-6 gap-4">
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-2 flex-1">
                        <Calendar size={18} color={theme.text} />
                        <TextSkeleton variant="default" width="70%" />
                    </View>
                    <View className="flex-row items-center gap-2 flex-1">
                        <Clock size={18} color={theme.text} />
                        <TextSkeleton variant="default" width="50%" />
                    </View>
                </View>

                <View className="gap-2">
                    <TextSkeleton variant="sm" width={150} />
                    <View className="flex-row items-center justify-between w-full">
                        <ImageSkeleton size={50} />
                        <ImageSkeleton size={50} />
                        <ImageSkeleton size={50} />
                        <ImageSkeleton size={50} />
                    </View>
                </View>

                <View className="flex-row items-center gap-3 pt-2">
                    <View className="flex-1">
                        <Button label={t('services.fourchettas.orderButton')} disabled />
                    </View>
                </View>
            </View>
        </Card>
    );
};
