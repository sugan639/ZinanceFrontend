import React, { useEffect } from 'react';

type ErrorMessageProps = {
  message: string;
  onClose: () => void;
  duration?: number; // in ms, default 4000
};

export default function ErrorMessage({ message, onClose, duration = 4000 }: ErrorMessageProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="font-bold">Error:</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}