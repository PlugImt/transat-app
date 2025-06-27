export interface WeatherData {
  temperature: number;
  condition: string;
  img: string;
}

export interface WeatherDataApi {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
}
