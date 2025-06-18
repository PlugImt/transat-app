import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import SkeletonLoadingScreen from "./SkeletonLoadingScreen";

export interface LoadingScreenProps {
  type?: "default" | "profile" | "card" | "list";
  items?: number;
}

export default function LoadingScreen({
  type = "default",
  items = 3,
}: LoadingScreenProps = {}) {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.background }}
      className=" px-5 justify-center items-center gap-2 h-screen"
    >
      <SkeletonLoadingScreen type={type} items={items} />
    </View>
  );
}
