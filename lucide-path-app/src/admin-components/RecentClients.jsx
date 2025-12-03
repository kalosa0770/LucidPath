import React from 'react';

const RecentClients = ({ clients }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Recent Clients</h3>
        <span className="text-xs text-gray-400">{clients.length}</span>
      </div>

      <ul className="space-y-3">
        {clients.length === 0 ? (
          <li className="text-gray-400">No recent clients</li>
        ) : (
          clients.map((c, i) => (
            <li key={i} className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-white/3">
              <div>
                <div className="text-white font-semibold">{c.name}</div>
                <div className="text-xs text-gray-300">{c.email}</div>
              </div>
              <div className="text-xs text-gray-400">{c.lastVisit}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentClients;
