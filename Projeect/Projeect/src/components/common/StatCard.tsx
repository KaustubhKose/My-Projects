import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'red' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'cyan'
}) => {
  const colorMap = {
    blue: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
    red: 'border-red-500/30 text-red-400 bg-red-950/20',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-950/20'
  };

  return (
    <div className={`p-4 rounded-3xl glass-card border ${colorMap[accentColor]} space-y-1 transition hover:scale-[1.02] shadow-xl`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{title}</span>
        <div className={`p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 ${colorMap[accentColor].split(' ')[1]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="text-2xl font-black text-white font-heading tracking-tight">
        {value}
      </div>

      <div className="flex items-center justify-between text-[10px] pt-1">
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
        {trend && (
          <span className={`font-bold ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
