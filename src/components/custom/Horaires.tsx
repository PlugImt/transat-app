import { Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function Horaires() {
  const { theme } = useTheme();
  return <View className="flex-col items-end">
    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>8h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>9h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>10h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>11h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>12h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>13h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>14h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>15h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>16h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>17h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>
    <Text style={{ color: theme.text }}>-</Text>

    <View className="flex-row gap-1">
      <Text style={{ color: theme.text }}>18h</Text>
      <Text style={{ color: theme.text }} className="font-bold">-</Text>
    </View>
  </View>;
}