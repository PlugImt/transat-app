import React from 'react';
import {Button, View} from 'react-native';
import {useTranslation} from "react-i18next";


export const Services = () => {
    const {t} = useTranslation();

    return (
        <View>
            <Button title={t('services.washing_machine')} onPress={() => console.log('Washing machine')}/>
            <Button title={t('services.restoration')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.market')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.reservations')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.traq')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.clubs')} onPress={() => console.log('Restoration')}/>
            <Button title={t('services.events')} onPress={() => console.log('Restoration')}/>
        </View>
    );
};
