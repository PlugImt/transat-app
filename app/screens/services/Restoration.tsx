import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';

// Define interfaces for our data structure
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
    const [menuData, setMenuData] = useState<MenuData>({
        grilladesMidi: [],
        migrateurs: [],
        cibo: [],
        accompMidi: [],
        grilladesSoir: '',
        accompSoir: ''
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const targetUrl = 'https://toast-js.ew.r.appspot.com/coteresto?key=1ohdRUdCYo6e71aLuBh7ZfF2lc_uZqp9D78icU4DPufA';

            const response = await axios.get(proxyUrl + targetUrl);
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
        } catch (err) {
            setError('Erreur lors du chargement du menu' + err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Menu RU</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Menu du Midi</Text>

                <Text style={styles.subTitle}>Grillades</Text>
                {menuData.grilladesMidi.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>{item}</Text>
                ))}

                <Text style={styles.subTitle}>Les Cuistots Migrateurs</Text>
                {menuData.migrateurs.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>{item}</Text>
                ))}

                <Text style={styles.subTitle}>Menu Végétarien</Text>
                {menuData.cibo.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>{item}</Text>
                ))}

                <Text style={styles.subTitle}>Accompagnements</Text>
                {menuData.accompMidi.map((item, index) => (
                    <Text key={index} style={styles.menuItem}>{item}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Menu du Soir</Text>

                <Text style={styles.subTitle}>Grillades</Text>
                <Text style={styles.menuItem}>{menuData.grilladesSoir}</Text>

                <Text style={styles.subTitle}>Accompagnements</Text>
                <Text style={styles.menuItem}>{menuData.accompSoir}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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
        color: '#333',
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
        color: '#444',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});
