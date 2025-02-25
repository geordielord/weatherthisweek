import React from 'react';
import { Satellite, Cloud, Eye, CloudLightning, Waves, Droplets } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherDataGridProps {
  weather: WeatherData;
}

export default function WeatherDataGrid({ weather }: WeatherDataGridProps) {
  const formatCloudCeiling = (feet: number) => {
    if (feet >= 1000) {
      return `${(feet / 1000).toFixed(1)}k ft`;
    }
    return `${feet} ft`;
  };

  const formatVisibility = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  const getAQIDescription = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Satellite */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Satellite className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-white">Satellite</span>
          </div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
        <div className="mt-2 text-sm text-gray-300">
          Cloud cover: 54%
        </div>
      </div>

      {/* Clouds */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Cloud className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-sm font-medium text-white">Clouds</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">
          Ceiling: {formatCloudCeiling(weather.cloudCeiling)}
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-white">Visibility</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">
          {formatVisibility(weather.visibility)}
        </div>
      </div>

      {/* Dew Point */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Droplets className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-white">Dew Point</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">
          {weather.dewPoint}°C
        </div>
      </div>

      {/* Lightning */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <CloudLightning className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-white">Lightning</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">
          Strikes: 10 nearby
        </div>
      </div>

      {/* Air Quality */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Waves className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-white">Air Quality</span>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className={getAQIColor(45)}>
            AQI: 45 - {getAQIDescription(45)}
          </span>
        </div>
      </div>
    </div>
  );
}