import React from 'react';

const AdminBadge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold">
    {children}
  </span>
);

export default AdminBadge;
