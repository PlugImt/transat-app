import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {BottomTabParamList} from "@/app/navigation/types";
import {Home} from "@/app/screens/Home";
import {Services} from "@/app/screens/services/Services";
import {useTranslation} from "react-i18next";
import {GridIcon, LucideHome, Play, User} from "lucide-react-native";
import Games from "@/app/screens/services/Games";
import Account from "@/app/screens/services/Account";

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
                        <LucideHome size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Services"
                component={Services}
                options={{
                    tabBarLabel: t('services.services'),
                    tabBarIcon: ({color, size}) => (
                        <GridIcon size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Games"
                component={Games}
                options={{
                    tabBarLabel: t('services.games'),
                    tabBarIcon: ({color, size}) => (
                        <Play size={size} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    tabBarLabel: t('common.account'),
                    tabBarIcon: ({color, size}) => (
                        <User size={size} color={color}/>
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

export default BottomTabNavigator;