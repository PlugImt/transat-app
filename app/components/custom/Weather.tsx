import { getWeather } from "@/app/lib/weather";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface WeatherProps {
  setRefreshing: (refreshing: boolean) => void;
  refreshing: boolean;
}

interface WeatherData {
  temperature: number;
  condition: string;
  img: string;
}

export function Weather({ setRefreshing, refreshing }: WeatherProps) {
  const [weatherNantes, setWeatherNantes] = useState<WeatherData | undefined>();

  const date = new Date();

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeather(setRefreshing);
        setWeatherNantes(data);
      } catch (error) {
        console.error("Error while getting the weather :", error);
      }
    }

    fetchWeather().then((r) => r);
  }, [setRefreshing]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.dateText}>{format(date, "PPP")}</Text>
          <Text style={styles.temperatureText}>
            {Math.round(weatherNantes?.temperature ?? 0)}°C
          </Text>
          <Text style={styles.conditionText}>
            {weatherNantes?.condition ?? ""}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: weatherNantes?.img
                ? `https://openweathermap.org/img/wn/${weatherNantes.img}@4x.png`
                : undefined,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#181010",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    color: "#ccc",
    fontWeight: "bold",
  },
  temperatureText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  conditionText: {
    fontSize: 18,
    color: "#ffa500",
    fontWeight: "500",
  },
  imageContainer: {
    alignItems: "center",
  },
  weatherIcon: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default Weather;
