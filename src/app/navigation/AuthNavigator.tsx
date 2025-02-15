import { Signin } from '@/app/screens/auth/Signin';
import { Signup } from '@/app/screens/auth/Signup';
import Welcome from '@/app/screens/auth/Welcome';
import type { AuthStackParamList } from '@/services/storage/types';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />

        </Stack.Navigator>
    );
};

export default AuthNavigator;
