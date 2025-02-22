import React from 'react';
import { SkillAnalysis } from '../types';
import { Banknote, Brain, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';

interface AnalysisResultProps {
  analysis: SkillAnalysis | null;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  if (!analysis) return null;

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">Strengths</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-semibold">Areas for Improvement</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="text-gray-700">{weakness}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold">Estimated Salary Range</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${analysis.salaryRange.min.toLocaleString()} - ${analysis.salaryRange.max.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold">Skill Gaps</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {analysis.skillGaps.map((gap, index) => (
              <li key={index} className="text-gray-700">{gap}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold">Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="inline-block w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}