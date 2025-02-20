import { Avatar, AvatarImage, AvatarFallback } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/common/Dialog';
import Dropdown from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import Loading from '@/components/common/Loading';
import Page from '@/components/common/Page';
import { storage } from '@/services/storage/asyncStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Edit, GraduationCap, MapPin } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Keyboard,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { z } from 'zod';

type UserData = {
    first_name: string;
    last_name: string;
    campus: string;
    phone_number: string;
    email: string;
    graduation_year: number;
    profile_picture?: string;
};

export const EditProfile = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const userSchema = z.object({
        first_name: z.string().nonempty(t('auth.errors.firstName')),
        last_name: z.string().nonempty(t('auth.errors.lastName')),
        phone_number: z.string().min(10, t('auth.errors.phone')),
        email: z
            .string()
            .email(t('auth.errors.email'))
            .refine((email) => email.endsWith('@imt-atlantique.net'), {
                message: t('auth.errors.imtOnly'),
            }),
        password: z.string().min(6, t('auth.errors.password')),
    });

    const passwordSchema = z
        .object({
            current_password: z.string().min(6, t('auth.errors.password')),
            new_password: z.string().min(6, t('auth.errors.password')),
            new_password_confirmation: z.string().min(6, t('auth.errors.password')),
        })
        .refine((data) => data.new_password === data.new_password_confirmation, {
            message: t('account.passwordMismatch'),
            path: ['new_password_confirmation'],
        });

    const [formState, setFormState] = useState<UserData>({
        first_name: '',
        last_name: '',
        campus: '',
        phone_number: '',
        email: '',
        graduation_year: 0,
    });

    const [user, setUser] = useState<UserData>({
        first_name: '',
        last_name: '',
        campus: '',
        phone_number: '',
        email: '',
        graduation_year: 0,
    });

    const {
        control: userControl,
        handleSubmit: handleUserSubmit,
        formState: { errors: userErrors },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: formState,
        mode: 'onChange',
    });

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        mode: 'onChange',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const campusOptions = ['NANTES', 'BREST', 'RENNES'];
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString());

    const fetchUserData = useCallback(async () => {
        try {
            const userData = await storage.get('newf');
            if (userData) {
                const typedUserData = userData as UserData;
                setUser(typedUserData);
                setFormState(typedUserData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData().then((r) => r);
    }, [fetchUserData]);

    const handleUpdateProfile = async () => {
        try {
            Keyboard.dismiss();
            setIsSaving(true);
            const token = await storage.get('token');

            if (!token) {
                Alert.alert(t('common.error'), t('account.noToken'));
                return;
            }

            const response = await axios.patch(
                'https://transat.destimt.fr/api/newf/me',
                {
                    first_name: formState.first_name,
                    last_name: formState.last_name,
                    campus: formState.campus,
                    phone_number: formState.phone_number,
                    graduation_year: formState.graduation_year,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const updatedUser = { ...user, ...formState };
                await storage.set('newf', updatedUser);
                setUser(updatedUser);
                Alert.alert(t('common.success'), t('account.profileUpdated'));
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert(t('common.error'), t('account.updateFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            Keyboard.dismiss();

            setIsSaving(true);

            const response = await axios.post(
                'https://transat.destimt.fr/api/auth/change-password',
                {
                    email: user.email,
                    password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }
            );

            if (response.status === 200) {
                Alert.alert(t('common.success'), t('account.passwordChanged'));
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert(t('common.error'), t('account.passwordChangeFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateProfilePicture = async () => {
        try {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('common.error'), t('account.permissionDenied'));
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });

            if (result.canceled || !result.assets[0].uri) return;

            const image = result.assets[0];
            const base64 = await FileSystem.readAsStringAsync(image.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const formData = new FormData();
            formData.append('key', '08a0689ec289e5488db04a7da79d5dff');
            formData.append('image', base64);

            const uploadResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!uploadResponse.data.success) {
                throw new Error('Image upload failed');
            }

            const imageUrl = uploadResponse.data.data.url;

            const token = await storage.get('token');
            if (!token) {
                Alert.alert(t('common.error'), t('account.noToken'));
                return;
            }

            const patchResponse = await axios.patch(
                'https://transat.destimt.fr/api/newf/me',
                { profile_picture: imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (patchResponse.status === 200) {
                const updatedUser = { ...user, profile_picture: imageUrl };
                await storage.set('newf', updatedUser);
                setUser(updatedUser);
                Alert.alert(t('common.success'), t('account.profilePictureUpdated'));
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            Alert.alert(t('common.error'), t('account.profilePictureUpdateFailed'));
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Page className="gap-8">
            <View className="flex-row items-center justify-between m-4">
                <Text className="h1">{t('account.editProfile')}</Text>
                <Button
                    label={t('common.cancel')}
                    onPress={() => navigation.goBack()}
                    size="sm"
                    variant="ghost"
                />
            </View>
            <View className="items-center">
                <TouchableOpacity
                    className="relative"
                    onPress={handleUpdateProfilePicture}
                    activeOpacity={4}
                >
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
                    <TouchableOpacity
                        className="absolute bottom-0 right-0 bg-muted p-2 rounded-full"
                        onPress={handleUpdateProfilePicture}
                    >
                        <Edit color="#ffe6cc" size={16} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            <View className="bg-card rounded-lg px-6 py-4 gap-4">
                <Text className="h3">{t('account.personalInfo')}</Text>

                <Input
                    label={t('account.firstName')}
                    control={userControl}
                    name="first_name"
                    error={userErrors.first_name?.message}
                />

                <Input
                    label={t('account.lastName')}
                    control={userControl}
                    name="last_name"
                    error={userErrors.last_name?.message}
                />

                <Input
                    label={t('account.email')}
                    control={userControl}
                    name="email"
                    error={userErrors.email?.message}
                />

                <Input
                    label={t('account.phone')}
                    control={userControl}
                    name="phone_number"
                    error={userErrors.phone_number?.message}
                    keyboardType="phone-pad"
                />

                <Dropdown
                    label={t('account.campus')}
                    placeholder={t('account.selectCampus')}
                    icon={<MapPin color="#ffe6cc" size={20} />}
                    options={campusOptions}
                    value={formState?.campus}
                    onValueChange={(campus) => setFormState({ ...formState, campus })}
                />

                <Dropdown
                    label={t('account.graduationYear')}
                    placeholder={t('account.selectGraduationYear')}
                    icon={<GraduationCap color="#ffe6cc" size={20} />}
                    options={yearOptions}
                    value={formState?.graduation_year?.toString()}
                    onValueChange={(year) =>
                        setFormState({
                            ...formState,
                            graduation_year: Number.parseInt(year),
                        })
                    }
                />
                <Dialog>
                    <DialogContent
                        className="gap-4"
                        cancelLabel={t('common.cancel')}
                        confirmLabel={t('common.save')}
                        onConfirm={handlePasswordSubmit(handleChangePassword)}
                    >
                        <Text className="h3">{t('account.changePassword')}</Text>
                        <Input
                            label={t('account.currentPassword')}
                            control={passwordControl}
                            name="password"
                            error={passwordErrors.current_password?.message?.toString()}
                            secureTextEntry
                        />

                        <Input
                            label={t('account.newPassword')}
                            control={passwordControl}
                            name="new_password"
                            error={passwordErrors.new_password?.message?.toString()}
                            secureTextEntry
                        />

                        <Input
                            label={t('account.confirmPassword')}
                            control={passwordControl}
                            name="new_password_confirmation"
                            error={passwordErrors.new_password_confirmation?.message?.toString()}
                            secureTextEntry
                        />
                    </DialogContent>
                    <View className="gap-1.5">
                        <Text className="text-foreground/70 text-sm">{t('auth.password')}</Text>
                        <DialogTrigger>
                            <Button label={t('account.changePassword')} variant="ghost" />
                        </DialogTrigger>
                    </View>
                </Dialog>
            </View>

            <Button
                label={t('common.save')}
                onPress={handleUserSubmit(handleUpdateProfile)}
                loading={isSaving}
            />
        </Page>
    );
};

export default EditProfile;
