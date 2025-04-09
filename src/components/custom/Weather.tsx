import { useWeather } from "@/hooks/useWeather";
import i18n from "@/i18n";
import { useTheme } from "@/themes/useThemeProvider";
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
import { ActivityIndicator, Image, Text, View } from "react-native";

export function Weather() {
  const theme = useTheme();
  const { data: weatherNantes, isPending, isError } = useWeather();

  const date = new Date();

  // Get the current language and map it to the corresponding date-fns locale
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
        return undefined; // English is the default in date-fns
    }
  };

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
        <Text className="h3">
          {format(date, "PPP", { locale: getLocale() })}
        </Text>
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
