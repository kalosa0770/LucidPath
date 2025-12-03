import React from 'react';

const RiskAlerts = ({ list }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">High Risk Alerts</h3>
        <span className="text-xs text-red-300">{list.length} flagged</span>
      </div>

      <ul className="space-y-3 text-sm">
        {list.length === 0 ? (
          <li className="text-gray-400">No flagged clients</li>
        ) : (
          list.map((p, i) => (
            <li key={i} className="flex items-center justify-between p-3 rounded-md bg-white/3">
              <div>
                <div className="text-white font-semibold">{p.name}</div>
                <div className="text-xs text-gray-300">{p.reason}</div>
              </div>
              <div className="text-sm text-red-400 font-bold">{p.level}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RiskAlerts;
