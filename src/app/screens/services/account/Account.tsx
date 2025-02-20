import { Button } from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import Page from '@/components/common/Page';
import useAuth from '@/hooks/useAuth';
import { storage } from '@/services/storage/asyncStorage';
import theme from '@/themes';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { GraduationCap, Lock, LogOut, Mail, MapPin, Medal, Phone } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { InfoItem } from './components/InfoItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/Avatar';

type UserData = {
    first_name: string;
    last_name: string;
    campus: string;
    phone_number: string;
    email: string;
    graduation_year: string;
    profile_picture?: string;
    id_newf?: number;
    total_newf?: number;
    password_updated_date?: string;
};

export const Account = () => {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const navigation = useNavigation();
    const [user, setUser] = useState<UserData>({
        first_name: '',
        last_name: '',
        campus: '',
        phone_number: '',
        email: '',
        graduation_year: '',
        id_newf: -1,
        total_newf: -1,
        password_updated_date: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserData = useCallback(async () => {
        try {
            const userData = await storage.get('newf');
            if (userData) {
                setUser(userData as UserData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            const token = await storage.get('token');

            if (!token) {
                console.error('No token found');
                return;
            }

            // Call the API to get fresh data
            const newfResponse = await axios.get('https://transat.destimt.fr/api/newf/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (newfResponse.status === 200) {
                const newf = newfResponse.data;
                await storage.set('newf', newf);
                setUser(newf);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData().then((r) => r);

        return navigation.addListener('focus', () => {
            fetchUserData().then((r) => r);
        });
    }, [fetchUserData, navigation]);

    const handleLogout = async () => {
        try {
            await logout();
            alert('Logged out successfully. Please restart the app.');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    const handleDeleteAccount = async () => {
        alert('This feature is not yet implemented');
    };

    const navigateToEditProfile = () => {
        // @ts-ignore - Add proper typing for your navigation if needed
        navigation.navigate('EditProfile');
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Page refreshing={refreshing} onRefresh={handleRefresh} className="gap-6">
            <View className="flex-row justify-between items-center ">
                <Text className="h1">{t('common.account')}</Text>
                <Button
                    label={t('account.editProfile')}
                    onPress={navigateToEditProfile}
                    size="sm"
                    variant="ghost"
                />
            </View>

            <View className="items-center gap-2">
                <Avatar className="w-32 h-32">
                    <AvatarImage
                        source={{
                            uri: user.profile_picture,
                        }}
                    />
                    <AvatarFallback>
                        {user.first_name.charAt(0)}
                        {user.last_name.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <View className='gap-1'>
                    <Text className="text-2xl font-bold text-foreground">
                        {user.first_name} {user.last_name}
                    </Text>
                    {user.graduation_year && (
                        <Text className="text-base text-foreground/80">
                            {t('account.graduation')} {user.graduation_year}
                        </Text>
                    )}
                </View>
            </View>

            <View className="bg-card rounded-lg px-6 py-4 gap-4">
                <Text className="h3">{t('account.contactInfo')}</Text>
                <InfoItem
                    icon={<Mail color={theme.textPrimary} size={20} />}
                    label={t('account.email')}
                    value={user.email}
                />
                <InfoItem
                    icon={<Phone color={theme.textPrimary} size={20} />}
                    label={t('account.phone')}
                    value={user.phone_number || t('account.notProvided')}
                />
                <InfoItem
                    icon={<MapPin color={theme.textPrimary} size={20} />}
                    label={t('account.campus')}
                    value={user.campus || t('account.notProvided')}
                />
                <InfoItem
                    icon={<GraduationCap color={theme.textPrimary} size={20} />}
                    label={t('account.graduationYear')}
                    value={user.graduation_year || t('account.notProvided')}
                />
            </View>

            <View className="bg-card rounded-lg px-6 py-4 gap-4">
                <Text className="h3">{t('account.infos')}</Text>

                <InfoItem
                    icon={<Medal color={theme.textPrimary} size={20} />}
                    label={t('account.registration')}
                    value={`n°${user.id_newf}/${user.total_newf} ${t('account.newf')}`}
                />

                <InfoItem
                    icon={<Lock color={theme.textPrimary} size={20} />}
                    label={t('account.passwordUpdated')}
                    value={
                        user.password_updated_date
                            ? new Date(user.password_updated_date)
                                  .toLocaleString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: false,
                                  })
                                  .replace(',', '')
                            : t('account.notProvided')
                    }
                />
            </View>

            <View className="gap-2">
                <Button label={t('common.logout')} onPress={handleLogout} variant="destructive" />
                <Button
                    label={t('account.deleteAccount')}
                    onPress={handleDeleteAccount}
                    variant="outlined"
                    className="border-destructive"
                    labelClasses="text-destructive"
                />
            </View>
        </Page>
    );
};

export default Account;
