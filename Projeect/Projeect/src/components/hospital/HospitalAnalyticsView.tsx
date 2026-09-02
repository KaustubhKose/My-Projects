import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  BedDouble, 
  Users, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

export const HospitalAnalyticsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { hospitals } = useEmergency();
  const currentHospital = hospitals.find(h => h.id === (currentUser.hospitalId || 'hosp-1')) || hospitals[0];

  const hourlyLoadData = [
    { hour: '00:00', admissions: 3, load: 45 },
    { hour: '04:00', admissions: 2, load: 38 },
    { hour: '08:00', admissions: 9, load: 72 },
    { hour: '12:00', admissions: 14, load: 88 },
    { hour: '16:00', admissions: 11, load: 79 },
    { hour: '20:00', admissions: 16, load: 92 },
    { hour: '23:00', admissions: 6, load: 58 }
  ];

  const departmentCases = [
    { department: 'Cardiology', cases: 42, color: '#EF4444' },
    { department: 'Trauma & Ortho', cases: 35, color: '#3B82F6' },
    { department: 'Neurology (Stroke)', cases: 28, color: '#06B6D4' },
    { department: 'Pulmonology', cases: 19, color: '#10B981' },
    { department: 'Pediatric ER', cases: 14, color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span>Emergency Operations & LSTM Load Analytics</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {currentHospital.name} • Deep learning hospital triage forecast and bed velocity telemetry.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-1">
          <div className="text-slate-400 text-xs">Today's ER Admissions</div>
          <div className="text-2xl font-black text-white font-heading">68 Cases</div>
          <div className="text-[10px] text-emerald-400">↑ 12% vs Yesterday</div>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-cyan-500/30 bg-slate-950/80 space-y-1">
          <div className="text-cyan-400 text-xs font-semibold">Predicted Wait Time</div>
          <div className="text-2xl font-black text-cyan-400 font-heading">{currentHospital.estimatedWaitMinutes} min</div>
          <div className="text-[10px] text-slate-400">LSTM Forecast Model</div>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-emerald-500/30 bg-slate-950/80 space-y-1">
          <div className="text-emerald-400 text-xs font-semibold">ER Bed Turnover</div>
          <div className="text-2xl font-black text-emerald-400 font-heading">1.8 hrs</div>
          <div className="text-[10px] text-slate-400">Average length of stay</div>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-purple-500/30 bg-slate-950/80 space-y-1">
          <div className="text-purple-400 text-xs font-semibold">Triage Accuracy</div>
          <div className="text-2xl font-black text-purple-300 font-heading">99.1%</div>
          <div className="text-[10px] text-slate-400">Pre-alert bed match</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Admissions Load */}
        <div className="p-5 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
            Hourly ER Patient Surge & Capacity Load (%)
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#3B82F6', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="load" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" name="Hospital Load %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Volumes by Specialty */}
        <div className="p-5 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
            Emergency Cases by Clinical Specialty (Month-to-Date)
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentCases} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="department" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0D1527', borderColor: '#3B82F6', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="cases" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Cases Admitted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
