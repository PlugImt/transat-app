import {Text, TouchableWithoutFeedback, View} from 'react-native';
import * as Icons from "lucide-react-native";
import {useTranslation} from "react-i18next";

interface WashingMachineProps {
    number: string;
    type: string;
    status: number;
    icon: string;
}

const WashingMachineCard = ({number, type, status, icon}: WashingMachineProps) => {
    const {t} = useTranslation();

    const getMachineStatus = (timeBeforeOff: number): string => {
        if (timeBeforeOff === 0) return t('common.free');
        return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : 'UNKNOWN';
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds}s`;
    };

    return (
        <TouchableWithoutFeedback accessible={true}>
            <View
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    paddingBottom: 5,
                    backgroundColor: '#181010',
                    borderRadius: 10,
                    marginBottom: 15,
                }}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        {icon.toUpperCase() === 'WASHING MACHINE' ? <Icons.WashingMachine size={24} color="#ec7f32"/>
                            : icon.toUpperCase() === 'DRYER' ? <Icons.Wind size={24} color="#ec7f32"/>
                                : null}

                        <Text
                            numberOfLines={1}
                            style={{fontSize: 14, color: '#ffe6cc', fontWeight: 'bold', marginLeft: 20}}>
                            N°{number}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={1}
                        style={{fontSize: 14, color: '#ffe6cc', fontWeight: 'bold', marginLeft: 10}}>
                        {type}
                    </Text>

                    <View style={{
                        backgroundColor: status === 0 ? '#0049a8' : '#ec7f32',
                        borderRadius: 10
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: 14, color: '#ffe6cc', fontWeight: 'bold', margin: 10}}>
                            {getMachineStatus(status)}
                        </Text>
                    </View>

                    <Icons.Bell size={24} color={status === 0 ? '#494949' : '#ec7f32'}/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
        ;
};

export default WashingMachineCard;