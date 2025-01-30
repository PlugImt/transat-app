import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackParamList} from "@/app/services/storage/types";
import {Login} from "@/app/screens/auth/Login";
import {Register} from "@/app/screens/auth/Register";

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register}/>
        </Stack.Navigator>
    );
};
