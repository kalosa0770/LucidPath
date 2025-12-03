import React from 'react';

const MessagesPanel = ({ messages }) => {
  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold font-extrabold">Messages</h3>
        <span className="text-xs text-gray-400">{messages.length} unread</span>
      </div>

      <ul className="space-y-3">
        {messages.length === 0 ? (
          <li className="text-gray-400">No messages</li>
        ) : (
          messages.map((m, i) => (
            <li key={i} className="flex items-start gap-3 p-2 rounded-md hover:bg-white/3">
              <div className="flex-1">
                <div className="text-white font-semibold">{m.from}</div>
                <div className="text-xs text-gray-300">{m.preview}</div>
              </div>
              <div className="text-xs text-gray-400">{m.time}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MessagesPanel;
