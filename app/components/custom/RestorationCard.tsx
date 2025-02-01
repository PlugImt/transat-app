import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {Beef, ChefHat, Soup, Vegan} from "lucide-react-native";

interface CardProps {
    title: string;
    meals: string[];
    icon: string;
}

const RestorationCard = ({title, meals, icon}: CardProps) => {
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
                    {icon === 'Soup' ? <Soup size={24} color="#ec7f32"/>
                        : icon === 'Beef' ? <Beef size={24} color="#ec7f32"/>
                            : icon === 'Vegan' ? <Vegan size={24} color="#ec7f32"/>
                                : icon === 'ChefHat' ? <ChefHat size={24} color="#ec7f32"/>
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
                        {title}
                    </Text>
                </View>

                {meals && meals.map((item, index) => (
                    <Text key={index} style={{fontSize: 14, color: '#ffe6cc', fontWeight: '300', marginBottom: 8}}>
                        {item}
                    </Text>
                ))}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default RestorationCard;