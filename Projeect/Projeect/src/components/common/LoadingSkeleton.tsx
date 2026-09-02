import React from 'react';
import { LucideIcon, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ rows?: number; heightClass?: string }> = ({ 
  rows = 3, 
  heightClass = 'h-16' 
}) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className={`w-full rounded-2xl bg-slate-900/60 border border-slate-800/80 ${heightClass}`} 
        />
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title,
  description = 'No active records found matching your filters.',
  icon: Icon = Inbox,
  actionText,
  onAction
}) => {
  return (
    <div className="p-8 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/60 text-center space-y-3 flex flex-col items-center justify-center">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
        <Icon className="w-8 h-8 text-cyan-400" />
      </div>
      <h4 className="text-base font-bold text-white font-heading">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({
  title = 'Unable to Load Data',
  message,
  onRetry
}) => {
  return (
    <div className="p-6 rounded-3xl bg-red-950/30 border border-red-500/40 text-center space-y-3 flex flex-col items-center justify-center">
      <div className="p-3 rounded-2xl bg-red-950 border border-red-500/50 text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white font-heading">{title}</h4>
        <p className="text-xs text-red-200 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-500/20 transition flex items-center space-x-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
