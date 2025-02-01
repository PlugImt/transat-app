import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ActivityIndicator, View} from 'react-native';
import {useAuth} from "@/app/hooks/useAuth";
import {AppNavigator} from "@/app/navigation/AppNavigator";
import {AuthNavigator} from "@/app/navigation/AuthNavigator";
import {RootStackParamList} from "@/app/services/storage/types";
import {storage} from "@/app/services/storage/asyncStorage";


const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const {user, setUser} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser().then(r => r);
    }, []);

    const checkUser = async () => {
        try {
            const userData = await storage.get('user');
            if (userData) {
                setUser(userData);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        // <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {user ? (
                <Stack.Screen name="App" component={AppNavigator}/>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator}/>
            )}
        </Stack.Navigator>
        // </NavigationContainer>
    );
};

export default RootNavigator;