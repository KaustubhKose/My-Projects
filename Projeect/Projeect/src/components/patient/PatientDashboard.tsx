import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Heart, 
  Activity, 
  Calendar, 
  Building2, 
  FileText, 
  ArrowRight, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  User, 
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { SosModal } from './SosModal';
import { ActiveEmergencyTracker } from './ActiveEmergencyTracker';

interface PatientDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { activeEmergency, hospitals, appointments, medicalRecords } = useEmergency();
  const [showSosModal, setShowSosModal] = useState(false);
  const [selectedQuickSymptom, setSelectedQuickSymptom] = useState<string | undefined>(undefined);

  const topHospital = hospitals[0];
  const nextAppointment = appointments[0];

  const handleQuickSos = (symptomName?: string) => {
    setSelectedQuickSymptom(symptomName);
    setShowSosModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Active Emergency Banner if running */}
      {activeEmergency && (
        <div className="p-4 sm:p-5 rounded-3xl glass-card border border-red-500/60 bg-gradient-to-r from-red-950/80 via-[#0D1527] to-red-950/80 shadow-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white animate-bounce shadow-lg shadow-red-600/50">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-300 uppercase tracking-wider">Active Incident Underway</div>
              <h3 className="text-base font-extrabold text-white font-heading">
                Status: {activeEmergency.status.replace('_', ' ')} • Severity: {activeEmergency.aiAssessment.severity}
              </h3>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('emergency')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-red-600/30"
          >
            Open Live HUD →
          </button>
        </div>
      )}

      {/* Welcome Banner + Quick Health Summary */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-cyan-950/30 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI-CONNECTED HEALTH PROFILE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Your vitals are streaming from connected wearables. Emergency SOS is armed and synchronized with Metro City EMS.
            </p>

            {/* Quick Vitals Capsule Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Resting Heart Rate</span>
                <span className="text-base font-black text-white font-heading">72 bpm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                <span className="text-base font-black text-white font-heading">118/78</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Blood Group</span>
                <span className="text-base font-black text-cyan-400 font-heading">{currentUser.bloodGroup || 'O+'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SpO2 Oxygen</span>
                <span className="text-base font-black text-emerald-400 font-heading">99%</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact Quick Widget */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-xs space-y-2 shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Primary Emergency Contact</div>
            <div className="font-bold text-white text-sm">{currentUser.emergencyContact || 'Sarah Mercer (+1 555 987-6543)'}</div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SMS Auto-Alert Configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* GIANT ONE-TAP SOS EMERGENCY SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border-2 border-red-500/60 bg-gradient-to-b from-red-950/40 via-[#0D1527] to-slate-950 shadow-2xl relative overflow-hidden">
        {/* Glow Radar Effect */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>ONE-TAP EMERGENCY RESPONSE PROTOCOL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Need Urgent Medical Help?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Press the SOS button below to initiate a <strong className="text-white">10-second safety countdown</strong>, verify with OTP, execute AI severity assessment, and dispatch the closest Advanced Life Support ambulance.
            </p>

            {/* Fast Symptom Quick Selectors */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Or trigger with direct acute symptom:
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {['Severe Chest Pain', 'Difficulty Breathing', 'Unconscious / Stroke', 'Accident / Severe Bleeding'].map((sym, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSos(sym)}
                    className="px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>⚡ {sym}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Glowing SOS Button */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <button
              onClick={() => handleQuickSos()}
              className="relative group w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-rose-700 p-2 shadow-2xl shadow-red-600/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-sos-pulse flex flex-col items-center justify-center border-4 border-white/30"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-t from-red-800 to-red-600 flex flex-col items-center justify-center text-white space-y-1 shadow-inner">
                <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-md group-hover:rotate-12 transition duration-300" />
                <span className="text-2xl sm:text-3xl font-black tracking-wider font-heading drop-shadow-lg">
                  SOS
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-red-100">
                  EMERGENCY
                </span>
              </div>
            </button>
            <span className="text-[11px] text-slate-400 mt-3 font-medium">10s Safety Timer + OTP Protected</span>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Top Ranked Hospital & Upcoming Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recommended Hospital Card */}
        {topHospital && (
          <div className="p-6 rounded-3xl glass-card border border-cyan-500/30 bg-slate-950/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-heading">Top Recommended Hospital</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 text-xs font-black">
                  ★ {topHospital.smartScore}/100 Match
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{topHospital.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{topHospital.address}</p>

              {/* Recommendation reason */}
              <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200">
                {topHospital.recommendedReason}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-400">{topHospital.icuBedsAvailable} Slots</div>
                  <div className="text-[10px] text-slate-400">ICU Capacity</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-emerald-400">{topHospital.erBedsAvailable} Bays</div>
                  <div className="text-[10px] text-slate-400">ER Beds</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white">{topHospital.estimatedWaitMinutes} min</div>
                  <div className="text-[10px] text-slate-400">LSTM Wait</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={() => onNavigateTab('hospitals')}
                className="text-xs text-cyan-400 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Browse all nearby hospitals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={`tel:${topHospital.contactNumber}`}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Upcoming Appointment & Health Summary */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-slate-950/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white font-heading">Upcoming Appointment</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                {nextAppointment ? nextAppointment.status : 'None'}
              </span>
            </div>

            {nextAppointment ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{nextAppointment.doctorName}</span>
                    <span className="text-cyan-400 text-xs font-semibold">{nextAppointment.department}</span>
                  </div>
                  <p className="text-xs text-slate-400">{nextAppointment.hospitalName}</p>
                  <div className="text-xs text-slate-300 flex items-center space-x-2 pt-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{nextAppointment.dateTime}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Reason: <strong className="text-slate-200">{nextAppointment.reason}</strong>
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No upcoming consultations scheduled
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>Manage Appointments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('records')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              View Past Records ({medicalRecords.length})
            </button>
          </div>
        </div>
      </div>

      {/* SOS Emergency Modal Flow */}
      <SosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        initialSymptom={selectedQuickSymptom}
      />
    </div>
  );
};
