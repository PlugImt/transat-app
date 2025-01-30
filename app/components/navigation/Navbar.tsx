import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather} from '@expo/vector-icons';
import {StyleSheet} from 'react-native';
import {BottomTabParamList} from "@/app/navigation/types";
import {Home} from "@/app/screens/Home";
import {Games} from "@/app/screens/games/Games";
import {Services} from "@/app/screens/services/Services";
import {useTranslation} from "react-i18next";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
    const {t} = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ec7f32',
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: t('common.home'),
                    tabBarIcon: ({color, size}) => (
                        <Feather name="home" size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Services"
                component={Services}
                options={{
                    tabBarLabel: t('services.services'),
                    tabBarIcon: ({color, size}) => (
                        <Feather name="grid" size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Games"
                component={Games}
                options={{
                    tabBarLabel: t('services.games'),
                    tabBarIcon: ({color, size}) => (
                        <Feather name="play" size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                //@ts-ignore
                name="Account"
                component={Games}
                options={{
                    tabBarLabel: t('common.account'),
                    tabBarIcon: ({color, size}) => (
                        <Feather name="user" size={size} color={color}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#0D0505',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 50,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
});