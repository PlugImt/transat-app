import {Text, TouchableWithoutFeedback, View} from 'react-native';
import * as Icons from "lucide-react-native";

interface WashingMachineProps {
    number: string;
    type: string;
    status: string;
}

const WashingMachineCard = ({number, type, status}: WashingMachineProps) => {
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
                    {type.toUpperCase() === 'WASHING MACHINE' ? <Icons.WashingMachine size={24} color="#ec7f32"/>
                        : type.toUpperCase() === 'DRYER' ? <Icons.Waves size={24} color="#ec7f32"/>
                            : null}

                    <Text
                        numberOfLines={1}
                        style={{fontSize: 14, color: '#ffe6cc', fontWeight: 'bold', marginLeft: 10}}>
                        N°{number}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{fontSize: 14, color: '#ffe6cc', fontWeight: 'bold', marginLeft: 10}}>
                        {type}
                    </Text>
                    <View style={{
                        backgroundColor: "#ec7f32",
                        borderRadius: 10
                    }}>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: 14, color: '#ffe6cc', fontWeight: 'bold', margin: 10}}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
        ;
};

export default WashingMachineCard;