import React from 'react';
import { MapPin, X, AlertCircle } from 'lucide-react';

interface LocationAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  error?: string;
}

export default function LocationAuthModal({ isOpen, onClose, onAccept, error }: LocationAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          Enable Location Services
        </h2>

        <p className="text-gray-300 mb-4">
          To show you local weather information, we need permission to access your location. 
          This helps us provide accurate weather data for your exact position.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2 mb-6">
          <h3 className="text-white font-medium">We will:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Only request your location when you click the button
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Use it solely for weather information
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Never store or share your location data
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Allow Location Access
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}