import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from "react-i18next";
import WashingMachineCard from "@/app/components/custom/WashingMachineCard";
import {getWashingMachines} from "@/app/lib/washingMachine";

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


    const getMachine = () => {
        getWashingMachines(setRefreshing).then(r => {
            if (r) {
                setDataMachine(r);
                setIsLoading(false);
            } else {
                setError('Error while getting the washing machines');
            }
        })
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

    // Group washing machines and dryers separately
    const washingMachines = dataMachine.filter(machine => machine.nom_type.trim() === 'LAVE LINGE');
    const dryers = dataMachine.filter(machine => machine.nom_type.trim() !== 'LAVE LINGE');

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
            <Text style={styles.sectionTitle}>{t('services.washing_machine.title')}</Text>

            {washingMachines.length > 0 && (
                <>
                    <Text style={styles.subTitle}>{t('services.washing_machine.washing_machine')}</Text>
                    {washingMachines.map(item => (
                        <WashingMachineCard
                            key={item.machine_id}
                            number={item.selecteur_machine}
                            type={t('services.washing_machine.washing_machine')}
                            status={item.time_before_off}
                            icon={'WASHING MACHINE'}
                        />
                    ))}
                </>
            )}

            {dryers.length > 0 && (
                <>
                    <Text style={styles.subTitle}>{t('services.washing_machine.dryer')}</Text>
                    {dryers.map(item => (
                        <WashingMachineCard
                            key={item.machine_id}
                            number={item.selecteur_machine}
                            type={t('services.washing_machine.dryer')}
                            status={item.time_before_off}
                            icon={'DRYER'}
                        />
                    ))}
                </>
            )}

            {washingMachines.length === 0 && dryers.length === 0 && (
                <Text style={styles.emptyText}>No machines available</Text>
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
    sectionTitle: {
        color: "#ffe6cc",
        fontSize: 24,
        fontWeight: '900',
    },
    subTitle: {
        color: "#ffe6cc",
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
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