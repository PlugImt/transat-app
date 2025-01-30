import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAuth} from "@/app/hooks/useAuth";
import {useTranslation} from "react-i18next";


export const Home = () => {
    const {user, logout} = useAuth();
    const {t} = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>{t('common.welcome')}, {user?.name}!</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default Home;