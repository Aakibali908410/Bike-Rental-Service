import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon = AlertCircle, title, message, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="mb-4 p-4 bg-secondary rounded-full">
        <Icon size={32} className="text-accent" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      <p className="text-textSecondary text-center mb-6 max-w-sm">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
