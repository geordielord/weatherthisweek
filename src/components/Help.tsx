import React from 'react';
import {
  Search,
  MapPin,
  Cloud,
  Calendar,
  Bell,
  Bot,
  HelpCircle,
  ChevronRight,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  Sunrise,
  Sunset
} from 'lucide-react';

interface HelpSection {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function Help() {
  const helpSections: HelpSection[] = [
    {
      title: 'Getting Started',
      icon: <Search className="w-6 h-6 text-blue-400" />,
      content: (
        <div className="space-y-3">
          <p>Welcome to Weather This Week! Here's how to get started:</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Use the search bar at the top to find your city</li>
            <li>View current weather conditions instantly</li>
            <li>Check the weekly forecast for planning ahead</li>
            <li>Enable notifications for weather alerts (optional)</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Weather Dashboard',
      icon: <Cloud className="w-6 h-6 text-purple-400" />,
      content: (
        <div className="space-y-3">
          <p>The main dashboard shows you:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-center">
              <ThermometerSun className="w-4 h-4 text-orange-400 mr-2" />
              Current temperature and "feels like" temperature
            </li>
            <li className="flex items-center">
              <Wind className="w-4 h-4 text-green-400 mr-2" />
              Wind speed and direction
            </li>
            <li className="flex items-center">
              <Droplets className="w-4 h-4 text-blue-400 mr-2" />
              Humidity and precipitation chances
            </li>
            <li className="flex items-center">
              <Sunrise className="w-4 h-4 text-yellow-400 mr-2" />
              Sunrise time
            </li>
            <li className="flex items-center">
              <Sunset className="w-4 h-4 text-orange-400 mr-2" />
              Sunset time
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Weekly Forecast',
      icon: <Calendar className="w-6 h-6 text-green-400" />,
      content: (
        <div className="space-y-3">
          <p>Plan your week with our detailed forecast:</p>
          <ul className="space-y-2 ml-4">
            <li>View weather predictions for the next 7 days</li>
            <li>Toggle between this week and next week</li>
            <li>See daily high and low temperatures</li>
            <li>Check precipitation chances for each day</li>
            <li>Monitor wind conditions throughout the week</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Weather Alerts',
      icon: <Bell className="w-6 h-6 text-yellow-400" />,
      content: (
        <div className="space-y-3">
          <p>Stay informed about weather alerts:</p>
          <ul className="space-y-2 ml-4">
            <li>Receive notifications for severe weather</li>
            <li>View active alerts for your area</li>
            <li>Get detailed information about each alert</li>
            <li>Track alert severity levels:
              <ul className="ml-4 mt-2 space-y-1">
                <li className="text-yellow-400">• Moderate - Be aware</li>
                <li className="text-orange-400">• Severe - Take precautions</li>
                <li className="text-red-400">• Extreme - Take immediate action</li>
              </ul>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Weather AI Assistant',
      icon: <Bot className="w-6 h-6 text-blue-400" />,
      content: (
        <div className="space-y-3">
          <p>Chat with our AI assistant to:</p>
          <ul className="space-y-2 ml-4">
            <li>Ask about current weather conditions</li>
            <li>Get weather forecasts for any location</li>
            <li>Receive activity recommendations based on weather</li>
            <li>Learn about weather patterns and terminology</li>
          </ul>
          <div className="bg-gray-700 p-3 rounded-lg mt-2">
            <p className="text-sm font-medium">Example questions:</p>
            <ul className="space-y-1 mt-2 text-sm text-gray-300">
              <li>"Will it rain tomorrow in London?"</li>
              <li>"What's the temperature in New York?"</li>
              <li>"Is it a good day for outdoor activities?"</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Tips & Tricks',
      icon: <HelpCircle className="w-6 h-6 text-indigo-400" />,
      content: (
        <div className="space-y-3">
          <p>Make the most of Weather This Week:</p>
          <ul className="space-y-2 ml-4">
            <li>Use the search bar for quick location changes</li>
            <li>Toggle between dark and light mode for comfort</li>
            <li>Check hourly forecasts for detailed planning</li>
            <li>Monitor UV index for sun protection</li>
            <li>Track sunrise/sunset times for outdoor activities</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Help Center</h2>
        <p className="text-gray-300">
          Welcome to Weather This Week! Here's everything you need to know about using our weather dashboard.
        </p>
      </div>

      <div className="space-y-6">
        {helpSections.map((section, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 transition-all duration-300 hover:bg-gray-700/50"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-700 rounded-lg mr-4">
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            </div>
            <div className="text-gray-300 ml-14">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">Need More Help?</h3>
        <p className="text-gray-300">
          If you have any questions or need additional assistance, try asking our Weather AI Assistant. 
          It's designed to help you with any weather-related queries and can provide detailed explanations 
          about our features.
        </p>
      </div>
    </div>
  );
}