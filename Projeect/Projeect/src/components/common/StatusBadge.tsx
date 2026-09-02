import React from 'react';

export type StatusVariant = 
  | 'CRITICAL' 
  | 'URGENT' 
  | 'STABLE' 
  | 'AVAILABLE' 
  | 'OCCUPIED' 
  | 'RESERVED' 
  | 'CLEANING' 
  | 'MAINTENANCE' 
  | 'EN_ROUTE' 
  | 'ARRIVED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'ON_DUTY' 
  | 'OFF_DUTY';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  pulse = false,
  size = 'sm'
}) => {
  const norm = (variant || status).toUpperCase();

  let styles = 'bg-slate-900 text-slate-300 border-slate-700';

  if (norm.includes('CRITICAL') || norm.includes('CANCEL') || norm.includes('BUSY')) {
    styles = 'bg-red-950/80 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20';
  } else if (norm.includes('URGENT') || norm.includes('MAINTENANCE') || norm.includes('HIGH_DEMAND')) {
    styles = 'bg-amber-950/80 text-amber-300 border-amber-500/50';
  } else if (norm.includes('AVAILABLE') || norm.includes('STABLE') || norm.includes('COMPLETED') || norm.includes('ON_DUTY')) {
    styles = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20';
  } else if (norm.includes('RESERVED') || norm.includes('EN_ROUTE') || norm.includes('DISPATCH') || norm.includes('PICKUP')) {
    styles = 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20';
  } else if (norm.includes('CLEANING')) {
    styles = 'bg-purple-950/80 text-purple-300 border-purple-500/50';
  }

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border font-bold uppercase tracking-wider ${sizeClass} ${styles}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
};
