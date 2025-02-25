import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import WeatherDisplayCity from './components/WeatherDisplayCity';
import './index.css';

// Get the city name from the URL path
const pathParts = window.location.pathname.split('/').filter(Boolean);
const cityName = pathParts[pathParts.length - 1];

// Initialize weather data with city-specific coordinates from window.initialLocation
const initialWeather = {
  location: '',
  temperature: 0,
  feelsLike: 0,
  humidity: 0,
  windSpeed: 0,
  windDirection: 0,
  pressure: 0,
  description: '',
  icon: '01d',
  hourlyForecast: [],
  alerts: [],
  uvIndex: {
    value: 0,
    description: 'Low'
  },
  coordinates: window.initialLocation ? {
    lat: window.initialLocation.latitude,
    lon: window.initialLocation.longitude
  } : {
    lat: 51.5074,
    lon: -0.1278
  },
  cloudCeiling: 0,
  visibility: 0,
  dewPoint: 0
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherDisplayCity 
      weather={initialWeather}
      cityName={cityName}
    />
  </StrictMode>
);