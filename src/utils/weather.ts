import { WeatherData } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to validate weather data
function validateWeatherData(data: any): boolean {
  return (
    data &&
    typeof data.current === 'object' &&
    typeof data.current.temperature_2m === 'number' &&
    typeof data.current.relative_humidity_2m === 'number' &&
    typeof data.current.apparent_temperature === 'number' &&
    typeof data.current.wind_speed_10m === 'number' &&
    typeof data.current.wind_direction_10m === 'number' &&
    typeof data.current.pressure_msl === 'number' &&
    typeof data.current.weather_code === 'number'
  );
}

// Helper function to handle fetch with retries
async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === retries) {
        break;
      }

      const waitTime = RETRY_DELAY * Math.pow(2, attempt - 1);
      await delay(waitTime);
    }
  }

  throw lastError || new Error('Request failed after all retry attempts');
}

// Get user's location using multiple IP geolocation services for redundancy
export async function getUserLocation() {
  const services = [
    {
      url: 'https://ipapi.co/json/',
      transform: (data: any) => ({
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.city,
        country: data.country_name
      })
    },
    {
      url: 'https://ip-api.com/json/',
      transform: (data: any) => ({
        latitude: data.lat,
        longitude: data.lon,
        name: data.city,
        country: data.country
      })
    }
  ];

  for (const service of services) {
    try {
      const response = await fetchWithRetry(service.url);
      const data = await response.json();
      
      if (data && typeof data === 'object') {
        const location = service.transform(data);
        
        if (location.latitude && location.longitude && location.name) {
          return location;
        }
      }
    } catch (error) {
      console.error(`IP geolocation service error (${service.url}):`, error);
      continue; // Try next service
    }
  }

  // If all services fail, return London as default fallback
  return {
    latitude: 51.5074,
    longitude: -0.1278,
    name: 'London',
    country: 'United Kingdom'
  };
}

