import React from 'react';

const AppointmentsCard = ({ appointments }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Today's Appointments</h3>
        <span className="text-xs text-gray-400">{appointments.length}</span>
      </div>

      <ul className="space-y-3">
        {appointments.length === 0 ? (
          <li className="text-gray-400">No appointments for today</li>
        ) : (
          appointments.map((a, i) => (
            <li key={i} className="flex items-center justify-between bg-white/2 p-3 rounded-lg">
              <div>
                <div className="text-white font-semibold">{a.client}</div>
                <div className="text-sm text-gray-300">{a.type} • {a.time}</div>
              </div>
              <div className="text-sm text-gray-300">{a.mode}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AppointmentsCard;
