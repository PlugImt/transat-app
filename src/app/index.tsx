import { RootNavigator } from '@/app/navigation/RootNavigator';
import '../i18n';
import './global.css';
import { Dialog } from '@/components/common/Dialog';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { DevToolsBubble } from 'react-native-react-query-devtools';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from "react-native";

export default function App() {
    const queryClient = new QueryClient();

    const onCopy = async (text: string) => {
        try {
            await Clipboard.setStringAsync(text);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <RootNavigator />
                    {/* <DevToolsBubble onCopy={onCopy} /> */}
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}

