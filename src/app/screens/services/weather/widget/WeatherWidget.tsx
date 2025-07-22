import { format } from "date-fns";
import {
  ar,
  de,
  es,
  fr,
  hi,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ru,
  sv,
  tr,
  zhCN,
} from "date-fns/locale";
import { Image, View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import { useWeather } from "@/hooks/useWeather";
import i18n from "@/i18n";

export const WeatherWidget = () => {
  const { data: weather, isPending, isError } = useWeather();

  const date = new Date();

  const localeMap: { [key: string]: Locale } = {
    fr,
    de,
    es,
    zh: zhCN,
    ru,
    it,
    ja,
    ko,
    pt,
    nl,
    ar,
    hi,
    sv,
    tr,
    pl,
  };

  const getLocale = () => {
    return localeMap[i18n.language] || undefined;
  };

  if (isPending) {
    return <WeatherSkeleton />;
  }

  if (isError) {
    return null;
  }

  return (
    <Card className="flex-row justify-between items-center">
      <View>
        <Text>{format(date, "PPP", { locale: getLocale() })}</Text>
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
