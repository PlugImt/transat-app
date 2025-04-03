import { useWeather } from "@/hooks/useWeather";
import { useTheme } from "@/themes/useThemeProvider";
import { format } from "date-fns";
import { ActivityIndicator, Image, Text, View } from "react-native";

export function Weather() {
  const theme = useTheme();
  const { data: weatherNantes, isPending, isError } = useWeather();

  const date = new Date();

  if (isPending) {
    return (
      <View className="bg-card p-4 rounded-lg flex justify-center items-center">
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <View className="p-6 rounded-lg bg-card flex-row justify-between gap-6">
      <View>
        <Text className="h3">{format(date, "PPP")}</Text>
        <Text className="h1 text-white font-semibold">
          {Math.round(weatherNantes?.temperature ?? 0)}°C
        </Text>
        <Text className="h3 text-primary font-semibold">
          {weatherNantes?.condition ?? ""}
        </Text>
      </View>
      <View className="items-center justify-center">
        <Image
          className="w-24 h-24 rounded-lg"
          source={{
            uri: weatherNantes?.img
              ? `https://openweathermap.org/img/wn/${weatherNantes.img}@4x.png`
              : undefined,
          }}
        />
      </View>
    </View>
  );
}

export default Weather;
