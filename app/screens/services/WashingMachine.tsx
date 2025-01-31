import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from "react-i18next";

interface MachineData {
    machine_id: string;
    nom_type: string;
    selecteur_machine: string;
    status: number;
    time_before_off: number;
}

export const WashingMachine: React.FC = () => {
    const {t} = useTranslation();

    const [dataMachine, setDataMachine] = useState<MachineData[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds}s`;
    };

    const getMachineStatus = (status: number, timeBeforeOff: number): string => {
        if (status === 1) return 'FREE';
        return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : 'UNKNOWN';
    };

    const getMachine = () => {
        fetch(`https://status.wi-line.fr/update_machine_ext.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: 'action=READ_LIST_STATUS&serial_centrale=65e4444c3471550a789e2138a9e28eff',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData) => {
                setDataMachine(jsonData.machine_info_status.machine_list);
                setIsLoading(false);
                setRefreshing(false);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error.message);
                setIsLoading(false);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        getMachine();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getMachine();
    };

    if (isLoading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#ffffff"/>
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
            >{t('services.washing_machine.title')}</Text>

            {dataMachine.length === 0 ? (
                <Text style={styles.emptyText}>No machines available</Text>
            ) : (
                dataMachine.map((item) => {
                    const machineType = item.nom_type.trim() === 'LAVE LINGE' ? t('services.washing_machine.washing_machine') : t('services.washing_machine.dryer');
                    const status = getMachineStatus(item.status, item.time_before_off);

                    return (
                        <View key={item.machine_id} style={styles.machineItem}>
                            <Text style={styles.machineText}>
                                N°{item.selecteur_machine} {machineType} {status}
                            </Text>
                        </View>
                    );
                })
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0D0505',
        paddingTop: 30,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0505',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    machineItem: {
        backgroundColor: '#1C1C1C',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    machineText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default WashingMachine;