import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const OpenStatusBadge = ({ className = '', showHours = true }) => {
  const { openStatus } = useSettings();

  if (!openStatus) return null;

  const isOpen = openStatus.isOpenNow;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
        isOpen
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          : 'bg-amber-50 text-amber-800 border border-amber-200'
      } ${className}`}
      title={openStatus.statusText}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOpen ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOpen ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
        ></span>
      </span>
      <span>
        {isOpen ? 'OPEN NOW' : 'CLOSED'}
        {showHours && openStatus.statusText ? ` • ${openStatus.statusText.replace(/^Open Now • |^Closed Now • /, '')}` : ''}
      </span>
    </div>
  );
};
