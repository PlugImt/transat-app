import theme from '@/themes';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Bell, BellRing, WashingMachineIcon, Wind } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Dialog, DialogContent, DialogTrigger, useDialog } from '../common/Dialog';
import { Input } from '../common/Input';

interface WashingMachineProps {
    number: string;
    type: string;
    status: number;
    icon: string;
}

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const MINUTES_BEFORE_NOTIFICATION = 5;

const WashingMachineCard = ({ number, type, status, icon }: WashingMachineProps) => {
    const { t } = useTranslation();

    const { setOpen } = useDialog();
    const [timeRemaining, setTimeRemaining] = useState<number>(status);
    const [notificationSet, setNotificationSet] = useState<boolean>(false);
    const [notificationId, setNotificationId] = useState<string | null>(null);

    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    }, []);

    const getMachineStatus = useCallback(
        (timeBeforeOff: number): string => {
            if (timeBeforeOff === 0) return t('common.free');
            return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : 'UNKNOWN';
        },
        [formatTime, t]
    );

    useEffect(() => {
        if (timeRemaining > 0 && status > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status, timeRemaining]);

    const scheduleNotification = useCallback(
        async (minutes: number) => {
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            }

            const notificationTriggerTime = timeRemaining - minutes * 60;

            if (notificationTriggerTime > 0) {
                const id = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: t('services.washing_machine.almost_done', { number }),
                        body: t('services.washing_machine.almost_done_body', {
                            type,
                            minutes,
                        }),
                    },
                    trigger: {
                        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: notificationTriggerTime,
                    },
                });
                setNotificationId(id);
                setNotificationSet(true);
            }
        },
        [notificationId, timeRemaining, t, number, type]
    );

    const handleSetNotification = useCallback(async () => {
        await scheduleNotification(MINUTES_BEFORE_NOTIFICATION);
        setOpen(false);
    }, [scheduleNotification, setOpen]);

    const handleBellPress = async () => {
        if (status === 0) return;

        if (notificationSet) {
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            }
            setNotificationId(null);
            setNotificationSet(false);
        } 
    };

    return (
        <View className="px-6 py-4 rounded-lg bg-card flex-row justify-between gap-6 items-center">
            <View className="flex-row items-center gap-2">
                {icon.toUpperCase() === 'WASHING MACHINE' ? (
                    <WashingMachineIcon size={24} color={theme.primary} />
                ) : icon.toUpperCase() === 'DRYER' ? (
                    <Wind size={24} color={theme.primary} />
                ) : null}
                <Text className="text-foreground font-bold" numberOfLines={1}>
                    N°{number}
                </Text>
            </View>

            <Text className="text-foreground text-ellipsis font-bold">{type}</Text>

            <Badge
                label={getMachineStatus(timeRemaining)}
                variant={status === 0 ? 'secondary' : 'default'}
            />

            <DialogTrigger>
                <TouchableOpacity onPress={handleBellPress} disabled={status === 0}>
                    {notificationSet ? (
                        <BellRing color={status === 0 ? theme.muted : theme.primary} />
                    ) : (
                        <Bell color={status === 0 ? theme.muted : theme.primary} />
                    )}
                </TouchableOpacity>
            </DialogTrigger>

            <DialogContent className="gap-6">
                <Text className="h2">{t('services.washing_machine.get_notification')}</Text>
                <Text className="text-foreground lowercase">
                    {t('services.washing_machine.get_notification_description', {
                        type,
                        minutes: MINUTES_BEFORE_NOTIFICATION,
                    })}
                </Text>
                <View className="flex-row gap-4 justify-end">
                    <Button
                        onPress={() => setOpen(false)}
                        label={t('common.cancel')}
                        variant="outlined"
                    />
                    <Button onPress={handleSetNotification} label={t('common.set_notification')} />
                </View>
            </DialogContent>
        </View>
    );
};

export default WashingMachineCard;
