import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, ThermometerSun } from 'lucide-react';
import { getWeatherData, getLocationCoordinates } from '../utils/weather';

interface Message {
  type: 'user' | 'ai';
  content: string;
  weatherData?: any;
}

interface LocationInfo {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function WeatherAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: "Hello! I'm your Weather AI assistant. I can help you with weather-related questions! Try asking about:\n\n" +
               "• Current weather in a specific city\n" +
               "• Rain forecasts\n" +
               "• Temperature information"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Common word corrections for weather-related terms
  const wordCorrections: Record<string, string> = {
    // Time-related
    'tommorow': 'tomorrow',
    'tomorro': 'tomorrow',
    'tomrow': 'tomorrow',
    'tommorrow': 'tomorrow',
    'tomrw': 'tomorrow',
    'tmrw': 'tomorrow',
    'tmw': 'tomorrow',
    'tomorow': 'tomorrow',
    'tomarrow': 'tomorrow',
    'today': 'today',
    'tday': 'today',
    '2day': 'today',
    '2morrow': 'tomorrow',
    '2moro': 'tomorrow',

    // Weather conditions
    'wether': 'weather',
    'wheather': 'weather',
    'wheter': 'weather',
    'weathr': 'weather',
    'temp': 'temperature',
    'temprature': 'temperature',
    'temperture': 'temperature',
    'tempature': 'temperature',
    'raining': 'rain',
    'rainy': 'rain',
    'raine': 'rain',
    'windy': 'wind',
    'wind': 'wind',
    'humidity': 'humid',
    'humidty': 'humid',
    'humd': 'humid',
  };

  const correctSpelling = (text: string): string => {
    return text.toLowerCase().split(/\s+/).map(word => {
      return wordCorrections[word] || word;
    }).join(' ');
  };

  const extractLocation = (message: string): string | null => {
    // First, correct common spelling mistakes
    const correctedMessage = correctSpelling(message);

    const nonLocationWords = [
      'today', 'tomorrow', 'weather', 'temperature', 'rain', 'forecast',
      'outside', 'outdoors', 'conditions', 'like', 'now', 'current',
      'will', 'it', 'the', 'in', 'at', 'is', 'are', 'what', 'how',
      'humid', 'wind', 'cloudy', 'sunny', 'storm', 'cold', 'hot', 'warm'
    ];

    // Try to find location after "in" or "at"
    const locationMatch = correctedMessage.match(/(?:in|at)\s+([a-zA-Z\s,]+)(?:\s|$)/i);
    
    if (locationMatch) {
      const potentialLocation = locationMatch[1].trim();
      if (!nonLocationWords.some(word => 
          potentialLocation.toLowerCase() === word.toLowerCase())) {
        return potentialLocation;
      }
    }
    
    // If no location found with "in" or "at", check the first word
    const words = correctedMessage.split(/\s+/);
    const firstWord = words[0];
    if (firstWord && !nonLocationWords.includes(firstWord.toLowerCase())) {
      return firstWord;
    }

    // If we have a current location, use that
    if (currentLocation) {
      return `${currentLocation.name}, ${currentLocation.country}`;
    }
    
    return null;
  };

  const processWeatherQuery = (message: string): string => {
    const correctedMessage = correctSpelling(message);
    
    // Check for time-related keywords
    const hasTimeContext = correctedMessage.includes('tomorrow') || 
                          correctedMessage.includes('today') ||
                          correctedMessage.includes('now');

    // Check for weather condition keywords
    const hasWeatherCondition = correctedMessage.includes('rain') ||
                               correctedMessage.includes('temperature') ||
                               correctedMessage.includes('wind') ||
                               correctedMessage.includes('humid');

    return correctedMessage;
  };

  const generateAIResponse = async (userMessage: string, weatherData?: any, error?: string) => {
    if (error) {
      return `I apologize, but I couldn't retrieve the weather data: ${error}. Could you please try again or ask about a different location?`;
    }

    const processedMessage = processWeatherQuery(userMessage);

    if (!weatherData && !error && !currentLocation) {
      return "I need to know which city you're asking about. Could you please specify a location? For example:\n" +
             "• What's the weather in London?\n" +
             "• Temperature in New York\n" +
             "• Will it rain in Tokyo?";
    }

    if (weatherData) {
      // For rain-related queries
      if (processedMessage.includes('rain')) {
        const willRain = weatherData.description.includes('rain');
        return willRain ? 'Yes, rain is expected.' : 'No rain is expected.';
      } 
      
      // For temperature-specific queries
      if (processedMessage.includes('temperature')) {
        return `The temperature is ${weatherData.temperature}°C (${Math.round(weatherData.temperature * 9/5 + 32)}°F).`;
      }

      // For wind-related queries
      if (processedMessage.includes('wind')) {
        return `Wind speed is ${weatherData.windSpeed} m/s (${Math.round(weatherData.windSpeed * 2.237)} mph) from ${weatherData.windDirection}°.`;
      }

      // For humidity queries
      if (processedMessage.includes('humid')) {
        return `The humidity is ${weatherData.humidity}%.`;
      }

      // Default response with full weather report for new location
      if (!currentLocation || extractLocation(userMessage)) {
        return `Current conditions in ${weatherData.location}:
• Temperature: ${weatherData.temperature}°C (${Math.round(weatherData.temperature * 9/5 + 32)}°F)
• Feels Like: ${weatherData.feelsLike}°C (${Math.round(weatherData.feelsLike * 9/5 + 32)}°F)
• Humidity: ${weatherData.humidity}%
• Pressure: ${weatherData.pressure} hPa
• Wind Speed: ${weatherData.windSpeed} m/s
• Wind Direction: ${weatherData.windDirection}°
• Sky Conditions: ${weatherData.description}`;
      }

      // Generic weather status
      return `It's currently ${weatherData.temperature}°C with ${weatherData.description}.`;
    }

    return "How can I help you? You can ask me about current weather conditions, rain forecasts, or temperature information for any location.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const newLocation = extractLocation(userMessage);
      let weatherData;
      let error;
      let coords;

      if (newLocation) {
        try {
          coords = await getLocationCoordinates(newLocation);
          setCurrentLocation(coords);
        } catch (err) {
          error = err instanceof Error ? err.message : 'Could not find this location';
          console.error('Location coordinates fetch error:', err);
        }
      } else {
        coords = currentLocation;
      }

      if (coords) {
        try {
          weatherData = await getWeatherData(coords.latitude, coords.longitude);
          weatherData.location = `${coords.name}, ${coords.country}`;
        } catch (err) {
          error = err instanceof Error ? err.message : 'Could not retrieve weather data for this location';
          console.error('Failed to fetch weather data:', err);
        }
      } else if (!newLocation && !currentLocation) {
        error = "Please specify a location for your weather query.";
      }

      const aiResponse = await generateAIResponse(userMessage, weatherData, error);
      
      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        weatherData: error ? undefined : weatherData
      }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Bot className="w-6 h-6 mr-2 text-blue-400" />
          Weather AI Assistant
          {currentLocation && (
            <span className="ml-2 text-sm text-gray-400">
              (Current context: {currentLocation.name}, {currentLocation.country})
            </span>
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'ai' ? (
                  <Bot className="w-5 h-5 mt-1" />
                ) : (
                  <User className="w-5 h-5 mt-1" />
                )}
                <div className="space-y-2">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.weatherData && (
                    <div className="mt-2 p-2 bg-gray-600/50 rounded">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{message.weatherData.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        <ThermometerSun className="w-4 h-4" />
                        <span>{message.weatherData.temperature}°C</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about weather, temperature, or rain forecasts..."
            className="flex-1 bg-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}