import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from "@/app/hooks/useAuth";
import {AuthStackParamList} from "@/app/services/storage/types";


type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const Login = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const {login, isLoading} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                }}
                autoCapitalize="none"
                // error={error}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                }}
                secureTextEntry
                // error={error}
            />

            <Button
                title={isLoading ? "Loading..." : "Login"}
                onPress={handleLogin}
                disabled={isLoading}
            />

            <Button
                title="Create an Account"
                onPress={() => navigation.navigate('Register')}
                // variant="secondary"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
});
