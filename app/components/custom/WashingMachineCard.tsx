import React, {useEffect, useState} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-paper';

interface WashingMachineProps {
    number: string;
    type: string;
    status: number;
    icon: string;
}

const WashingMachineCard = ({number, type, status, icon}: WashingMachineProps) => {
    const {t} = useTranslation();

    const [timeRemaining, setTimeRemaining] = useState<number>(status);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
    };

    useEffect(() => {
        if (timeRemaining > 0 && status > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
        return undefined;
    }, [timeRemaining, status]);

    const getMachineStatus = (timeBeforeOff: number): string => {
        if (timeBeforeOff === 0) return t('common.free');
        return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : 'UNKNOWN';
    };

    return (
        <TouchableWithoutFeedback accessible={true}>
            <View
                style={{
                    padding: 10,
                    backgroundColor: '#181010',
                    borderRadius: 10,
                    marginBottom: 15,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            minWidth: 5,
                        }}
                    >
                        {icon.toUpperCase() === 'WASHING MACHINE' ? (
                            <Icon source="washing-machine" size={24} color="#ec7f32"/>
                        ) : icon.toUpperCase() === 'DRYER' ? (
                            <Icon source="weather-windy" size={24} color="#ec7f32"/>
                        ) : null}

                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 14,
                                color: '#ffe6cc',
                                fontWeight: 'bold',
                                marginLeft: 10,
                                minWidth: 10,
                            }}
                        >
                            N°{number}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 14,
                            color: '#ffe6cc',
                            fontWeight: 'bold',
                            marginLeft: 10,
                            flex: 1,
                            textAlign: 'center',
                        }}
                    >
                        {type}
                    </Text>

                    <View
                        style={{
                            backgroundColor: status === 0 ? '#0049a8' : '#ec7f32',
                            borderRadius: 10,
                            minWidth: 70,
                            paddingTop: 10,
                            paddingBottom: 10,
                            marginRight: 10,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 14,
                                color: '#ffe6cc',
                                fontWeight: 'bold',
                                marginHorizontal: 10,
                                textAlign: 'center',
                            }}
                        >
                            {getMachineStatus(timeRemaining)}
                        </Text>
                    </View>

                    <Icon
                        source="bell-outline"
                        size={24}
                        color={status === 0 ? '#494949' : '#ec7f32'}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default WashingMachineCard;
