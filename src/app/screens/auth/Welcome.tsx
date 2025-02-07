import type { AuthStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        icon="login"
        mode="contained"
        onPress={() => navigation.navigate("Login")}
      >
        Login
      </Button>

      <Button
        icon="account-plus"
        mode="contained"
        onPress={() => navigation.navigate("Register")}
      >
        Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0D0505",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 10,
    flex: 1,
  },
  title: {
    color: "#ffe6cc",
    fontSize: 24,
    fontWeight: "900",
  },
});

export default Welcome;
