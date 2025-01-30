import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from "@/app/components/navigation/Navbar";
import {AppStackParamList} from "@/app/services/storage/types";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator}/>
        </Stack.Navigator>
    );
};
