import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  const bgColors = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-blue-600',
    warning: 'bg-warning',
  };

  return (
    <div className={`flex items-center gap-3 ${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black hover:bg-opacity-20 rounded">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-40">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
