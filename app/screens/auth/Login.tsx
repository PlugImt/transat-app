import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import useAuth from "@/app/hooks/useAuth";
import {useTranslation} from "react-i18next";

export const Login = () => {
    const {login, isLoading} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {t} = useTranslation();

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
            <Text style={styles.title}>{t("common.sign_in")} <Text style={styles.colored}>Transat</Text> </Text>

            {/*<Text style={{color: 'red'}}>{error}</Text>*/}

            <View>
                <Text style={{
                    color: "#ffe6cc",
                    fontSize: 18,
                    fontWeight: '900',
                    marginBottom: 10,
                }}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={{
                    color: "#ffe6cc",
                    fontSize: 18,
                    fontWeight: '900',
                    marginBottom: 10,
                }}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title="Login"
                    onPress={handleLogin}
                    disabled={isLoading}
                />
            </View>

            {/*<Button*/}
            {/*    title="Register"*/}
            {/*    onPress={() => navigation.navigate('Register')}*/}
            {/*/>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0D0505',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 10,
        flex: 1,
    },
    input: {
        backgroundColor: '#ffe6cc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    title: {
        color: "#ffe6cc",
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
    },
    colored: {
        color: '#ec7f32',
    }
});

export default Login;