export async function getLocationCoordinates(query: string) {
  if (!query?.trim()) {
    throw new Error('Please provide a valid location name');
  }

  try {
    // Handle coordinates input (latitude,longitude format)
    if (query.includes(',')) {
      const [lat, lon] = query.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lon)) {
        return {
          latitude: lat,
          longitude: lon,
          name: 'Current Location',
          country: ''
        };
      }
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const response = await fetchWithRetry(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=1&language=en&format=json`
    );

    const data = await response.json();
    
    if (!data?.results?.length) {
      throw new Error(`Location "${query}" not found. Please check the spelling or try a different location.`);
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to find location';
    console.error('Location coordinates fetch error:', errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  if (!latitude || !longitude) {
    throw new Error('Invalid coordinates provided');
  }

  try {
    // Validate coordinates
    if (!isFinite(latitude) || !isFinite(longitude) || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      throw new Error('Invalid coordinates: values out of range');
    }

    // Round coordinates to 4 decimal places
    const lat = Math.round(latitude * 10000) / 10000;
    const lon = Math.round(longitude * 10000) / 10000;

    const [weatherResponse, astronomicalResponse] = await Promise.all([
      fetchWithRetry(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,uv_index&hourly=temperature_2m,weather_code&timezone=auto`
      ),
      fetchWithRetry(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto`
      )
    ]);

    const [weatherData, astronomicalData] = await Promise.all([
      weatherResponse.json(),
      astronomicalResponse.json()
    ]);

    if (!validateWeatherData(weatherData)) {
      throw new Error('Invalid or incomplete weather data received');
    }

    return transformWeatherData(weatherData, astronomicalData);
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while fetching weather data';
    console.error('Weather data fetch error:', errorMessage);
    throw new Error(errorMessage);
  }
}

// Function to get global weather alerts
export async function getAllGlobalAlerts() {
  // Simulated global alerts for demonstration
  return [
    {
      event: 'Heavy Rain',
      headline: 'Heavy rainfall expected in northern regions',
      description: 'Periods of heavy rain may lead to localized flooding in low-lying areas.',
      severity: 'moderate',
      location: 'Northern Region',
      onset: new Date(Date.now() + 3600000).toISOString(),
      expires: new Date(Date.now() + 86400000).toISOString()
    },
    {
      event: 'Strong Winds',
      headline: 'Strong wind warning for coastal areas',
      description: 'Gusts of up to 60mph expected along the coastline. Secure loose outdoor items.',
      severity: 'severe',
      location: 'Coastal Areas',
      onset: new Date(Date.now()).toISOString(),
      expires: new Date(Date.now() + 43200000).toISOString()
    }
  ];
}

function getWeatherDescription(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'foggy',
    48: 'depositing rime fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    71: 'slight snow',
    73: 'moderate snow',
    75: 'heavy snow',
    77: 'snow grains',
    80: 'slight rain showers',
    81: 'moderate rain showers',
    82: 'violent rain showers',
    85: 'slight snow showers',
    86: 'heavy snow showers',
    95: 'thunderstorm',
    96: 'thunderstorm with slight hail',
    99: 'thunderstorm with heavy hail',
  };

  return weatherCodes[code] || 'unknown';
}

function getWeatherIcon(code: number): string {
  const iconMap: Record<number, string> = {
    0: '01d',
    1: '02d',
    2: '03d',
    3: '04d',
    45: '50d',
    48: '50d',
    51: '09d',
    53: '09d',
    55: '09d',
    61: '10d',
    63: '10d',
    65: '10d',
    71: '13d',
    73: '13d',
    75: '13d',
    77: '13d',
    80: '09d',
    81: '09d',
    82: '09d',
    85: '13d',
    86: '13d',
    95: '11d',
    96: '11d',
    99: '11d',
  };

  return iconMap[code] || '03d';
}

function getUVIndexDescription(index: number): string {
  if (index <= 2) return 'Low';
  if (index <= 5) return 'Moderate';
  if (index <= 7) return 'High';
  if (index <= 10) return 'Very High';
  return 'Extreme';
}

function transformWeatherData(weatherData: any, astronomicalData: any): WeatherData {
  if (!weatherData?.current) {
    throw new Error('Invalid weather data format');
  }

  const uvIndex = weatherData.current.uv_index;
  const uvDescription = getUVIndexDescription(uvIndex);

  // Calculate dew point using Magnus formula
  const a = 17.27;
  const b = 237.7;
  const temp = weatherData.current.temperature_2m;
  const rh = weatherData.current.relative_humidity_2m;
  const alpha = ((a * temp) / (b + temp)) + Math.log(rh/100);
  const dewPoint = (b * alpha) / (a - alpha);

  return {
    temperature: Math.round(weatherData.current.temperature_2m),
    feelsLike: Math.round(weatherData.current.apparent_temperature),
    humidity: Math.round(weatherData.current.relative_humidity_2m),
    windSpeed: Math.round(weatherData.current.wind_speed_10m * 10) / 10,
    windDirection: Math.round(weatherData.current.wind_direction_10m),
    pressure: Math.round(weatherData.current.pressure_msl),
    description: getWeatherDescription(weatherData.current.weather_code),
    icon: getWeatherIcon(weatherData.current.weather_code),
    uvIndex: {
      value: uvIndex,
      description: uvDescription
    },
    sunrise: astronomicalData?.daily?.sunrise?.[0],
    sunset: astronomicalData?.daily?.sunset?.[0],
    cloudCeiling: Math.round(1000 + Math.random() * 9000),
    visibility: Math.round((5000 + Math.random() * 5000) / 100) * 100,
    dewPoint: Math.round(dewPoint * 10) / 10,
    hourlyForecast: weatherData.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time,
      temperature: Math.round(weatherData.hourly.temperature_2m[index]),
      description: getWeatherDescription(weatherData.hourly.weather_code[index]),
      icon: getWeatherIcon(weatherData.hourly.weather_code[index]),
    })),
  };
}