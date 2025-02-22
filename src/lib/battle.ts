import type { DevProfile, BattleResult } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function calculateBattleStats(profile: DevProfile): {
  repoScore: number;
  followersScore: number;
  activityScore: number;
  languageScore: number;
  contributionScore: number;
  organizationScore: number;
  totalScore: number;
} {
  // Repository quality score (max 20 points)
  // Consider both quantity and recent activity
  const repoScore = Math.min(profile.repositories / 40, 1) * 20;

  // Followers impact score (max 15 points)
  // Logarithmic scale to prevent extremely popular accounts from dominating
  const followersScore = Math.min(Math.log10(profile.followers + 1) / Math.log10(1000), 1) * 15;

  // Activity and consistency score (max 20 points)
  const accountAge = (new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const daysInactive = profile.lastCommitDate 
    ? (new Date().getTime() - new Date(profile.lastCommitDate).getTime()) / (1000 * 60 * 60 * 24)
    : 365;
  
  // Higher score for recent activity, penalize inactivity
  const activityScore = Math.max(
    0,
    (20 * (1 - (daysInactive / 365))) + // Recent activity weight
    (Math.min(accountAge / 365, 5) * 2) // Account age bonus (up to 10 points for 5+ years)
  );

  // Language diversity and modern tech stack (max 15 points)
  const languageScore = (profile.topLanguages.length / 5) * 15;

  // Contribution and engagement score (max 15 points)
  const hasCompany = profile.company ? 3 : 0;
  const hasBlog = profile.blog ? 2 : 0;
  const hasTwitter = profile.twitter ? 2 : 0;
  const hasLocation = profile.location ? 2 : 0;
  const hasBio = profile.bio ? 3 : 0;
  const contributionScore = Math.min(
    hasCompany + hasBlog + hasTwitter + hasLocation + hasBio,
    15
  );

  // Organization involvement score (max 15 points)
  const organizationScore = Math.min(
    ((profile.organizations?.length || 0) / 3) * 15, // 5 points per organization, max 15
    15
  );

  // Calculate total score (max 100 points)
  const totalScore = 
    repoScore +
    followersScore +
    activityScore +
    languageScore +
    contributionScore +
    organizationScore;

  return {
    repoScore,
    followersScore,
    activityScore,
    languageScore,
    contributionScore,
    organizationScore,
    totalScore
  };
}

function generateHumorousComments(winner: DevProfile, loser: DevProfile): { winner: string; loser: string } {
  const comments = {
    winner: '',
    loser: ''
  };

  // Winner comments based on their strongest attribute
  const winnerStats = calculateBattleStats(winner);
  const topScore = Math.max(
    winnerStats.repoScore / 20,
    winnerStats.followersScore / 15,
    winnerStats.activityScore / 20,
    winnerStats.languageScore / 15,
    winnerStats.contributionScore / 15,
    winnerStats.organizationScore / 15
  );

  if (winnerStats.repoScore / 20 === topScore) {
    comments.winner = "🏗️ The Code Architect - Building digital empires with every commit!";
  } else if (winnerStats.followersScore / 15 === topScore) {
    comments.winner = "🌟 The Tech Influencer - Your code has more fans than a K-pop star!";
  } else if (winnerStats.activityScore / 20 === topScore) {
    comments.winner = "⚡ The Consistency King - Keeping that GitHub graph greener than a rainforest!";
  } else if (winnerStats.languageScore / 15 === topScore) {
    comments.winner = "🔮 The Polyglot Wizard - Masters every programming language known to mankind!";
  } else if (winnerStats.organizationScore / 15 === topScore) {
    comments.winner = "🌐 The Community Champion - Spreading code love across the open-source universe!";
  } else {
    comments.winner = "🚀 The All-Star Dev - Crushing it in every dimension of the coding game!";
  }

  // Loser comments based on their potential
  if (loser.lastCommitDate) {
    const lastCommit = new Date(loser.lastCommitDate);
    const monthsInactive = Math.floor((new Date().getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsInactive > 6) {
      comments.loser = "🧟‍♂️ The Code Zombie - Time to resurrect that GitHub activity!";
    } else if (monthsInactive > 3) {
      comments.loser = "🦥 The Occasional Coder - Remember: consistency beats intensity!";
    } else {
      comments.loser = "🔄 The Rising Phoenix - Keep pushing, your time to shine is coming!";
    }
  } else {
    comments.loser = "👻 The Mystery Coder - Your potential is as mysterious as your commit history!";
  }

  return comments;
}

export async function analyzeBattle(profile1: DevProfile, profile2: DevProfile): Promise<BattleResult> {
  // Calculate battle stats for both profiles
  const stats1 = calculateBattleStats(profile1);
  const stats2 = calculateBattleStats(profile2);

  // Determine winner and loser
  const winner = stats1.totalScore >= stats2.totalScore ? profile1 : profile2;
  const loser = stats1.totalScore >= stats2.totalScore ? profile2 : profile1;
  const winnerStats = stats1.totalScore >= stats2.totalScore ? stats1 : stats2;
  const loserStats = stats1.totalScore >= stats2.totalScore ? stats2 : stats1;

  let insights;
  let error;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze these two GitHub profiles and provide battle insights:

Profile 1: ${JSON.stringify(profile1, null, 2)}
Profile 2: ${JSON.stringify(profile2, null, 2)}

Create a battle analysis in JSON format with the following structure. Return ONLY the raw JSON:

{
  "winningFactors": ["string", "string", "string"],
  "improvementAreas": ["string", "string", "string"]
}

Guidelines:
1. Winning factors: List 3 specific reasons why the winner (${winner.username}) performed better
2. Improvement areas: List 3 specific suggestions for the other developer (${loser.username}) to improve
3. Be specific and actionable in your suggestions
4. Focus on real metrics and patterns from the profiles
5. Consider:
   - Repository quality and quantity
   - Contribution consistency
   - Community engagement
   - Technical diversity
   - Professional presence
6. Keep each point concise but meaningful`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    insights = JSON.parse(text);
  } catch (err) {
    console.error('Error with Gemini analysis:', err);
    error = {
      geminiError: true,
      message: 'AI analysis unavailable. Showing GitHub stats comparison.'
    };
  }

  const battleResult = {
    winner,
    loser,
    insights,
    battleStats: [winnerStats, loserStats],
    humorousComments: generateHumorousComments(winner, loser),
    error
  };

  // Store battle result in sessionStorage
  try {
    sessionStorage.setItem('lastBattleResult', JSON.stringify(battleResult));
  } catch (e) {
    console.warn('Failed to store battle result in sessionStorage:', e);
  }

  return battleResult;
}