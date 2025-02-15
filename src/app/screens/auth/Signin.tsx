import { Button } from '@/components/common/ButtonV2';
import { Input } from '@/components/common/Input';
import Page from '@/components/common/Page';
import useAuth from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, type TextInput, View } from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .refine((email) => email.endsWith('@imt-atlantique.net'), {
            message: 'Email must be an IMT Atlantique address',
        }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const Signin = () => {
    const navigation = useNavigation();
    const { login, isLoading } = useAuth();
    const { t } = useTranslation();
    const [loginError, setLoginError] = useState<string | null>(null);

    const passwordRef = useRef<TextInput>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        watch,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const email = watch('email');
    const password = watch('password');

    const isButtonDisabled =
        isLoading ||
        !email ||
        !password ||
        password.length < 6 ||
        !email.endsWith('@imt-atlantique.net');

    const handleLogin = async (data: { email: string; password: string }) => {
        setLoginError(null);
        try {
            await login(data.email, data.password);
            setLoginError('Invalid email or password. Please try again.');

        } catch (err) {
            setLoginError('Invalid email or password. Please try again.');
        }
    };

    return (
        <Page className="flex flex-col gap-8">
            <ArrowLeft color="white" onPress={() => navigation.goBack()} />

            <Text className="h1">{t('auth.signIn')}</Text>

            <View className={loginError ? 'bg-red-300 p-3 rounded-md' : 'p-3'}>
                <Text className="text-red-900">{loginError}</Text>
            </View>

            <View className="flex flex-col gap-10">
                <Input
                    placeholder="christophe.lerouge@imt-atlantique.net"
                    control={control}
                    name="email"
                    label={t('auth.email')}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    error={errors.email?.message}
                />
                <Input
                    placeholder="••••••••••"
                    control={control}
                    name="password"
                    label={t('auth.password')}
                    secureTextEntry
                    ref={passwordRef}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(handleLogin)}
                    error={errors.password?.message}
                />
                <View className="flex flex-col gap-2">
                    <Button
                        label={isLoading ? t('auth.signingIn') : t('auth.signIn')}
                        onPress={handleSubmit(handleLogin)}
                        disabled={isButtonDisabled}
                        className={isButtonDisabled ? 'opacity-50' : ''}
                    >
                        {isLoading && (
                            <ActivityIndicator size="small" color="white" style={{ marginLeft: 8 }} />
                        )}
                    </Button>
                    <Button
                        label={t('auth.noAccount')}
                        onPress={() => navigation.navigate('Auth', { screen: 'Signup' })}
                        disabled={isLoading}
                        variant="link"
                    />
                </View>
            </View>
        </Page>
    );
};

export default Signin;