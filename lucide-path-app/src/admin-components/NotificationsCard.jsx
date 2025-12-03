import React from 'react';
import AdminBadge from './AdminBadge';

const NotificationsCard = ({ notifications }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Notifications</h3>
        <span className="text-xs text-gray-400">{notifications.length} new</span>
      </div>
      <ul className="space-y-3 text-sm text-gray-200 max-h-44 overflow-auto">
        {notifications.length === 0 ? (
          <li className="text-gray-400">No notifications</li>
        ) : (
          notifications.map((n, i) => (
            <li key={i} className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="text-gray-100">{n.title}</div>
                <div className="text-xs text-gray-400">{n.time}</div>
              </div>
              <AdminBadge>{n.type}</AdminBadge>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationsCard;
