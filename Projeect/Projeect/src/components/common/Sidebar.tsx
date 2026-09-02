import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Building2, 
  Calendar, 
  FileText, 
  User, 
  BedDouble, 
  Users, 
  TrendingUp, 
  Navigation, 
  History, 
  Truck, 
  Cpu, 
  Activity, 
  PhoneCall, 
  Sparkles,
  Pill,
  FlaskConical,
  Receipt,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { currentRole, logout } = useAuth();
  const { activeEmergency, hospitals, medicines } = useEmergency();

  const totalAvailableBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + h.icuBedsAvailable, 0);
  const lowStockMeds = medicines.filter(m => m.quantity <= m.minQuantity).length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getMenuItems = (role: UserRole | null): MenuItem[] => {
    switch (role) {
      case 'PATIENT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { 
            id: 'emergency', 
            label: 'Emergency SOS', 
            icon: ShieldAlert, 
            highlight: true,
            badge: activeEmergency ? 'ACTIVE' : undefined 
          },
          { id: 'hospitals', label: 'Nearby Hospitals', icon: Building2 },
          { id: 'appointments', label: 'Appointments & Tokens', icon: Calendar },
          { id: 'ehospital', label: 'E-Hospital & Rx', icon: Receipt },
          { id: 'records', label: 'Medical History', icon: FileText },
          { id: 'profile', label: 'My Health Profile', icon: User }
        ];

      case 'HOSPITAL_ADMIN':
      case 'DOCTOR':
      case 'NURSE':
        return [
          { id: 'overview', label: 'Hospital Overview', icon: LayoutDashboard },
          { 
            id: 'emergency_queue', 
            label: 'Emergency Queue', 
            icon: ShieldAlert, 
            highlight: true,
            badge: activeEmergency ? '1 ALERT' : undefined 
          },
          { id: 'beds', label: 'Beds Management', icon: BedDouble, badge: `${totalIcuBeds} ICU` },
          { id: 'doctors', label: 'Doctor Roster', icon: Users },
          { id: 'medicines', label: 'Medicine & Pharmacy', icon: Pill, badge: lowStockMeds > 0 ? `${lowStockMeds} LOW` : undefined },
          { id: 'laboratory', label: 'Pathology & Labs', icon: FlaskConical },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'analytics', label: 'Hospital Analytics', icon: TrendingUp }
        ];

      case 'AMBULANCE_DRIVER':
        return [
          { id: 'dashboard', label: 'Driver Cockpit', icon: LayoutDashboard },
          { 
            id: 'current_trip', 
            label: 'Current Dispatch', 
            icon: Navigation, 
            highlight: true,
            badge: activeEmergency ? 'LIVE' : undefined 
          },
          { id: 'trip_history', label: 'Trip History', icon: History }
        ];

      case 'SUPER_ADMIN':
        return [
          { id: 'command_center', label: 'Command Center', icon: Activity, highlight: true },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'hospitals', label: 'Hospital Network', icon: Building2 },
          { id: 'fleet', label: 'Ambulance Fleet', icon: Truck },
          { id: 'ai_monitoring', label: 'AI Model Logs', icon: Cpu },
          { id: 'analytics', label: 'Heatmap & Analytics', icon: TrendingUp }
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems(currentRole);

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-blue-950/60 bg-[#070B14]/80 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 select-none justify-between p-4">
      {/* Top Menu Items */}
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-heading">
            {currentRole ? currentRole.replace('_', ' ') : 'USER'} WORKSPACE
          </div>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : item.highlight ? 'text-red-400' : 'text-slate-400'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.2 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      item.badge.toString().includes('ALERT') || item.badge.toString().includes('ACTIVE') || item.badge.toString().includes('LIVE') || item.badge.toString().includes('LOW')
                        ? 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-blue-950 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Network Quick Telemetry Widget */}
        <div className="p-3.5 rounded-2xl glass-card border border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-slate-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 tracking-wide flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE CITY NETWORK</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-base font-bold text-white font-heading">{totalAvailableBeds}</div>
              <div className="text-[10px] text-slate-400">Open ER Beds</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-base font-bold text-cyan-400 font-heading">{totalIcuBeds}</div>
              <div className="text-[10px] text-slate-400">ICU Slots</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Ambulance Response ETA:</span>
            <span className="text-emerald-400 font-bold">~5.2 mins</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Logout & Emergency Hotline */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/60 text-red-400 hover:text-red-200 text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>

        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-center">
          <div className="flex items-center justify-center space-x-2 text-red-400 text-xs font-bold font-heading">
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>EMERGENCY: 911</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">24/7 Priority Routing Active</p>
        </div>
      </div>
    </aside>
  );
};
