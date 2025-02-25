import React from 'react';
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Compass, 
  Gauge, 
  Sun, 
  Sunrise, 
  Sunset, 
  Shield,
  Radar
} from 'lucide-react';
import type { WeatherData } from '../types';
import { format } from 'date-fns';
import WeatherDataGrid from './WeatherDataGrid';
import HourlyForecast from './HourlyForecast';

interface WeatherDisplayProps {
  weather: WeatherData;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  React.useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const getUVIndexColor = (index: number) => {
    if (index <= 2) return 'text-green-400';
    if (index <= 5) return 'text-yellow-400';
    if (index <= 7) return 'text-orange-400';
    if (index <= 10) return 'text-red-400';
    return 'text-purple-400';
  };

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 lg:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl lg:text-4xl font-bold mb-2">{weather.location}</h2>
            <p className="text-lg lg:text-xl text-gray-300 capitalize">{weather.description}</p>
          </div>
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                alt={weather.description}
                className="w-20 h-20 lg:w-24 lg:h-24 -mr-4"
              />
              <div className="text-4xl lg:text-6xl font-bold">{weather.temperature}°C</div>
            </div>
            <p className="text-gray-300 text-base lg:text-lg">Feels like {weather.feelsLike}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
          <div className="bg-gray-700/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 lg:w-8 lg:h-8 text-blue-400 mr-2 lg:mr-4 flex-shrink-0" />
              <p className="text-sm lg:text-base text-gray-300">Humidity</p>
            </div>
            <p className="text-xl lg:text-2xl font-semibold pl-7 lg:pl-12">{weather.humidity}%</p>
          </div>

          <div className="bg-gray-700/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Wind className="w-5 h-5 lg:w-8 lg:h-8 text-green-400 mr-2 lg:mr-4 flex-shrink-0" />
              <p className="text-sm lg:text-base text-gray-300">Wind Speed</p>
            </div>
            <p className="text-xl lg:text-2xl font-semibold pl-7 lg:pl-12">{weather.windSpeed} m/s</p>
          </div>

          <div className="bg-gray-700/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Compass className="w-5 h-5 lg:w-8 lg:h-8 text-yellow-400 mr-2 lg:mr-4 flex-shrink-0" />
              <p className="text-sm lg:text-base text-gray-300">Wind Direction</p>
            </div>
            <p className="text-xl lg:text-2xl font-semibold pl-7 lg:pl-12">{weather.windDirection}°</p>
          </div>

          <div className="bg-gray-700/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Cloud className="w-5 h-5 lg:w-8 lg:h-8 text-purple-400 mr-2 lg:mr-4 flex-shrink-0" />
              <p className="text-sm lg:text-base text-gray-300">Conditions</p>
            </div>
            <p className="text-xl lg:text-2xl font-semibold pl-7 lg:pl-12 capitalize">{weather.description}</p>
          </div>

          <div className="bg-gray-700/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 lg:w-8 lg:h-8 text-red-400 mr-2 lg:mr-4 flex-shrink-0" />
              <p className="text-sm lg:text-base text-gray-300">Pressure</p>
            </div>
            <p className="text-xl lg:text-2xl font-semibold pl-7 lg:pl-12">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>

      {/* Weekly Forecast */}
      {weather.hourlyForecast && (
        <div className="mt-6">
          <HourlyForecast forecast={weather.hourlyForecast} />
        </div>
      )}

      {/* AdSense Ad */}
      <div className="bg-gray-800 rounded-lg p-4">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-7086399018888520"
             data-ad-slot="5555775125"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      {/* Sun Schedule Card */}
      <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-lg p-4 lg:p-6 text-white shadow-lg backdrop-blur-sm">
        <h3 className="text-lg lg:text-xl font-semibold mb-4 flex items-center">
          <Sun className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-yellow-400" />
          Sun Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg">
            <div className="flex items-center">
              <Sunrise className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />
              <span className="text-sm lg:text-base">Sunrise</span>
            </div>
            <span className="font-semibold text-sm lg:text-base">
              {weather.sunrise ? format(new Date(weather.sunrise), 'h:mm a') : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg">
            <div className="flex items-center">
              <Sunset className="w-5 h-5 text-orange-400 mr-2 flex-shrink-0" />
              <span className="text-sm lg:text-base">Sunset</span>
            </div>
            <span className="font-semibold text-sm lg:text-base">
              {weather.sunset ? format(new Date(weather.sunset), 'h:mm a') : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg">
            <div className="flex items-center">
              <Shield className={`w-5 h-5 ${getUVIndexColor(weather.uvIndex.value)} mr-2 flex-shrink-0`} />
              <span className="text-sm lg:text-base">UV Index</span>
            </div>
            <span className="font-semibold text-sm lg:text-base">
              {weather.uvIndex.value} ({weather.uvIndex.description})
            </span>
          </div>
        </div>
      </div>

      {/* Weather Radar Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Radar className="w-6 h-6 text-blue-400 mr-2" />
          Weather Radar
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Map */}
          <div className="bg-gray-700/50 rounded-lg p-4 aspect-video relative overflow-hidden">
            <iframe
              src={`https://embed.windy.com/embed2.html?lat=${weather.coordinates?.lat || 51.5074}&lon=${weather.coordinates?.lon || -0.1278}&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=${weather.coordinates?.lat || 51.5074}&detailLon=${weather.coordinates?.lon || -0.1278}&metricWind=default&metricTemp=default&radarRange=-1`}
              className="absolute inset-0 w-full h-full border-0"
              title="Weather Radar Map"
            />
          </div>

          {/* Weather Data Grid */}
          <WeatherDataGrid weather={weather} />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">About Weather This Week</h2>
        <div className="text-gray-300 space-y-4">
          <p>
            Weather This Week provides comprehensive weather forecasts to help you plan ahead with confidence. Whether you're checking the weather today, looking up weather tomorrow, or planning for the entire week, we've got you covered with accurate, real-time updates.
          </p>
          <p>
            Wondering "What's the weather going to be like?" Simply search for any location above to get instant access to detailed weather information, including temperature, precipitation, wind conditions, and hourly forecasts. Our user-friendly dashboard makes it easy to stay informed about changing weather conditions in your area.
          </p>
        </div>
      </div>
    </div>
  );
}