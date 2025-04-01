// components/MoodStats.tsx
import React from 'react';
import { MoodStats as MoodStatsType } from '../types';
import { moodResponses } from '../moodData';
import { MoodType } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MoodStatsProps {
  stats: MoodStatsType[];
  onReset: () => void;
  onStopSound?: () => void;
  isSoundPlaying?: boolean;
}

export const MoodStats: React.FC<MoodStatsProps> = ({ 
  stats, 
  onReset,
  onStopSound,
  isSoundPlaying
}) => {
  const moodCounts = stats.reduce((acc, { mood }) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
    color: getColorFromMood(mood as MoodType),
  }));

  return (
    <div className="w-full max-w-md mx-auto backdrop-blur-md bg-gray-900/40 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
      <h2 className="text-xl font-bold text-center text-blue-300 mb-4">Mood Stats</h2>

      {stats.length === 0 ? (
        <>
          <p className="text-center text-gray-300 mb-4">
            No moods recorded yet. Pick a mood to get started!
          </p>
          <p className="text-center text-green-300 mb-4 animate-pulse">
            ✅ Mood stats cleared!
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {pieData.map((entry) => (
              <div 
                key={entry.name} 
                className="flex items-center gap-1 bg-gray-800/70 px-3 py-1 rounded-full"
              >
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-white">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}

      <button
        onClick={onReset}
        className="w-full mt-4 py-3 bg-gray-800/70 hover:bg-gray-700/70 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
      >
        Reset Stats
      </button>

      {isSoundPlaying && onStopSound && (
        <button
          onClick={onStopSound}
          className="w-full mt-2 py-2 bg-red-700/70 hover:bg-red-600/80 text-white font-medium rounded-xl transition-all duration-300"
        >
          🔇 Stop Sound
        </button>
      )}
    </div>
  );
};

function getColorFromMood(mood: MoodType): string {
  const colorClass = moodResponses[mood]?.color || '';
  switch (colorClass) {
    case 'bg-yellow-200': return '#FEF9C3';
    case 'bg-blue-200': return '#BFDBFE';
    case 'bg-red-200': return '#FECACA';
    case 'bg-purple-200': return '#E9D5FF';
    case 'bg-pink-200': return '#FBCFE8';
    case 'bg-indigo-200': return '#C7D2FE';
    case 'bg-teal-200': return '#99F6E4';
    case 'bg-sky-200': return '#BAE6FD';
    case 'bg-amber-200': return '#FDE68A';
    case 'bg-emerald-200': return '#A7F3D0';
    default: return '#CBD5E1';
  }
}
