import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';

import {Feather} from '@expo/vector-icons';
import {StyleSheet} from 'react-native';
import {BottomTabParamList} from "@/app/navigation/types";
import {Home} from "@/app/screens/Home";
import {Games} from "@/app/screens/games/Games";
import {Services} from "@/app/screens/services/Services";
import {useTranslation} from "react-i18next";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
    const theme = useTheme();
    const {t} = useTranslation();


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ec7f32',
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabLabel,
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
        position: 'absolute',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        paddingTop: 12,
        borderTopWidth: 0,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
});
