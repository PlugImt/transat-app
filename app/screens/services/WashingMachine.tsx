import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native';

interface MachineData {
    machine_id: string;
    nom_type: string;
    selecteur_machine: string;
    status: number;
    time_before_off: number;
}

export const WashingMachine: React.FC = () => {
    const [dataMachine, setDataMachine] = useState<MachineData[]>([]);
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

    const renderMachineItem = ({item}: { item: MachineData }) => {
        const machineType = item.nom_type.trim() === 'LAVE LINGE' ? 'Washing Machine' : 'Dryer';
        const status = getMachineStatus(item.status, item.time_before_off);

        return (
            <View style={styles.machineItem}>
                <Text style={styles.machineText}>
                    N°{item.selecteur_machine} {machineType} {status}
                </Text>
            </View>
        );
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
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error.message);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getMachine();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ffffff"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Machine Status</Text>
            <FlatList
                data={dataMachine}
                renderItem={renderMachineItem}
                keyExtractor={(item) => item.machine_id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No machines available</Text>
                }
            />
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