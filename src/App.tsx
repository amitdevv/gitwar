import React, { useState, useEffect } from 'react';
import { Github, Heart } from 'lucide-react';
import { ProfileInput } from './components/ProfileInput';
import { BattleResult } from './components/BattleResult';
import { ThemeToggle } from './components/ThemeToggle';
import type { BattleResult as BattleResultType } from './types';
import { fetchGitHubProfile } from './lib/github';
import { analyzeBattle } from './lib/battle';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load battle result from sessionStorage on mount
  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem('lastBattleResult');
      if (savedResult) {
        setBattleResult(JSON.parse(savedResult));
      }
    } catch (e) {
      console.warn('Failed to load battle result from sessionStorage:', e);
    }
  }, []);

  const handleBattle = async (username1: string, username2: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch both GitHub profiles
      const [profile1, profile2] = await Promise.all([
        fetchGitHubProfile(username1),
        fetchGitHubProfile(username2)
      ]);
      
      // Analyze battle
      const result = await analyzeBattle(profile1, profile2);
      
      setBattleResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setBattleResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <ThemeToggle />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">GitWar</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Battle of the Devs! Compare GitHub profiles head-to-head and see who comes out on top.
            Get insights and recommendations to level up your game! 🚀
          </p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <ProfileInput onBattle={handleBattle} isLoading={isLoading} />
          {error && (
            <div className="w-full max-w-2xl p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-200">
              {error}
            </div>
          )}
          <BattleResult result={battleResult} />
        </div>

        <footer className="mt-12 py-6 text-center text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by</span>
            <a
              href="https://github.com/amitdevv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <Github className="w-4 h-4 " />
              <span>Amit</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}