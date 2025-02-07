import { StyleSheet, Text, View } from "react-native";

export const Caps = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caps</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
});

export default Caps;
