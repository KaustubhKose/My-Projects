import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  Bell, 
  Volume2, 
  VolumeX, 
  User, 
  Building2, 
  Truck, 
  Cpu, 
  Radio, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  ExternalLink,
  Home,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { NotificationPanel } from './NotificationPanel';
import { UserRole } from '../../types';

interface NavbarProps {
  onNavigateTab?: (tab: string) => void;
  onGoToLanding?: () => void;
  isLandingView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigateTab, 
  onGoToLanding,
  isLandingView = false
}) => {
  const navigate = useNavigate();
  const { currentUser, currentRole, isAuthenticated, switchRole, logout, getDashboardPath } = useAuth();
  const { 
    activeEmergency, 
    notifications, 
    soundEnabled, 
    toggleSound 
  } = useEmergency();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: { role: UserRole; label: string; icon: React.ElementType; color: string; path: string }[] = [
    { role: 'PATIENT', label: 'Patient / User Panel', icon: User, color: 'text-cyan-400', path: '/user' },
    { role: 'HOSPITAL_ADMIN', label: 'Hospital Admin Command', icon: Building2, color: 'text-blue-400', path: '/hospital' },
    { role: 'DOCTOR', label: 'Emergency Physician', icon: Activity, color: 'text-emerald-400', path: '/hospital' },
    { role: 'NURSE', label: 'Triage Nurse', icon: ShieldAlert, color: 'text-teal-400', path: '/hospital' },
    { role: 'AMBULANCE_DRIVER', label: 'Ambulance Driver Cockpit', icon: Truck, color: 'text-amber-400', path: '/ambulance' },
    { role: 'SUPER_ADMIN', label: 'City EMS Super Admin', icon: Cpu, color: 'text-purple-400', path: '/admin' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleLogoClick = () => {
    if (onGoToLanding) {
      onGoToLanding();
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav border-b border-cyan-500/20 bg-[#040A1D]/90 backdrop-blur-xl select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition">
                <Activity className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#040A1D] animate-ping" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-black tracking-tight text-white font-heading">
                    Life<span className="text-cyan-400">Link</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold font-mono">
                    DEMO MODE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block -mt-0.5 tracking-wider uppercase">
                  Connected Healthcare OS
                </span>
              </div>
            </div>

            {/* Landing Page Button */}
            <button
              onClick={handleLogoClick}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
          </div>

          {/* Active Emergency Broadcast Ticker */}
          {activeEmergency && (
            <div 
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab(currentRole === 'AMBULANCE_DRIVER' ? 'current_trip' : currentRole === 'PATIENT' ? 'emergency' : 'emergency_queue');
                } else if (currentRole) {
                  navigate(getDashboardPath(currentRole));
                }
              }}
              className="hidden md:flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-bold shadow-lg shadow-red-500/20 cursor-pointer animate-pulse hover:brightness-125 transition"
            >
              <Radio className="w-3.5 h-3.5 text-red-400 animate-spin" />
              <span className="text-white">ACTIVE CRITICAL SOS:</span>
              <span className="text-cyan-300 font-mono">#{activeEmergency.id}</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-300">ETA ~{activeEmergency.etaMinutes || 5} min</span>
            </div>
          )}

          {/* Actions & Role Switcher / Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-blue-950/80 border-cyan-500/40 text-cyan-400 hover:bg-blue-900' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Siren & Audio Enabled' : 'Audio Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Center Drawer Trigger */}
            <button
              onClick={() => setNotificationPanelOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[9px] font-black font-mono animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {isAuthenticated && currentUser ? (
              <>
                {/* Role Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 text-white text-xs font-bold transition shadow-md shadow-cyan-500/10 cursor-pointer"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-cyan-400"
                    />
                    <span className="hidden sm:inline font-heading truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/50 text-[9px] uppercase font-mono">
                      {currentRole?.replace('_', ' ')}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Role Switcher Menu */}
                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-3xl glass-card border border-cyan-500/40 bg-[#0A0F1D] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                        Switch Active Panel (Instant Demo)
                      </div>
                      {rolesList.map(item => {
                        const Icon = item.icon;
                        const isSelected = currentRole === item.role;
                        return (
                          <button
                            key={item.role}
                            onClick={() => {
                              switchRole(item.role);
                              setRoleMenuOpen(false);
                              navigate(item.path);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600/30 border border-cyan-400 text-cyan-300'
                                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <Icon className={`w-4 h-4 ${item.color}`} />
                              <span>{item.label}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                        );
                      })}

                      {/* Logout option in dropdown */}
                      <div className="pt-1.5 border-t border-slate-800/80 mt-1">
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout ({currentUser.name.split(' ')[0]})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Logout Button in Navbar */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-bold transition cursor-pointer shadow-sm shadow-red-500/10"
                  title="Log out of LifeLink"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition"
                >
                  Login
                </Link>
                <Link
                  to="/login?tab=signup"
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Center Modal Drawer */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
      />
    </>
  );
};
