import { RootNavigator } from "@/app/navigation/RootNavigator";
import "../i18n";
import "./global.css";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
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
      <RootNavigator />
      <DevToolsBubble onCopy={onCopy} />
    </QueryClientProvider>
  );
}
