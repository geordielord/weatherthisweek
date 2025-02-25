import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { WeatherAlert } from '../types';

interface AlertTickerProps {
  alerts: WeatherAlert[];
}

export default function AlertTicker({ alerts }: AlertTickerProps) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    if (alerts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
    }, 5000); // Change alert every 5 seconds

    return () => clearInterval(interval);
  }, [alerts.length]);

  // Return null if there are no alerts
  if (!alerts || alerts.length === 0) return null;

  const currentAlert = alerts[currentAlertIndex];
  
  // Safety check - if current alert is undefined, return null
  if (!currentAlert) return null;

  const severityColors = {
    moderate: 'bg-yellow-500',
    severe: 'bg-orange-500',
    extreme: 'bg-red-500'
  };

  const severityColor = severityColors[currentAlert.severity] || 'bg-yellow-500'; // Fallback color

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 ${severityColor} transition-colors duration-500 safe-bottom`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="animate-ticker whitespace-nowrap">
                <span className="font-semibold text-white">
                  {currentAlert.location}: {currentAlert.headline}
                </span>
                <span className="mx-4">•</span>
                <span className="text-white/90">
                  {currentAlert.description}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center ml-4 text-sm text-white/80">
            <span>{currentAlertIndex + 1}/{alerts.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}