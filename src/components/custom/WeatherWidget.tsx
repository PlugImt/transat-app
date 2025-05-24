import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useWeather } from "@/hooks/useWeather";
import i18n from "@/i18n";
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
import { Image, Text, View } from "react-native";
import { Avatar, AvatarImage } from "../common/Avatar";

export function WeatherWidget() {
  const { data: weatherNantes, isPending, isError } = useWeather();
  const { theme } = useTheme();

  const date = new Date();

  const getLocale = () => {
    switch (i18n.language) {
      case "fr":
        return fr;
      case "de":
        return de;
      case "es":
        return es;
      case "zh":
        return zhCN;
      case "ru":
        return ru;
      case "it":
        return it;
      case "ja":
        return ja;
      case "ko":
        return ko;
      case "pt":
        return pt;
      case "nl":
        return nl;
      case "ar":
        return ar;
      case "hi":
        return hi;
      case "sv":
        return sv;
      case "tr":
        return tr;
      case "pl":
        return pl;
      default:
        return undefined;
    }
  };

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
          {format(date, "PPP", { locale: getLocale() })}
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

export const WeatherSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="p-6 rounded-lg flex-row justify-between gap-6"
    >
      <View className="gap-2">
        <TextSkeleton variant="h3" className="w-64" lines={1} />
        <TextSkeleton variant="h1" className="w-32" lines={1} />
        <TextSkeleton variant="h3" className="w-32" lines={1} />
      </View>
      <Avatar className="w-24 h-24">
        <AvatarImage loading />
      </Avatar>
    </View>
  );
};
