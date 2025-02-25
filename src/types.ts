export interface WeatherData {
  location?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  description: string;
  icon: string;
  hourlyForecast?: ForecastData[];
  alerts?: WeatherAlert[];
  sunrise?: string;
  sunset?: string;
  uvIndex: {
    value: number;
    description: string;
  };
  cloudCeiling: number;
  visibility: number;
  dewPoint: number;
}

export interface ForecastData {
  time: string;
  temperature: number;
  icon: string;
  description: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

export interface WeatherAlert {
  event: string;
  headline: string;
  description: string;
  severity: 'moderate' | 'severe' | 'extreme';
  location: string;
  onset: string;
  expires: string;
}