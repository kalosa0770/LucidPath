import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const MoodTrends = ({ data }) => {
  const fallback = [
    { date: 'Mon', mood: 3 },
    { date: 'Tue', mood: 4 },
    { date: 'Wed', mood: 2.5 },
    { date: 'Thu', mood: 3.5 },
    { date: 'Fri', mood: 4.2 },
    { date: 'Sat', mood: 4.5 },
    { date: 'Sun', mood: 4.0 },
  ];
  const chartData = data.length ? data : fallback;

  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Mood Trends (weekly average)</h3>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#0b2b2b" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#FFD700" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodTrends;
