import React, { useState } from 'react';
import { BarChart3, Calendar, Filter, TrendingUp } from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';

// Sample data - in a real app, this would come from your API
const generateDailyData = (days: number) => {
  return Array.from({ length: days }).map((_, index) => {
    const date = subDays(new Date(), days - 1 - index);
    return {
      date: format(date, 'MMM dd'),
      high: Math.round(20 + Math.random() * 8),
      low: Math.round(10 + Math.random() * 5),
      precipitation: Math.round(Math.random() * 100),
      humidity: Math.round(40 + Math.random() * 40)
    };
  });
};

const generateMonthlyData = (months: number) => {
  return Array.from({ length: months }).map((_, index) => {
    const date = subMonths(new Date(), months - 1 - index);
    return {
      month: format(date, 'MMM yyyy'),
      avgTemp: Math.round(15 + Math.random() * 10),
      rainfall: Math.round(50 + Math.random() * 100),
      sunnyDays: Math.round(10 + Math.random() * 15)
    };
  });
};

interface ReportSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  
  const dailyData = generateDailyData(selectedPeriod === 'week' ? 7 : 30);
  const monthlyData = generateMonthlyData(12);

  const reportSections: ReportSection[] = [
    {
      title: 'Temperature Trends',
      description: 'Daily high and low temperature patterns',
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      component: (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="high"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
                name="High Temp (°C)"
              />
              <Area
                type="monotone"
                dataKey="low"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Low Temp (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      title: 'Monthly Summary',
      description: 'Temperature and rainfall patterns',
      icon: <Calendar className="w-6 h-6 text-green-400" />,
      component: (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="avgTemp"
                fill="#3b82f6"
                name="Avg Temperature (°C)"
              />
              <Bar
                yAxisId="right"
                dataKey="rainfall"
                fill="#10b981"
                name="Rainfall (mm)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      title: 'Humidity Analysis',
      description: 'Daily humidity levels and trends',
      icon: <Filter className="w-6 h-6 text-purple-400" />,
      component: (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#8b5cf6"
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      title: 'Precipitation Overview',
      description: 'Daily precipitation amounts',
      icon: <BarChart3 className="w-6 h-6 text-orange-400" />,
      component: (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="precipitation"
                fill="#60a5fa"
                name="Precipitation (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Weather Reports</h2>
        <p className="text-gray-300">
          Interactive weather data visualization and analysis
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg ${
              selectedPeriod === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg ${
              selectedPeriod === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reportSections.map((section, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-gray-700 rounded-lg">{section.icon}</div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                <p className="text-gray-300">{section.description}</p>
              </div>
            </div>
            {section.component}
          </div>
        ))}
      </div>
    </div>
  );
}