import {Text, TouchableWithoutFeedback, View} from 'react-native';
import * as Icons from "lucide-react-native";

interface WashingMachineProps {
    number: string;
    type: string;
    status: string;
}

const WashingMachineCard = ({number, type, status}: WashingMachineProps) => {
    console.log('WashingMachineCard', number, type, status);

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

                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    {type.toUpperCase() === 'WASHING MACHINE' ? <Icons.WashingMachine size={24} color="#ec7f32"/>
                        : type.toUpperCase() === 'DRYER' ? <Icons.Waves size={24} color="#ec7f32"/>
                            : null}

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 4,
                            color: '#ec7f32',
                            marginLeft: 10,
                        }}>
                        N°{number} {type} {status}

                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default WashingMachineCard;