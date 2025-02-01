import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as Notifications from 'expo-notifications';
import {SchedulableTriggerInputTypes} from 'expo-notifications';
import {Bell, BellRing, WashingMachineIcon, Wind} from "lucide-react-native";
import {Button} from "react-native-paper";

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

const WashingMachineCard = ({number, type, status, icon}: WashingMachineProps) => {
    const {t} = useTranslation();

    const [timeRemaining, setTimeRemaining] = useState<number>(status);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [notificationTime, setNotificationTime] = useState<string>('5');
    const [notificationSet, setNotificationSet] = useState<boolean>(false);
    const [notificationId, setNotificationId] = useState<string | null>(null);

    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    }, []);

    const getMachineStatus = useCallback((timeBeforeOff: number): string => {
        if (timeBeforeOff === 0) return t('common.free');
        return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : 'UNKNOWN';
    }, [formatTime, t]);

    useEffect(() => {
        if (timeRemaining > 0 && status > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status]);

    const scheduleNotification = async (minutes: number) => {
        if (notificationId) {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        }

        const notificationTriggerTime = timeRemaining - (minutes * 60);

        if (notificationTriggerTime > 0) {
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Machine ${number} Almost Done!`,
                    body: `Your ${type} will complete in ${minutes} minutes`,
                },
                trigger: {
                    type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: notificationTriggerTime,
                },
            });
            setNotificationId(id);
            setNotificationSet(true);
        }
    };


    const handleSetNotification = async () => {
        const minutes = parseInt(notificationTime);
        if (!isNaN(minutes) && minutes > 0) {
            await scheduleNotification(minutes);
            setModalVisible(false);
        }
    };

    const handleBellPress = async () => {
        if (status === 0) return;

        if (notificationSet) {
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            }
            setNotificationId(null);
            setNotificationSet(false);
        } else {
            setModalVisible(true);
        }
    };

    const NotificationModal = useCallback(() => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <View style={{
                    backgroundColor: '#181010',
                    padding: 20,
                    borderRadius: 10,
                    width: '80%'
                }}>
                    <Text style={{color: '#ffe6cc', fontSize: 16, marginBottom: 15}}>
                        Get notified before machine completes
                    </Text>
                    <TextInput
                        value={notificationTime}
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setNotificationTime(numericText);
                        }}
                        keyboardType="numeric"
                        placeholder="Minutes before completion"
                        style={{
                            marginBottom: 15,
                            color: '#ffe6cc',
                            backgroundColor: '#181010',
                        }}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button
                            onPress={() => setModalVisible(false)}
                            mode="outlined"
                            textColor="#ec7f32"
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={handleSetNotification}
                            mode="contained"
                            buttonColor="#ec7f32"
                        >
                            Set Notification
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    ), [modalVisible, notificationTime]);

    return (
        <TouchableWithoutFeedback accessible={true}>
            <View style={{
                padding: 10,
                backgroundColor: '#181010',
                borderRadius: 10,
                marginBottom: 15,
            }}>
                <NotificationModal/>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        minWidth: 5,
                    }}>
                        {icon.toUpperCase() === 'WASHING MACHINE' ? (
                            <WashingMachineIcon size={24} color="#ec7f32"/>
                        ) : icon.toUpperCase() === 'DRYER' ? (
                            <Wind size={24} color="#ec7f32"/>
                        ) : null}
                        <Text style={{
                            fontSize: 14,
                            color: '#ffe6cc',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            minWidth: 10,
                        }} numberOfLines={1}>
                            N°{number}
                        </Text>
                    </View>

                    <Text style={{
                        fontSize: 14,
                        color: '#ffe6cc',
                        fontWeight: 'bold',
                        marginLeft: 10,
                        flex: 1,
                        textAlign: 'center',
                    }} numberOfLines={1}>
                        {type}
                    </Text>

                    <View style={{
                        backgroundColor: status === 0 ? '#0049a8' : '#ec7f32',
                        borderRadius: 10,
                        minWidth: 70,
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginRight: 10,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#ffe6cc',
                            fontWeight: 'bold',
                            marginHorizontal: 10,
                            textAlign: 'center',
                        }} numberOfLines={1}>
                            {getMachineStatus(timeRemaining)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleBellPress}
                        disabled={status === 0}
                    >
                        {notificationSet ? (
                            <BellRing size={24}
                                      color={status === 0 ? '#494949' : '#ec7f32'}
                            />
                        ) : (
                            <Bell size={24}
                                  color={status === 0 ? '#494949' : '#ec7f32'}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default WashingMachineCard;