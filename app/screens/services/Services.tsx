import React from 'react';
import {Button, ScrollView, Text} from 'react-native';
import {useTranslation} from "react-i18next";
import Card from "@/app/components/common/Card";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppStackParamList} from "@/app/services/storage/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
    const {t} = useTranslation();
    const navigation = useNavigation<AppScreenNavigationProp>();


    return (
        <ScrollView style={{
            backgroundColor: '#0D0505',
        }}>
            <Text
                className="text-foreground font-pblack m-4 text-3xl"
            >{t('services.services')}</Text>

            <Card
                image={require('@/assets/images/Logos/machine_large.png')}
                onPress={() => navigation.navigate('WashingMachine')}
            />
            <Card
                image={require('@/assets/images/Logos/restoration_large.png')}
                onPress={() => navigation.navigate('Restoration')}
            />
            <Card
                image={require('@/assets/images/Logos/clubs_large.png')}
                onPress={() => navigation.navigate('Clubs')}
            />
            <Card
                image={require('@/assets/images/Logos/traq_large.png')}
                onPress={() => navigation.navigate('Traq')}
            />
            <Card
                image={require('@/assets/images/Logos/velo_large.png')}
                onPress={() => navigation.navigate('WashingMachine')}
            />
            <Button title={t('services.market')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.reservations')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.events')} onPress={() => console.log('Restoration')}/>
        </ScrollView>
    );
};
