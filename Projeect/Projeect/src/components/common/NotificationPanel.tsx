import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  Calendar, 
  Pill, 
  FlaskConical, 
  Receipt, 
  Volume2, 
  Trash2, 
  Filter,
  Sparkles,
  PhoneCall,
  Radio
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { AppNotification } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    soundEnabled, 
    toggleSound 
  } = useEmergency();

  const [filterType, setFilterType] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'EMERGENCY':
      case 'PRE_ALERT':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'PRESCRIPTION':
        return <Pill className="w-4 h-4 text-cyan-400" />;
      case 'LAB':
        return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-card border border-cyan-500/40 bg-[#0A0F1D] shadow-2xl p-6 text-slate-100 space-y-4 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-heading">
                  Notification & Alert Center
                </h3>
                <span className="text-[10px] text-cyan-400">
                  {notifications.filter(n => !n.read).length} Unread Alerts (SMS, Push, In-App)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border transition ${
                  soundEnabled 
                    ? 'bg-blue-950 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title={soundEnabled ? 'Audio Alerts Enabled' : 'Muted'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-1 overflow-x-auto py-2 border-b border-slate-800/80 text-[11px]">
            {['ALL', 'EMERGENCY', 'APPOINTMENT', 'PRESCRIPTION', 'LAB', 'INFO'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
                  filterType === t
                    ? 'bg-cyan-600/40 text-cyan-300 border border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-2 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No notifications right now.</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3.5 rounded-2xl border text-xs transition cursor-pointer space-y-1 ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                    : 'bg-slate-900/90 border-cyan-500/40 text-slate-200 shadow-md shadow-cyan-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    {getIcon(item.type)}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-6">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={clearAllNotifications}
            className="text-slate-400 hover:text-red-400 transition flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
          <span className="text-[10px] text-slate-500 font-mono">
            Firebase & Twilio Gateway Connected
          </span>
        </div>
      </div>
    </div>
  );
};
