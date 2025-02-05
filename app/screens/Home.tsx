import React, { useEffect, useRef, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/app/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Weather } from '@/components/custom/Weather';
import { WashingMachineSummary } from '@/components/custom/HomeCards/WashingMachineHome';
import RestaurantSummary from '@/components/custom/HomeCards/RestaurantHome';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Button } from '@/components/common/ButtonV2';
import Page from '../components/common/Page';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError(
                'Permission not granted to get push token for push notification!'
            );
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export const Home = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [refreshing, setRefreshing] = useState(true);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined,
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => {
                console.log('Retrieved Expo Push Token:', token);
                setExpoPushToken(token ?? '');
            })
            .catch((error: any) => {
                console.error('Error retrieving token:', error);
                setExpoPushToken(`${error}`);
            });

        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            }
        );

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Page refreshing={refreshing} onRefresh={() => setRefreshing(!refreshing)}>
            <Text style={styles.welcome}>
                {t('common.welcome')} <Text style={styles.colored}>{user?.name || 'Yohann'}</Text>
            </Text>

            <Weather refreshing={refreshing} setRefreshing={setRefreshing} />

            <RestaurantSummary refreshing={refreshing} setRefreshing={setRefreshing} />

            <WashingMachineSummary refreshing={refreshing} setRefreshing={setRefreshing} />

            <View className="flex items-center flex-col gap-5">
                <Button
                    label="Send Notification"
                    onPress={async () => {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: "You've got mail! 📬",
                                body: 'Here is the notification body',
                                data: { data: 'goes here' },
                            },
                            trigger: null,
                        });
                    }}
                />
                <Text className="text-center text-white">
                    Your Expo push token: {expoPushToken}
                </Text>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{
                            color: '#ffe6cc',
                            fontWeight: '900',
                            marginBottom: 20,
                        }}
                    >
                        Title: {notification && notification.request.content.title}{' '}
                    </Text>
                    <Text
                        style={{
                            color: '#ffe6cc',
                            fontWeight: '900',
                            marginBottom: 20,
                        }}
                    >
                        Body: {notification && notification.request.content.body}
                    </Text>
                    <Text
                        style={{
                            color: '#ffe6cc',
                            fontWeight: '900',
                            marginBottom: 20,
                        }}
                    >
                        Data: {notification && JSON.stringify(notification.request.content.data)}
                    </Text>
                </View>
            </View>

            <View style={{ height: 50 }} />
        </Page>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        color: '#ffe6cc',
        fontSize: 24,
        fontWeight: '900',
    },
    welcome: {
        color: '#ffe6cc',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
    },
    colored: {
        color: '#ec7f32',
    },
});

export default Home;
