import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigator } from '@/components/navigation/Navbar';
import { AppStackParamList } from '@/app/services/storage/types';
import { WashingMachine } from '@/app/screens/services/WashingMachine';
import { Restaurant } from '@/app/screens/services/Restaurant';
import { Traq } from '@/app/screens/services/Traq';
import { Clubs } from '@/app/screens/services/Clubs';
import Home from '@/app/screens/Home';

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="WashingMachine" component={WashingMachine} />
            <Stack.Screen name="Restaurant" component={Restaurant} />
            <Stack.Screen name="Traq" component={Traq} />
            <Stack.Screen name="Clubs" component={Clubs} />
        </Stack.Navigator>
    );
};

export default AppNavigator;