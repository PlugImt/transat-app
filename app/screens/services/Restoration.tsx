import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import RestorationCard from "@/app/components/custom/RestorationCard";
import {useTranslation} from "react-i18next";

interface MenuItem {
    pole: string;
    accompagnement: string;
    periode: string;
    nom: string;
    info1: string;
    info2: string;
}

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

    const [menuData, setMenuData] = useState<MenuData>({
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
            const targetUrl = 'https://toast-js.ew.r.appspot.com/coteresto?key=1ohdRUdCYo6e71aLuBh7ZfF2lc_uZqp9D78icU4DPufA';

            const response = await axios.get(targetUrl);
            const data = response.data;

            const regex = /var loadingData = (\[.*?])/;
            const match = data.match(regex);
            const loadingData = match ? match[1] : 'Valeur non trouvée';
            const json: MenuItem[] = JSON.parse(loadingData.substring(1));

            const newMenuData: MenuData = {
                grilladesMidi: [],
                migrateurs: [],
                cibo: [],
                accompMidi: [],
                grilladesSoir: '',
                accompSoir: ''
            };

            json.forEach((objet: MenuItem) => {
                switch (objet.pole) {
                    case 'Grillades / Plats traditions':
                        if (objet.accompagnement === "TRUE") {
                            if (objet.periode === "midi") {
                                const item = `${objet.nom} ${objet.info1}${objet.info2}`;
                                if (!newMenuData.accompMidi.includes(item)) {
                                    newMenuData.accompMidi.push(item);
                                }
                            } else {
                                newMenuData.accompSoir += `${objet.nom}\n- ${objet.info1}${objet.info2}`;
                            }
                        } else {
                            if (objet.periode === "midi") {
                                newMenuData.grilladesMidi.push(`${objet.nom} ${objet.info1}${objet.info2}`);
                            } else {
                                newMenuData.grilladesSoir += `${objet.nom}${objet.info1}${objet.info2}`;
                            }
                        }
                        break;
                    case 'Les Cuistots migrateurs':
                        if (objet.accompagnement === "TRUE") {
                            if (objet.periode === "midi") {
                                const item = `${objet.nom} ${objet.info1}${objet.info2}`;
                                if (!newMenuData.accompMidi.includes(item)) {
                                    newMenuData.accompMidi.push(item);
                                }
                            } else {
                                newMenuData.accompSoir += `${objet.nom}\n- ${objet.info1}${objet.info2}`;
                            }
                        } else {
                            newMenuData.migrateurs.push(`${objet.nom} ${objet.info1}${objet.info2}`);
                        }
                        break;
                    case 'Le Végétarien':
                        if (objet.accompagnement === "TRUE") {
                            if (objet.periode === "midi") {
                                const item = `${objet.nom} ${objet.info1}${objet.info2}`;
                                if (!newMenuData.accompMidi.includes(item)) {
                                    newMenuData.accompMidi.push(item);
                                }
                            } else {
                                newMenuData.accompSoir += `${objet.nom} ${objet.info1}${objet.info2}`;
                            }
                        } else {
                            newMenuData.cibo.push(`${objet.nom} ${objet.info1}${objet.info2}`);
                        }
                        break;
                }
            });

            setMenuData(newMenuData);
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            setError('Erreur lors du chargement du menu' + err);
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMenuData().then(r => r);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMenuData().then(r => r);
    };

    if (error) {
        alert(error);
        return (
            <Text style={styles.error}>{error}</Text>
        );
    }

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
                    fontWeight: 'bold',
                }}
                className="text-foreground font-pblack m-4 text-3xl"
            >{t('services.restoration.title')}</Text>

            {loading ? <ActivityIndicator size="large" color="#ec7f32"/> : (
                <>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('services.restoration.lunch')}</Text>

                        <RestorationCard title={t('services.restoration.grill')} meals={menuData.grilladesMidi}
                                         icon={"Beef"}/>
                        <RestorationCard title={t('services.restoration.migrator')} meals={menuData.migrateurs}
                                         icon={"ChefHat"}/>
                        <RestorationCard title={t('services.restoration.vegetarian')} meals={menuData.cibo}
                                         icon={"Vegan"}/>
                        <RestorationCard title={t('services.restoration.side_dishes')} meals={menuData.accompMidi}
                                         icon={"Soup"}/>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('services.restoration.dinner')}</Text>

                        <RestorationCard title={t('services.restoration.grill')} meals={[menuData.grilladesSoir]}
                                         icon={"Beef"}/>

                        <RestorationCard title={t('services.restoration.side_dishes')} meals={[menuData.accompSoir]}
                                         icon={"Soup"}/>
                    </View>
                </>)}
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
});

export default Restoration;