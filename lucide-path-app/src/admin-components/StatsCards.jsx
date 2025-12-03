import React from 'react';
import { Users, ListChecks, Activity, AlertTriangle } from 'lucide-react';
import AdminBadge from './AdminBadge';

const StatsCards = ({ stats }) => {
  const items = [
    { title: 'Active Clients', value: stats.clients, icon: <Users /> },
    { title: 'Pending Tasks', value: stats.tasks, icon: <ListChecks /> },
    { title: 'Monthly Sessions', value: stats.sessions, icon: <Activity /> },
    { title: 'Risk Cases', value: stats.riskCases, icon: <AlertTriangle /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it.title} className="p-5 bg-white/5 border border-white/5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10 text-gold">{it.icon}</div>
              <div>
                <div className="text-xs text-gray-300">{it.title}</div>
                <div className="text-2xl font-bold text-white">{it.value ?? 0}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">This month</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
