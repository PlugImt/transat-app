import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WashingMachineIcon, Wind} from 'lucide-react-native';
import {getWashingMachines} from "@/app/lib/washingMachine";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppStackParamList} from "@/app/services/storage/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

interface WashingMachineSummaryProps {
    setRefreshing: (refreshing: boolean) => void;
    refreshing: boolean;
}

interface MachineData {
    machine_id: string;
    nom_type: string;
    selecteur_machine: string;
    status: number;
    time_before_off: number;
}

export function WashingMachineSummary({setRefreshing, refreshing}: WashingMachineSummaryProps) {
    const {t} = useTranslation();

    const navigation = useNavigation<AppScreenNavigationProp>();

    const [dataMachine, setDataMachine] = useState<MachineData[] | undefined>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalWashers, setTotalWashers] = useState<number>(0);
    const [totalDryers, setTotalDryers] = useState<number>(0);
    const [availableWashers, setAvailableWashers] = useState<number>(0);
    const [availableDryers, setAvailableDryers] = useState<number>(0);


    useEffect(() => {
        async function fetchWashingMachines() {
            try {
                const data = await getWashingMachines(setRefreshing);
                setDataMachine(data);

                // Group washing machines and dryers separately
                const washingMachines = dataMachine?.filter(machine => machine.nom_type.trim() === 'LAVE LINGE');
                const dryers = dataMachine?.filter(machine => machine.nom_type.trim() !== 'LAVE LINGE');

                setTotalWashers(washingMachines?.length || 0);
                setTotalDryers(dryers?.length || 0);

                setAvailableWashers(washingMachines?.filter(machine => machine.time_before_off === 0).length || 0);
                setAvailableDryers(dryers?.filter(machine => machine.time_before_off === 0).length || 0);
            } catch (error: any) {
                console.error('Error while getting the washing machines :', error);
                setError("" + error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchWashingMachines().then(r => r);
    }, [refreshing]);

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
        <View>
            <Text style={styles.subTitle}>{t('services.washing_machine.title')}</Text>

            <TouchableOpacity onPress={() => navigation.navigate('WashingMachine')} accessible={true}
                              activeOpacity={0.4}>
                <View
                    style={{
                        backgroundColor: '#181010',
                        padding: 15,
                        borderRadius: 10,
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <View style={{alignItems: 'center', flex: 1}}>
                            <WashingMachineIcon size={40} color={
                                availableWashers === 0 ? '#494949' : '#ec7f32'
                            }/>
                            <Text style={{
                                color: '#ffe6cc',
                                fontSize: 16,
                                marginTop: 5
                            }}>
                                {availableWashers}/{totalWashers}
                            </Text>
                            <Text style={{
                                color: '#ffe6cc',
                                fontSize: 12
                            }}>
                                {t('services.washing_machine.available_machines')}
                            </Text>
                        </View>
                        <View style={{alignItems: 'center', flex: 1}}>
                            <Wind size={40} color={
                                availableDryers === 0 ? '#494949' : '#ec7f32'
                            }/>
                            <Text style={{
                                color: '#ffe6cc',
                                fontSize: 16,
                                marginTop: 5
                            }}>
                                {availableDryers}/{totalDryers}
                            </Text>
                            <Text style={{
                                color: '#ffe6cc',
                                fontSize: 12
                            }}>
                                {t('services.washing_machine.available_dryers')}
                            </Text>
                        </View>
                    </View>
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
        color: "#ffe6cc",
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 5,
        marginTop: 5,
    },
});


export default WashingMachineSummary;
