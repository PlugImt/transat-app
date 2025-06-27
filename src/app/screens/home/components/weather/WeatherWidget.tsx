import { useTheme } from "@/contexts/ThemeContext";
import i18n from "@/i18n";
import { format } from "date-fns";
import { Image, Text, View } from "react-native";
import { QUERY_KEYS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/api";
import { getDateFnsLocale } from "@/utils";
import { WeatherSkeleton } from "./WeatherSkeleton";

export const WeatherWidget = () => {
  const { data: weatherNantes, isPending, isError } = useQuery({
    queryKey: QUERY_KEYS.weather,
    queryFn: () => fetchWeather(),
  });
  
  const { theme } = useTheme();
  const locale = getDateFnsLocale(i18n.language);

  const date = new Date();


  if (isPending) {
    return <WeatherSkeleton />;
  }

  if (isError) {
    return null;
  }

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="p-6 rounded-lg flex-row justify-between gap-6"
    >
      <View>
        <Text className="h3" style={{ color: theme.text }}>
          {format(date, "PPP", { locale })}
        </Text>
        <Text className="h1 font-semibold" style={{ color: theme.text }}>
          {Math.round(weatherNantes?.temperature ?? 0)}°C
        </Text>
        <Text className="h3 font-semibold" style={{ color: theme.primary }}>
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

export default WeatherWidget;