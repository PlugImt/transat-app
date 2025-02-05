import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppStackParamList} from "@/app/services/storage/types";
import {getRestoration} from "@/app/lib/restoration";
import {Beef, ChefHat, Soup, Vegan} from "lucide-react-native";
import {isDinner, isLunch, isWeekend} from "@/lib/utils";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

interface RestorationSummaryProps {
    setRefreshing: (refreshing: boolean) => void;
    refreshing: boolean;
}

interface MenuData {
    grilladesMidi: string[];
    migrateurs: string[];
    cibo: string[];
    accompMidi: string[];
    grilladesSoir: string[];
    accompSoir: string[];
}

export function RestorationSummary({ setRefreshing, refreshing }: RestorationSummaryProps) {
    const { t } = useTranslation();

    const navigation = useNavigation<AppScreenNavigationProp>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [menuData, setMenuData] = useState<MenuData | undefined>({
        grilladesMidi: [],
        migrateurs: [],
        cibo: [],
        accompMidi: [],
        grilladesSoir: [],
        accompSoir: [],
    });

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const data = await getRestoration(setRefreshing);
                setMenuData(data);
            } catch (error: any) {
                console.error('Error while getting the menu :', error);
                setError('' + error.message);
            } finally {
                setRefreshing(false);
                setIsLoading(false);
            }
        };

        fetchMenuData().then(r => r);
    }, [refreshing]);

    if (isLoading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.subTitle}>{t('services.restoration.title')} {!isWeekend() && isLunch() ? (
                t('services.restoration.lunch')) : !isWeekend() && isDinner() ? (t('services.restoration.dinner')) : null}</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Restoration')} accessible={true}
                              activeOpacity={0.4}>
                <View
                    style={{
                        backgroundColor: '#181010',
                        padding: 15,
                        borderRadius: 10,
                        alignItems: 'flex-start',
                        marginBottom: 15,
                    }}
                >
                    {isWeekend() ? (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <Image source={require('@/assets/images/Logos/resoration.png')}
                                   style={{ width: 70, height: 70, tintColor: 'gray' }} />
                            <Text style={styles.closed}>{t('services.restoration.closed')}</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.center}>
                            <Text style={styles.error}>{error}</Text>
                        </View>
                    ) : isLunch() ? (
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                                <View style={{ alignItems: 'flex-start', flex: 1, paddingRight: 5 }}>
                                    <View style={styles.container}>
                                        <View style={styles.row}>
                                            <Beef size={18} color="#ec7f32" />
                                            <Text style={styles.title}>{t('services.restoration.grill')}</Text>
                                        </View>

                                        {menuData?.grilladesMidi.map((item, index) => (
                                            <Text key={index} style={styles.itemText}>
                                                {item}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.container}>
                                        <View style={styles.row}>
                                            <ChefHat size={18} color="#ec7f32" />
                                            <Text style={styles.title}>{t('services.restoration.migrator')}</Text>
                                        </View>

                                        {menuData?.migrateurs.map((item, index) => (
                                            <Text key={index} style={styles.itemText}>
                                                {item}
                                            </Text>
                                        ))}
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-start', flex: 1, paddingLeft: 5 }}>
                                    <View style={styles.container}>
                                        <View style={styles.row}>
                                            <Vegan size={18} color="#ec7f32" />
                                            <Text style={styles.title}>{t('services.restoration.vegetarian')}</Text>
                                        </View>

                                        {menuData?.cibo.map((item, index) => (
                                            <Text key={index} style={styles.itemText}>
                                                {item}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.container}>
                                        <View style={styles.row}>
                                            <Soup size={18} color="#ec7f32" />
                                            <Text style={styles.title}>{t('services.restoration.side_dishes')}</Text>
                                        </View>

                                        {menuData?.accompMidi.map((item, index) => (
                                            <Text key={index} style={styles.itemText}>
                                                {item}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : isDinner() ? (
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                                <View style={{ alignItems: 'flex-start', flex: 1, paddingRight: 5 }}>
                                    <View style={styles.container}>
                                        <View style={styles.row}>
                                            <Beef size={18} color="#ec7f32" />
                                            <Text style={styles.title}>{t('services.restoration.grill')}</Text>
                                        </View>

                                        {menuData?.grilladesSoir.map((item, index) => (
                                            <Text key={index} style={styles.itemText}>
                                                {item}
                                            </Text>
                                        ))}
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-start', flex: 1, paddingLeft: 5 }}>
                                    <View style={styles.container}>
                                        <View style={styles.row}>
                                            <Soup size={18} color="#ec7f32" />
                                            <Text style={styles.title}>{t('services.restoration.side_dishes')}</Text>
                                        </View>

                                        {menuData?.accompSoir.map((item, index) => (
                                            <Text key={index} style={styles.itemText}>
                                                {item}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.center}>
                            <Text style={styles.error}>{t('services.restoration.closed_night')}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0505',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    subTitle: {
        color: '#ffe6cc',
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 5,
        marginTop: 5,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        color: '#ffe6cc',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
    },
    itemText: {
        fontSize: 12,
        color: '#ffe6cc',
        fontWeight: '300',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    closed: {
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
        paddingLeft: 50,
        paddingRight: 50,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default RestorationSummary;
