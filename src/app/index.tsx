import { RootNavigator } from "@/app/navigation/RootNavigator";
import "../i18n";
import "./global.css";
import { Dialog } from "@/components/common/Dialog";
import { ToastProvider } from "@/components/common/Toast";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevToolsBubble } from "react-native-react-query-devtools";

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
      <ToastProvider position="top">
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <RootNavigator />
            {/* <DevToolsBubble onCopy={onCopy} /> */}
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ToastProvider>
    </QueryClientProvider>
  );
}
