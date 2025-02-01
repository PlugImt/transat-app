import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAuth} from "@/app/hooks/useAuth";
import {useTranslation} from "react-i18next";
import {Weather} from "@/app/components/custom/Weather";


export const Home = () => {
    const {user} = useAuth();
    const {t} = useTranslation();

    const [refreshing, setRefreshing] = useState(true);


    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>{t('common.welcome')} <Text
                style={styles.colored}>{user?.name || "Yohann"}</Text></Text>

            <Weather refreshing={refreshing} setRefreshing={setRefreshing}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0D0505',
        paddingTop: 30,
    },
    sectionTitle: {
        color: "#ffe6cc",
        fontSize: 24,
        fontWeight: '900',
    },
    welcome: {
        color: "#ffe6cc",
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
    },
    colored: {
        color: '#ec7f32',
    }
});

export default Home;