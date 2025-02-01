import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import RestorationCard from "@/app/components/custom/RestorationCard";
import {useTranslation} from "react-i18next";
import {getRestoration} from "@/app/lib/restoration";
import {isWeekend} from "@/app/lib/utils";

interface MenuData {
    grilladesMidi: string[];
    migrateurs: string[];
    cibo: string[];
    accompMidi: string[];
    grilladesSoir: string;
    accompSoir: string;
}

export const Restoration = () => {
    const {t} = useTranslation();

    const [menuData, setMenuData] = useState<MenuData | undefined>({
        grilladesMidi: [],
        migrateurs: [],
        cibo: [],
        accompMidi: [],
        grilladesSoir: '',
        accompSoir: ''
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchMenuData = async () => {
        try {
            const data = await getRestoration(setRefreshing);
            setMenuData(data);
        } catch (error: any) {
            console.error('Error while getting the menu :', error);
            setError("" + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMenuData().then(r => r);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#ec7f32']}
                    progressBackgroundColor="#0D0505"
                />
            }
        >
            <Text
                style={{
                    color: "#ffe6cc",
                    fontSize: 24,
                    fontWeight: '900',
                }}
                className="text-foreground font-pblack m-4 text-3xl"
            >{t('services.restoration.title')}</Text>

            {loading ? <ActivityIndicator size="large" color="#ec7f32"/> : (
                <>
                    {isWeekend() ? (
                        <View style={[styles.center, {minHeight: '100%'}]}>
                            <Image source={require('@/assets/images/Logos/resoration.png')}
                                   style={{width: 150, height: 150, tintColor: 'gray'}}/>
                            <Text style={styles.error}>{t('services.restoration.closed')}</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.center}>
                            <Text style={styles.error}>{error}</Text>
                        </View>
                    ) : menuData?.grilladesMidi.length === 0 && menuData?.migrateurs.length === 0
                    && menuData?.cibo.length === 0 && menuData?.accompMidi.length === 0
                    && menuData?.grilladesSoir.length === 0 && menuData?.accompSoir.length === 0 ? (
                        <View style={[styles.center, {minHeight: '100%'}]}>
                            <Image source={require('@/assets/images/Logos/resoration.png')}
                                   style={{width: 150, height: 150, tintColor: 'gray'}}/>
                            <Text style={styles.error}>{t('services.restoration.no_data')}</Text>
                        </View>
                    ) : (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('services.restoration.lunch')}</Text>

                            <RestorationCard title={t('services.restoration.grill')} meals={menuData?.grilladesMidi}
                                             icon={"Beef"}/>
                            <RestorationCard title={t('services.restoration.migrator')} meals={menuData?.migrateurs}
                                             icon={"ChefHat"}/>
                            <RestorationCard title={t('services.restoration.vegetarian')} meals={menuData?.cibo}
                                             icon={"Vegan"}/>
                            <RestorationCard title={t('services.restoration.side_dishes')}
                                             meals={menuData?.accompMidi}
                                             icon={"Soup"}/>
                        </View>
                    )}

                    {menuData?.grilladesSoir && menuData?.accompSoir && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('services.restoration.dinner')}</Text>

                            <RestorationCard title={t('services.restoration.grill')}
                                             meals={[menuData?.grilladesSoir]}
                                             icon={"Beef"}/>

                            <RestorationCard title={t('services.restoration.side_dishes')}
                                             meals={[menuData?.accompSoir]}
                                             icon={"Soup"}/>
                        </View>
                    )}


                </>)}

            <View style={{height: 50}}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0D0505',
        paddingTop: 30,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#c0c0c0',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#666',
    },
    menuItem: {
        fontSize: 16,
        marginBottom: 5,
        paddingLeft: 10,
        color: '#b7b7b7',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Restoration;