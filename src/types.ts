export interface DevProfile {
  username: string;
  repositories: number;
  followers: number;
  following: number;
  topLanguages: string[];
  bio: string;
  publicRepos: number;
  createdAt: string;
  avatarUrl: string;
  lastCommitDate?: string;
  score?: number;
  // New fields
  location?: string;
  company?: string;
  blog?: string;
  twitter?: string;
  totalContributions?: number;
  organizations?: string[];
  status?: {
    message?: string;
    emojiHTML?: string;
  };
}

export interface BattleResult {
  winner: DevProfile;
  loser: DevProfile;
  insights?: {
    winningFactors: string[];
    improvementAreas: string[];
  };
  battleStats: {
    repoScore: number;
    followersScore: number;
    activityScore: number;
    languageScore: number;
    contributionScore: number;
    organizationScore: number;
    totalScore: number;
  }[];
  humorousComments: {
    winner: string;
    loser: string;
  };
  error?: {
    geminiError?: boolean;
    message?: string;
  };
}

export interface LeaderboardEntry {
  username: string;
  wins: number;
  losses: number;
  score: number;
  title: string;
}