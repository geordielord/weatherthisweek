import React from 'react';
import { Cloud, Files, Bell, HelpCircle, Bot } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeView: 'weather' | 'reports' | 'alerts' | 'ai' | 'help';
  onViewChange: (view: 'weather' | 'reports' | 'alerts' | 'ai' | 'help') => void;
}

export default function Sidebar({ darkMode, toggleDarkMode, activeView, onViewChange }: SidebarProps) {
  React.useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <Cloud className="w-8 h-8 text-blue-400" />
        <span className="ml-2 text-xl font-bold">Weather This Week</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onViewChange('weather')}
              className={`flex items-center w-full p-2 rounded-lg ${
                activeView === 'weather' ? 'bg-blue-500' : 'hover:bg-gray-800'
              }`}
            >
              <Cloud className="w-5 h-5 mr-2" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange('reports')}
              className={`flex items-center w-full p-2 rounded-lg ${
                activeView === 'reports' ? 'bg-blue-500' : 'hover:bg-gray-800'
              }`}
            >
              <Files className="w-5 h-5 mr-2" />
              Reports
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange('alerts')}
              className={`flex items-center w-full p-2 rounded-lg ${
                activeView === 'alerts' ? 'bg-blue-500' : 'hover:bg-gray-800'
              }`}
            >
              <Bell className="w-5 h-5 mr-2" />
              Alerts
            </button>
          </li>
          <li>
            <button
              onClick={() => onViewChange('ai')}
              className={`flex items-center w-full p-2 rounded-lg ${
                activeView === 'ai' ? 'bg-blue-500' : 'hover:bg-gray-800'
              }`}
            >
              <Bot className="w-5 h-5 mr-2" />
              Weather AI
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onViewChange('help')}
              className={`flex items-center w-full p-2 rounded-lg ${
                activeView === 'help' ? 'bg-blue-500' : 'hover:bg-gray-800'
              }`}
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Help
            </button>
          </li>
        </ul>

        {/* AdSense Ad */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-7086399018888520"
               data-ad-slot="2321131338"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>
  );
}