import React, { useState } from 'react';
import { Github, Swords } from 'lucide-react';

interface ProfileInputProps {
  onBattle: (username1: string, username2: string) => void;
  isLoading: boolean;
}

export function ProfileInput({ onBattle, isLoading }: ProfileInputProps) {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username1.trim() && username2.trim()) {
      onBattle(username1.trim(), username2.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Github className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full px-4 pl-12 py-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            style={{ WebkitAppearance: 'none' }}
            placeholder="Enter first GitHub username"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute inset-0 rounded-xl transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none ring-2 ring-blue-500 dark:ring-blue-400" />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Github className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full px-4 pl-12 py-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            style={{ WebkitAppearance: 'none' }}
            placeholder="Enter second GitHub username"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute inset-0 rounded-xl transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none ring-2 ring-blue-500 dark:ring-blue-400" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !username1.trim() || !username2.trim()}
        className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Battle in Progress...</span>
          </>
        ) : (
          <>
            <Swords className="w-5 h-5" />
            <span>Initiate Battle!</span>
          </>
        )}
      </button>
    </form>
  );
}