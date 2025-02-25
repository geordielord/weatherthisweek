import React from 'react';
import { AlertTriangle, Clock, MapPin, Search } from 'lucide-react';
import type { WeatherAlert } from '../types';
import { format } from 'date-fns';

interface AlertsViewProps {
  alerts: WeatherAlert[];
}

export default function AlertsView({ alerts }: AlertsViewProps) {
  const severityColors = {
    moderate: 'border-yellow-500 bg-yellow-500/10',
    severe: 'border-orange-500 bg-orange-500/10',
    extreme: 'border-red-500 bg-red-500/10'
  };

  const severityIcons = {
    moderate: 'text-yellow-500',
    severe: 'text-orange-500',
    extreme: 'text-red-500'
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Active Alerts</h3>
        <p className="text-gray-400">There are currently no weather alerts worldwide.</p>
      </div>
    );
  }

  // Group alerts by severity
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.severity]) {
      acc[alert.severity] = [];
    }
    acc[alert.severity].push(alert);
    return acc;
  }, {} as Record<string, WeatherAlert[]>);

  const severityOrder = ['extreme', 'severe', 'moderate'];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Global Weather Alerts</h2>
          <div className="flex items-center space-x-3">
            <span className="text-red-500 font-medium">
              {alerts.filter(a => a.severity === 'extreme').length} Extreme
            </span>
            <span className="text-orange-500 font-medium">
              {alerts.filter(a => a.severity === 'severe').length} Severe
            </span>
            <span className="text-yellow-500 font-medium">
              {alerts.filter(a => a.severity === 'moderate').length} Moderate
            </span>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p className="text-gray-300">
            Showing active weather alerts from major cities worldwide. Alerts are automatically updated based on current conditions and forecasts.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {severityOrder.map(severity => {
          const severityAlerts = groupedAlerts[severity];
          if (!severityAlerts?.length) return null;

          return (
            <div key={severity} className="space-y-4">
              <h3 className={`text-xl font-semibold capitalize ${severityIcons[severity as keyof typeof severityIcons]}`}>
                {severity} Alerts
              </h3>
              <div className="grid gap-4">
                {severityAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`border-l-4 rounded-lg p-6 ${severityColors[alert.severity]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className={`w-6 h-6 ${severityIcons[alert.severity]}`} />
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{alert.headline}</h3>
                          <p className="text-gray-300 mb-4">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {alert.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Expires: {format(new Date(alert.expires), 'MMM d, h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}