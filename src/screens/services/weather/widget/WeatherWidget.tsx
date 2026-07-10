import { Image, View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { WidgetBoundary } from "@/components/query";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import { useDate } from "@/hooks/common";
import { useWeather } from "@/hooks/services/weather/useWeather";

export const WeatherWidget = () => {
  const { data: weather, isPending, isFetching, isError, error, refetch } =
    useWeather();
  const { formatLong } = useDate();

  const date = new Date();

  return (
    <WidgetBoundary
      query={{
        isPending,
        isFetching,
        isError,
        error,
        refetch,
      }}
      loading={<WeatherSkeleton />}
    >
      <Card className="flex-row justify-between items-center">
        <View>
          <Text>{formatLong(date)}</Text>
          <Text variant="h1">{Math.round(weather?.temperature ?? 0)}°C</Text>
          <Text variant="lg" color="muted">
            {weather?.condition ?? ""}
          </Text>
        </View>
        <View className="items-center justify-center">
          <Image
            className="w-24 h-24 rounded-lg"
            source={{
              uri: weather?.img
                ? `https://openweathermap.org/img/wn/${weather.img}@4x.png`
                : undefined,
            }}
          />
        </View>
      </Card>
    </WidgetBoundary>
  );
};

export default WeatherWidget;

export const WeatherSkeleton = () => {
  return (
    <Card className="flex-row justify-between items-center gap-0">
      <View>
        <TextSkeleton variant="h3" className="w-64" />
        <TextSkeleton variant="h1" className="w-32" />
        <TextSkeleton variant="h3" className="w-32" />
      </View>
      <AvatarSkeleton size={64} />
    </Card>
  );
};
