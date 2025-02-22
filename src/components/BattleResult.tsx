import React from 'react';
import { Trophy, Target, Flame, GitBranch, Users, MapPin } from 'lucide-react';
import type { BattleResult } from '../types';

interface BattleResultProps {
  result: BattleResult | null;
}

export function BattleResult({ result }: BattleResultProps) {
  if (!result) return null;

  const { winner, loser, insights, battleStats, humorousComments, error } = result;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ProfileInfo = ({ profile, isWinner }: { profile: typeof winner, isWinner: boolean }) => (
    <div className={`${
      isWinner 
        ? 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-blue-100 dark:border-blue-500/20' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    } p-6 rounded-xl shadow-lg relative overflow-hidden border`}>
      {isWinner && (
        <div className="absolute top-4 right-4">
          <Trophy className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        </div>
      )}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className={`w-16 h-16 rounded-full border-2 ${
              isWinner ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.username}
              {isWinner && (
                <span className="text-sm font-normal text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded-full ml-2">
                  Winner!
                </span>
              )}
            </h3>
            <p className={`${
              isWinner ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
            } font-medium`}>
              {isWinner ? humorousComments.winner : humorousComments.loser}
            </p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{profile.bio || 'No bio available'}</p>
        
        {/* Location Information */}
        {profile.location && (
          <div className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <GitBranch className="w-4 h-4" />
          <span>{profile.repositories} repos</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Users className="w-4 h-4" />
          <span>{profile.followers} followers</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Top Languages</h4>
        <div className="flex flex-wrap gap-2">
          {profile.topLanguages.map((lang) => (
            <span
              key={lang}
              className={`px-2 py-1 ${
                isWinner 
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              } rounded-full text-sm`}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Member since {formatDate(profile.createdAt)}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl space-y-6">
      {error?.geminiError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg text-yellow-800 dark:text-yellow-200">
          {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfo profile={winner} isWinner={true} />
        <ProfileInfo profile={loser} isWinner={false} />
      </div>

      {/* Battle Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Flame className="w-5 h-5 text-orange-500" />
          Battle Statistics
        </h3>
        <div className="space-y-4">
          {battleStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{index === 0 ? winner.username : loser.username}</span>
                <span>{stat.totalScore.toFixed(1)}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'
                  }`}
                  style={{ width: `${(stat.totalScore / 100) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights - Only show if available */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Winning Factors
            </h3>
            <ul className="space-y-3">
              {insights.winningFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-6 h-6 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Target className="w-5 h-5 text-blue-500" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {insights.improvementAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block w-6 h-6 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}