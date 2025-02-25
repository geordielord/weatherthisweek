import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { Droplets, Wind } from 'lucide-react';
import type { ForecastData } from '../types';

interface HourlyForecastProps {
  forecast: ForecastData[];
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
  const [selectedWeek, setSelectedWeek] = useState(0);

  const weeks = Array.from({ length: 2 }, (_, i) => {
    const startDate = startOfWeek(addWeeks(new Date(), i), { weekStartsOn: 1 });
    const endDate = addDays(startDate, 6);
    return {
      label: i === 0 ? 'This Week' : 'Next Week',
      range: `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`,
      days: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(startDate, dayIndex);
        return {
          date,
          dayName: format(date, 'EEE'),
          dayDate: format(date, 'MMM d'),
          isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        };
      })
    };
  });

  const generateWeatherData = (weekIndex: number) => {
    return Array.from({ length: 7 }, (_, i) => {
      const baseTemp = 8 + Math.random() * 5;
      return {
        temperature: Math.round(baseTemp),
        precipitation: Math.round(Math.random() * 100),
        windSpeed: Math.round(5 + Math.random() * 15),
        icon: ['01d', '02d', '03d', '04d', '09d', '10d', '11d'][Math.floor(Math.random() * 7)]
      };
    });
  };

  const weeklyData = weeks.map((week, index) => ({
    ...week,
    weather: generateWeatherData(index)
  }));

  const celsiusToFahrenheit = (celsius: number) => Math.round(celsius * 9/5 + 32);

  const getIconFilter = (icon: string) => {
    if (icon === '01d') {
      // Clear sky - bright yellow sun
      return 'brightness-110 sepia-100 saturate-[5] hue-rotate-[45deg]';
    } else if (icon === '02d') {
      // Partly cloudy - yellow sun with white cloud
      return 'brightness-110 sepia-[0.3] saturate-[2] hue-rotate-[45deg]';
    } else if (icon.includes('11d')) {
      // Thunderstorm - dark gray clouds
      return 'brightness-[0.7] contrast-[1.2] saturate-[0.8]';
    } else if (icon.includes('09d') || icon.includes('10d')) {
      // Rain - medium gray clouds
      return 'brightness-[0.85] contrast-[1.1] saturate-[0.9]';
    } else if (icon.includes('03d') || icon.includes('04d')) {
      // Cloudy - light gray/white clouds
      return 'brightness-110 contrast-[0.95] saturate-[0.8]';
    } else {
      // Default
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 lg:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <h3 className="text-xl lg:text-2xl font-bold text-white">Weekly Forecast</h3>
          <div className="flex flex-wrap gap-4">
            {weeks.map((week, index) => (
              <button
                key={index}
                onClick={() => setSelectedWeek(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 flex-1 lg:flex-none ${
                  selectedWeek === index
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-bold">{week.label}</div>
                <div className="text-xs opacity-75">{week.range}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weeklyData[selectedWeek].days.map((day, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg transition-all duration-300 ${
                day.isToday
                  ? 'bg-blue-500/20 ring-2 ring-blue-500'
                  : 'bg-gray-700/50 hover:bg-gray-700/70'
              }`}
            >
              <div className="text-center mb-3">
                <p className={`font-medium ${day.isToday ? 'text-blue-400' : 'text-gray-400'}`}>
                  {day.dayName}
                </p>
                <p className="text-white font-bold">{day.dayDate}</p>
              </div>

              <div className="flex justify-center mb-3">
                <img
                  src={`https://openweathermap.org/img/wn/${weeklyData[selectedWeek].weather[index].icon}@2x.png`}
                  alt="Weather icon"
                  className={`w-16 h-16 ${getIconFilter(weeklyData[selectedWeek].weather[index].icon)}`}
                />
              </div>

              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-white">
                  {weeklyData[selectedWeek].weather[index].temperature}°C
                </p>
                <p className="text-sm text-gray-400">
                  {celsiusToFahrenheit(weeklyData[selectedWeek].weather[index].temperature)}°F
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center">
                    <Droplets className="w-4 h-4 text-blue-400 mr-1" />
                    <span>Rain</span>
                  </div>
                  <span>{weeklyData[selectedWeek].weather[index].precipitation}%</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center">
                    <Wind className="w-4 h-4 text-green-400 mr-1" />
                    <span>Wind</span>
                  </div>
                  <span>{weeklyData[selectedWeek].weather[index].windSpeed} m/s</span>
                </div>
              </div>

              {day.isToday && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-blue-500 text-xs text-white rounded-full">
                    Today
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Droplets className="w-4 h-4 text-blue-400 mr-1" />
            <span>Rain</span>
          </div>
          <div className="flex items-center">
            <Wind className="w-4 h-4 text-green-400 mr-1" />
            <span>Wind</span>
          </div>
        </div>
      </div>
    </div>
  );
}