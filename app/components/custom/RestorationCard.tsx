import {Text, TouchableWithoutFeedback, View} from 'react-native';

interface CardProps {
    title: string;
    meals: string[];
    icon: JSX.Element;
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
                    {icon}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: 18,
                            fontWeight: 'black',
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