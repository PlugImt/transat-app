import type React from "react";
import { StyleSheet, TextInput, View } from "react-native";

class InputProps {
  placeholder: string | undefined;
  value: string | undefined;
  onChangeText: ((text: string) => void) | undefined;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
      {/*{error ? <Text style={styles.error}>{error}</Text> : null}*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
});

export default Input;
