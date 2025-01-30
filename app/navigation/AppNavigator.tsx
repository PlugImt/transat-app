import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from "@/app/components/navigation/Navbar";
import {AppStackParamList} from "@/app/services/storage/types";
import {WashingMachine} from "@/app/screens/services/WashingMachine";
import {Restoration} from "@/app/screens/services/Restoration";
import {Traq} from "@/app/screens/services/Traq";
import {Clubs} from "@/app/screens/services/Clubs";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator}/>
            <Stack.Screen name="WashingMachine" component={WashingMachine}/>
            <Stack.Screen name="Restoration" component={Restoration}/>
            <Stack.Screen name="Traq" component={Traq}/>
            <Stack.Screen name="Clubs" component={Clubs}/>
        </Stack.Navigator>
    );
};
