import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {  View } from 'react-native';

import { Page } from '@/components/page/Page';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackParamList } from '@/types';

export type FourchettasOrderRouteProp = RouteProp<AppStackParamList, 'FourchettasOrder'>;

export const FourchettasOrder = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const route = useRoute<FourchettasOrderRouteProp>();
    const { id } = route.params;


    return (
        <Page
            title={`Fourchettas Order ID: ${id}`}

        >
            <View className="flex-row justify-between items-end gap-8">
            </View>
        </Page>
    );
};

export default FourchettasOrder;
