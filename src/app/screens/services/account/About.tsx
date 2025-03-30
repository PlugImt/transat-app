import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView, Linking, Image } from 'react-native';
import { useTheme } from '@/themes/useThemeProvider';
import Page from '@/components/common/Page';
import { Button } from '@/components/common/Button';
import { InfoItem } from '@/components/common/InfoItem';
import { Mail, Globe, Github, Code } from 'lucide-react-native';
import Constants from 'expo-constants';

export const About = () => {
    const theme = useTheme();
    const { t } = useTranslation();

    const handleOpenLink = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error opening link:', error);
        }
    };

    return (
        <Page>
            <ScrollView className="flex-1">
                <View className="items-center justify-center py-8">
                    <Image
                        source={require('@/assets/images/icon.png')}
                        className="w-48 h-48 mb-4"
                        resizeMode="contain"
                    />
                    <Text className="text-4xl font-bold mb-2 text-white">Transat</Text>
                    <Text className="text-center text-foreground/60 mb-4">
                        {t('common.campusApp')}
                    </Text>
                    <Text className="text-center text-foreground/40 italic">
                        {t('common.plugImtNote')}
                    </Text>
                </View>

                <View className="gap-6 px-4">
                    <View className="bg-card rounded-lg px-4 py-2">
                        <Text className="text-foreground/60 mb-4">{t('common.credits')}</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <Button
                                label="Yohann"
                                onPress={() => handleOpenLink('https://github.com/yohann69')}
                                variant="outlined"
                            />
                            <Button
                                label="Enzo"
                                onPress={() => handleOpenLink('https://github.com/HeineZo')}
                                variant="outlined"
                            />
                            <Button
                                label="Lucie"
                                onPress={() => handleOpenLink('https://github.com/luclu7')}
                                variant="outlined"
                            />
                            <Button
                                label="Matis"
                                onPress={() => handleOpenLink('https://github.com/matisbyar')}
                                variant="outlined"
                            />
                            <Button
                                label="Zephyr"
                                onPress={() => handleOpenLink('https://github.com/zephyr-dassouli')}
                                variant="outlined"
                            />
                            <Button
                                label="Maxime"
                                onPress={() => handleOpenLink('https://github.com/maxbodin')}
                                variant="outlined"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Page>
    );
};

export default About;
