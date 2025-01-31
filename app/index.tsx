import React, {useEffect} from 'react';
import {RootNavigator} from "@/app/navigation/RootNavigator";
import '../i18n';
import * as Notifications from 'expo-notifications';

async function registerForPushNotificationsAsync() {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            return;
        }
    }
}

// Call this when app starts


const App: React.FC = () => {
    useEffect(() => {
        registerForPushNotificationsAsync().then(r => console.log('Registered for notifications:', r));
    }, []);

    return (
        <RootNavigator/>
    );
};

export default App;