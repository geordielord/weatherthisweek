import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string) => void;
  onGetLocation: () => void;
}

export default function SearchBar({ onSearch, onGetLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSubmit} className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-gray-700 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
      </form>
      
      <button
        onClick={onGetLocation}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5" />
        <span>Get My Location</span>
      </button>
    </div>
  );
}