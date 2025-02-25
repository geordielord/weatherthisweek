import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';
import Reports from './components/Reports';
import AlertTicker from './components/AlertTicker';
import AlertsView from './components/AlertsView';
import WeatherAI from './components/WeatherAI';
import Help from './components/Help';
import LocationAuthModal from './components/LocationAuthModal';
import { getLocationCoordinates, getWeatherData, getAllGlobalAlerts, getUserLocation } from './utils/weather';
import { getCookie, setCookie } from './utils/cookies';
import type { WeatherData } from './types';
import { Loader2, Menu } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'weather' | 'reports' | 'alerts' | 'ai' | 'help'>('weather');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState<string>();
  const [weather, setWeather] = useState<WeatherData>({
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
    coordinates: {
      lat: 51.5074,
      lon: -0.1278
    },
    cloudCeiling: 0,
    visibility: 0,
    dewPoint: 0
  });

  const loadWeatherForLocation = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      const locationQuery = `${latitude},${longitude}`;
      const location = await getLocationCoordinates(locationQuery);
      const weatherData = await getWeatherData(location.latitude, location.longitude);
      const alerts = await getAllGlobalAlerts();
      
      setWeather({
        ...weatherData,
        location: `${location.name}`,
        alerts,
        coordinates: {
          lat: location.latitude,
          lon: location.longitude
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setCookie('userLocation', `${latitude},${longitude}`, 1);
    await loadWeatherForLocation(latitude, longitude);
    setShowLocationModal(false);
  };

  const handleLocationError = async (error: GeolocationError) => {
    console.error('Geolocation error:', error);
    let errorMessage = 'Unable to get your location.';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access was denied. Using IP-based location instead.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable. Using IP-based location instead.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Using IP-based location instead.';
        break;
    }
    
    setLocationError(errorMessage);
    
    try {
      // Fallback to IP-based location
      const ipLocation = await getUserLocation();
      await loadWeatherForLocation(ipLocation.latitude, ipLocation.longitude);
    } catch (err) {
      console.error('IP location fallback error:', err);
      loadDefaultCity();
    }
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser. Using IP-based location instead.');
      getUserLocation().then(location => {
        loadWeatherForLocation(location.latitude, location.longitude);
      }).catch(() => {
        loadDefaultCity();
      });
    }
  };

  const loadDefaultCity = async () => {
    try {
      setLoading(true);
      const location = await getLocationCoordinates('London');
      const weatherData = await getWeatherData(location.latitude, location.longitude);
      const alerts = await getAllGlobalAlerts();
      
      setWeather({
        ...weatherData,
        location: `${location.name}`,
        alerts,
        coordinates: {
          lat: location.latitude,
          lon: location.longitude
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLocation = getCookie('userLocation');
    
    if (savedLocation) {
      const [lat, lon] = savedLocation.split(',').map(Number);
      loadWeatherForLocation(lat, lon);
    } else {
      // Try to get user's location automatically
      requestLocation();
    }
  }, []);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await getLocationCoordinates(query);
      const weatherData = await getWeatherData(location.latitude, location.longitude);
      const alerts = await getAllGlobalAlerts();
      
      setWeather({
        ...weatherData,
        location: `${location.name}`,
        alerts,
        coordinates: {
          lat: location.latitude,
          lon: location.longitude
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-white text-lg">Loading weather data...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'weather':
        return (
          <>
            <h1 className="text-3xl font-bold text-white mb-4">Your Weather Forecast</h1>
            <SearchBar onSearch={handleSearch} onGetLocation={requestLocation} />
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <WeatherDisplay weather={weather} />
          </>
        );
      case 'reports':
        return <Reports />;
      case 'alerts':
        return (
          <div className="space-y-6">
            <AlertsView alerts={weather.alerts || []} />
          </div>
        );
      case 'ai':
        return <WeatherAI />;
      case 'help':
        return <Help />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[100vh] dark">
      <LocationAuthModal
        isOpen={showLocationModal}
        onClose={() => {
          setShowLocationModal(false);
          loadDefaultCity();
        }}
        onAccept={requestLocation}
        error={locationError}
      />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 lg:z-0`}
      >
        <Sidebar 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false);
          }}
        />
      </div>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className="flex-1 bg-gray-900 p-4 lg:p-8 overflow-y-auto pt-16 lg:pt-8 pb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          {renderContent()}
        </div>
      </main>

      {weather.alerts && weather.alerts.length > 0 && (
        <AlertTicker alerts={weather.alerts} />
      )}
    </div>
  );
}

export default App;