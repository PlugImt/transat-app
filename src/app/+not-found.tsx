import { View } from "react-native";
import { Text } from "@/components/common/Text";

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Page not found</Text>
    </View>
  );
}
