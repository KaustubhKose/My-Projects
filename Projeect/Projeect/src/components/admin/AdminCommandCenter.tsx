import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Building2, 
  Truck, 
  Users, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Radio, 
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  Plus,
  UserCheck,
  Power,
  Zap,
  Flame,
  Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { MapView } from '../common/MapView';
import { SeverityLevel, User, Hospital, AmbulanceVehicle } from '../../types';
import { DEMO_USERS, INITIAL_AI_CAPACITY_FORECAST } from '../../services/mockData';

type AdminTab = 'command_center' | 'users' | 'hospitals' | 'fleet' | 'ai_monitoring' | 'analytics';

export const AdminCommandCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    activeEmergency, 
    emergencyHistory, 
    hospitals, 
    ambulances, 
    adminOverrideSeverity 
  } = useEmergency();

  const [activeTab, setActiveTab] = useState<AdminTab>('command_center');
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideSeverity, setOverrideSeverity] = useState<SeverityLevel>('URGENT');
  const [overrideReason, setOverrideReason] = useState('Physician clinical assessment indicates secondary stabilization');
  
  // Users state
  const [usersList, setUsersList] = useState<User[]>(DEMO_USERS);
  const [userSearch, setUserSearch] = useState('');

  // Performance Trends
  const responseTimeData = [
    { time: '08:00', avgMinutes: 6.4, fastest: 3.8, slowest: 9.1 },
    { time: '10:00', avgMinutes: 5.8, fastest: 3.2, slowest: 8.4 },
    { time: '12:00', avgMinutes: 7.2, fastest: 4.1, slowest: 10.5 },
    { time: '14:00', avgMinutes: 5.1, fastest: 2.9, slowest: 7.8 },
    { time: '16:00', avgMinutes: 6.9, fastest: 3.5, slowest: 9.8 },
    { time: '18:00', avgMinutes: 5.4, fastest: 3.0, slowest: 8.2 },
    { time: '20:00', avgMinutes: 4.8, fastest: 2.5, slowest: 7.0 }
  ];

  // 24-Hour Peak Hour Heatmap Data (Specification 42)
  const peakHourHeatmapData = [
    { hour: '00:00', Mon: 2, Tue: 1, Wed: 3, Thu: 2, Fri: 4, Sat: 6, Sun: 5 },
    { hour: '04:00', Mon: 1, Tue: 2, Wed: 1, Thu: 1, Fri: 3, Sat: 5, Sun: 4 },
    { hour: '08:00', Mon: 7, Tue: 8, Wed: 6, Thu: 7, Fri: 9, Sat: 6, Sun: 5 },
    { hour: '12:00', Mon: 12, Tue: 11, Wed: 14, Thu: 10, Fri: 13, Sat: 11, Sun: 9 },
    { hour: '16:00', Mon: 9, Tue: 10, Wed: 8, Thu: 11, Fri: 14, Sat: 12, Sun: 10 },
    { hour: '20:00', Mon: 16, Tue: 15, Wed: 18, Thu: 17, Fri: 22, Sat: 24, Sun: 19 },
    { hour: '23:00', Mon: 6, Tue: 5, Wed: 7, Thu: 8, Fri: 12, Sat: 14, Sun: 10 }
  ];

  const severityPieData = [
    { name: 'Critical (Red)', value: 38, color: '#EF4444' },
    { name: 'Urgent (Amber)', value: 44, color: '#F59E0B' },
    { name: 'Stable (Green)', value: 18, color: '#10B981' }
  ];

  const handleApplyOverride = () => {
    adminOverrideSeverity(overrideSeverity, overrideReason, currentUser.name);
    setOverrideModalOpen(false);
  };

  const toggleUserActive = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const totalBeds = hospitals.reduce((acc, h) => acc + h.totalBeds, 0);
  const openBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + h.icuBedsAvailable, 0);
  const totalAmbulances = ambulances.length;
  const activeAmbulances = ambulances.filter(a => a.status !== 'AVAILABLE' && a.status !== 'OFFLINE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                City EMS Command Center & AI Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Multi-panel real-time synchronization, AI capacity forecasting, and fleet telematics.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Network Health: <strong className="text-emerald-400">99.98%</strong></span>
          </span>
        </div>
      </div>

      {/* TOP 8 KPI STATS CARDS (Specification 37) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl glass-card border border-red-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-red-400 text-xs font-semibold">
            <span>Active Emergencies</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-heading">{activeEmergency ? 1 : 0}</div>
          <div className="text-[10px] text-slate-400">{activeEmergency ? 'In Progress' : 'All Clear'}</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-cyan-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold">
            <span>Active Ambulances</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-heading">
            {activeAmbulances} <span className="text-xs text-slate-400 font-normal">/ {totalAmbulances}</span>
          </div>
          <div className="text-[10px] text-slate-400">Units on duty</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hospitals Online</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{hospitals.length}</div>
          <div className="text-[10px] text-slate-400">24/7 Trauma hubs</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-amber-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
            <span>Patients En Route</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-heading">{activeEmergency ? 1 : 0}</div>
          <div className="text-[10px] text-slate-400">Transit in progress</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-emerald-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
            <span>Avg Response Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-heading">5.2 min</div>
          <div className="text-[10px] text-emerald-300">↓ 18% vs City Target</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Hospital Wait</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">11 min</div>
          <div className="text-[10px] text-slate-400">LSTM load estimate</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-cyan-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold">
            <span>Available ICU Beds</span>
            <Heart className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-heading">{totalIcuBeds}</div>
          <div className="text-[10px] text-slate-400">Across 4 hospitals</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-purple-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-purple-400 text-xs font-semibold">
            <span>System Health</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-heading">100%</div>
          <div className="text-[10px] text-slate-400">WebSockets & BERT online</div>
        </div>
      </div>

      {/* Admin Sub Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'command_center', label: 'Live Operations Radar & AI Forecast' },
          { id: 'users', label: `User Management (${usersList.length})` },
          { id: 'hospitals', label: `Hospital Network (${hospitals.length})` },
          { id: 'fleet', label: `Ambulance Fleet (${ambulances.length})` },
          { id: 'ai_monitoring', label: 'AI Model Logs & Audit' },
          { id: 'analytics', label: 'Heatmaps & Response Times' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: COMMAND CENTER & AI CAPACITY FORECAST */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          {/* AI 6-HOUR CAPACITY FORECAST CARD (Specification 43) */}
          <div className="p-6 rounded-3xl glass-card border-2 border-cyan-500/50 bg-gradient-to-r from-blue-950/60 via-[#0D1527] to-cyan-950/40 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/30 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-heading">
                    NEXT 6 HOURS HOSPITAL CAPACITY & DEMAND FORECAST
                  </h3>
                  <p className="text-xs text-cyan-400 font-medium">
                    Deep Learning LSTM Sequence Model • Real-time traffic & historical queue telemetry
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono">
                98.6% Accuracy
              </span>
            </div>

            {/* 6 Hour Forecast Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {INITIAL_AI_CAPACITY_FORECAST.map((fc, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border text-center space-y-1.5 ${
                    fc.status === 'CRITICAL_SURGE'
                      ? 'bg-red-950/40 border-red-500/50'
                      : fc.status === 'HIGH_DEMAND'
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">{fc.hour}</span>
                  <div className={`text-xl font-black font-heading ${
                    fc.status === 'CRITICAL_SURGE' ? 'text-red-400' : fc.status === 'HIGH_DEMAND' ? 'text-amber-400' : 'text-cyan-400'
                  }`}>
                    {fc.loadPercent}%
                  </div>
                  <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                    fc.status === 'CRITICAL_SURGE' ? 'bg-red-950 text-red-300' : fc.status === 'HIGH_DEMAND' ? 'bg-amber-950 text-amber-300' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {fc.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Recommendation Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start space-x-2.5 text-xs text-amber-200">
              <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>AI Operational Recommendation:</strong> High emergency demand expected between <strong>20:00–22:00</strong> (surge load peak at 91%). Consider increasing ER trauma physician staffing and reserving 2 ICU bays.
              </div>
            </div>
          </div>

          {/* City Operations Radar Map */}
          <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="text-base font-bold text-white font-heading">
                  Live City Operations & Multi-Ambulance Radar
                </h3>
              </div>
              <span className="text-xs text-slate-400">All units transmitting 5G telemetry</span>
            </div>

            <MapView heightClass="h-[420px]" />
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT (Specification 39) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-slate-950/80 flex items-center justify-between text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by name, email, role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <span className="text-slate-400 text-xs">Total Users: <strong>{usersList.length}</strong></span>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList
                  .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                  .map(user => (
                    <tr key={user.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 flex items-center space-x-3">
                        <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-cyan-500/30" />
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{user.phone}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {user.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleUserActive(user.id)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                            user.isActive ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40' : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HOSPITAL NETWORK (Specification 40) */}
      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map(hosp => (
            <div key={hosp.id} className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base font-heading">{hosp.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{hosp.address}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-400 text-xs font-bold">
                  ★ {hosp.smartScore}/100
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-400 text-sm font-heading">{hosp.icuBedsAvailable}</div>
                  <div className="text-[10px] text-slate-400">ICU Beds</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-emerald-400 text-sm font-heading">{hosp.erBedsAvailable}</div>
                  <div className="text-[10px] text-slate-400">ER Bays</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400 text-sm font-heading">{hosp.currentLoadPercent}%</div>
                  <div className="text-[10px] text-slate-400">Load Factor</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Doctors: <strong>{hosp.doctors.length} Registered</strong></span>
                <span className="text-emerald-400 font-semibold">24/7 Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: FLEET MANAGEMENT (Specification 41) */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ambulances.map(amb => (
            <div key={amb.id} className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm font-heading">{amb.callSign}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{amb.plateNumber}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  {amb.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Driver:</span>
                  <span className="font-semibold text-white">{amb.driverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fuel & Telemetry:</span>
                  <span className="text-emerald-400 font-bold">{amb.fuelPercent}% (Optimal)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Today's Completed Trips:</span>
                  <span className="font-bold text-cyan-400">{amb.todayTripsCount || 4} Runs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: AI MONITORING & AUDIT */}
      {activeTab === 'ai_monitoring' && (
        <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-heading">
                BERT + XGBoost AI Clinical Monitoring & Audit Logs
              </h3>
            </div>
            {activeEmergency && (
              <button
                onClick={() => setOverrideModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Override AI Classification</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60">
                <tr>
                  <th className="p-3">Incident ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Extracted BERT Intent</th>
                  <th className="p-3">AI Severity Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Clinical Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeEmergency && (
                  <tr className="bg-red-950/20 font-medium">
                    <td className="p-3 font-mono font-bold text-white">#{activeEmergency.id}</td>
                    <td className="p-3 text-white">{activeEmergency.patientName}</td>
                    <td className="p-3 text-cyan-300">{activeEmergency.aiAssessment.primaryDiagnosisIntent}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold">
                        {activeEmergency.aiAssessment.severity} ({(activeEmergency.aiAssessment.score * 100).toFixed(0)}%)
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400 font-semibold">{activeEmergency.status}</td>
                    <td className="p-3">
                      {activeEmergency.aiAssessment.clinicalOverride ? (
                        <span className="text-amber-400 text-[10px]">
                          Overridden by {activeEmergency.aiAssessment.clinicalOverride.overriddenBy}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">AI Governed</span>
                      )}
                    </td>
                  </tr>
                )}
                {emergencyHistory.map(hist => (
                  <tr key={hist.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-mono text-slate-400">#{hist.id}</td>
                    <td className="p-3 text-slate-200">{hist.patientName}</td>
                    <td className="p-3 text-slate-400 truncate max-w-[200px]">{hist.aiAssessment.primaryDiagnosisIntent}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                        {hist.aiAssessment.severity} ({(hist.aiAssessment.score * 100).toFixed(0)}%)
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{hist.status}</td>
                    <td className="p-3 text-slate-500 text-[10px]">Completed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: HEATMAPS & ADVANCED ANALYTICS (Specification 42) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Peak Hour Heatmap */}
          <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white font-heading">
                  Peak Hour Emergency Demand Heatmap (24-Hour & 7-Day Matrix)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Emergency SOS frequency distribution indicating surge hours between 20:00 - 22:00.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold">
                Friday & Saturday Peak
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold">
                    <th className="p-2 text-left">Time Block</th>
                    <th className="p-2">Monday</th>
                    <th className="p-2">Tuesday</th>
                    <th className="p-2">Wednesday</th>
                    <th className="p-2">Thursday</th>
                    <th className="p-2">Friday</th>
                    <th className="p-2">Saturday</th>
                    <th className="p-2">Sunday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {peakHourHeatmapData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/30">
                      <td className="p-2 text-left font-bold text-slate-300">{row.hour}</td>
                      {[row.Mon, row.Tue, row.Wed, row.Thu, row.Fri, row.Sat, row.Sun].map((val, dIdx) => {
                        const bgClass = 
                          val >= 18 ? 'bg-red-600/80 text-white font-bold' :
                          val >= 10 ? 'bg-amber-600/60 text-white font-medium' :
                          val >= 5  ? 'bg-blue-600/40 text-cyan-200' :
                                      'bg-slate-900/80 text-slate-400';
                        return (
                          <td key={dIdx} className="p-2">
                            <div className={`py-1 rounded-lg ${bgClass}`}>
                              {val} SOS
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Response Time Breakdown */}
          <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3">
            <h4 className="text-sm font-bold text-white font-heading">
              Dispatch Response Times (Average, Fastest, Slowest)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} unit="m" />
                  <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#3B82F6', borderRadius: '12px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="avgMinutes" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorResp)" name="Avg (min)" />
                  <Area type="monotone" dataKey="fastest" stroke="#10B981" strokeWidth={2} fillOpacity={0} name="Fastest (min)" />
                  <Area type="monotone" dataKey="slowest" stroke="#EF4444" strokeWidth={2} fillOpacity={0} name="Slowest (min)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Override Modal */}
      {overrideModalOpen && activeEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl glass-card border border-amber-500/50 bg-[#0A0F1D] shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 font-bold font-heading text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Override AI Clinical Severity</span>
            </div>

            <p className="text-xs text-slate-300">
              Emergency physicians and trauma administrators may override BERT + XGBoost severity classification with audit justification.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Severity Level</label>
              <select
                value={overrideSeverity}
                onChange={(e) => setOverrideSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none text-xs"
              >
                <option value="CRITICAL">CRITICAL (Direct ICU / Resuscitation Bay)</option>
                <option value="URGENT">URGENT (ER Physician within 15 mins)</option>
                <option value="STABLE">STABLE (Standard Priority Triage)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Clinical Override Justification</label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyOverride}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                Save Clinical Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
