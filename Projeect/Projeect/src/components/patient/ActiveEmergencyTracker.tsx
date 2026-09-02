import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Heart, 
  AlertTriangle, 
  User, 
  Sparkles,
  ArrowRight,
  Radio,
  FileText
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { MapView } from '../common/MapView';

export const ActiveEmergencyTracker: React.FC = () => {
  const { 
    activeEmergency, 
    hospitals, 
    ambulances, 
    cancelActiveEmergency 
  } = useEmergency();

  if (!activeEmergency) {
    return (
      <div className="p-8 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/60 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-heading">No Active Emergency</h3>
        <p className="text-xs text-slate-400">
          Your emergency dispatch network is standing by 24/7. In an emergency, trigger the One-Tap SOS on your dashboard.
        </p>
      </div>
    );
  }

  const assignedHospital = hospitals.find(h => h.id === activeEmergency.assignedHospitalId) || hospitals[0];
  const assignedAmbulance = ambulances.find(a => a.id === activeEmergency.assignedAmbulanceId) || ambulances[0];

  // 7-Stage Emergency Progression Steps
  const stages = [
    { key: 'REQUESTED', label: 'SOS Triggered' },
    { key: 'DISPATCHING', label: 'AI Triage & Match' },
    { key: 'EN_ROUTE', label: 'Driver En Route' },
    { key: 'PICKUP', label: 'At Patient Location' },
    { key: 'PATIENT_ONBOARD', label: 'Patient Onboard' },
    { key: 'HOSPITAL_EN_ROUTE', label: 'Hospital En Route' },
    { key: 'ARRIVED', label: 'ER Bay Arrival' },
    { key: 'COMPLETED', label: 'Handoff Complete' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === activeEmergency.status);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 2;

  // Format Dynamic ETA
  const etaSec = activeEmergency.etaSecondsRemaining || (activeEmergency.etaMinutes ? activeEmergency.etaMinutes * 60 : 360);
  const minutes = Math.floor(etaSec / 60);
  const seconds = etaSec % 60;
  const formattedEta = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Live Emergency Alert Banner */}
      <div className="p-6 rounded-3xl glass-card border-2 border-red-500/80 bg-gradient-to-r from-red-950/90 via-[#0D1527] to-red-950/90 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/50 animate-sos-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                  ACTIVE CRITICAL EMERGENCY
                </span>
                <span className="text-xs text-red-300 font-mono font-bold">#{activeEmergency.id}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-heading mt-0.5">
                {activeEmergency.aiAssessment.primaryDiagnosisIntent || 'Acute Cardiovascular Distress'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-slate-300">Live Paramedic ETA:</div>
              <div className="text-xl font-black text-cyan-300 font-mono">
                {formattedEta} MIN
              </div>
            </div>
            <button
              onClick={() => cancelActiveEmergency('Patient reported resolved / false trigger')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-red-950 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-red-200 text-xs font-semibold transition"
            >
              Cancel SOS
            </button>
          </div>
        </div>

        {/* 7-Stage Progression Stepper */}
        <div className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {stages.map((stage, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={stage.key}
                  className={`p-2.5 rounded-xl border text-center text-[10px] font-bold transition flex flex-col items-center justify-between space-y-1 ${
                    isCurrent
                      ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-500/30 animate-pulse'
                      : isPast
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900/80 text-slate-500 border-slate-800'
                  }`}
                >
                  <span className="text-[9px] font-mono">{idx + 1}</span>
                  <span className="leading-tight">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live HUD Radar Map */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-slate-950/80 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold text-white font-heading">
              Live Ambulance Vector GPS (3-Second Stream)
            </span>
          </div>
          <span className="text-slate-400 font-mono">
            Speed: <strong className="text-cyan-300">{assignedAmbulance.speedKmh || 54} km/h</strong> • Fuel: <strong className="text-emerald-400">{assignedAmbulance.fuelPercent || 92}%</strong>
          </span>
        </div>
        <MapView heightClass="h-80" />
      </div>

      {/* Assigned Paramedic Unit & Destination Hospital */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paramedic Cockpit Contact */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-heading">{assignedAmbulance.callSign}</h4>
                <p className="text-xs text-cyan-400 font-mono">{assignedAmbulance.plateNumber} ({assignedAmbulance.type})</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              ● {assignedAmbulance.status}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Attending Paramedic:</span>
              <strong className="text-white">{assignedAmbulance.driverName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Direct Contact:</span>
              <span className="font-mono text-cyan-300">{assignedAmbulance.driverPhone || '+91 97110 44556'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Oxygen Buffer:</span>
              <span className="text-emerald-400 font-bold">{assignedAmbulance.oxygenLevelPercent || 98}% (Medical Grade)</span>
            </div>
          </div>

          <a
            href={`tel:${assignedAmbulance.driverPhone || '+919711044556'}`}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Paramedic Rajesh</span>
          </a>
        </div>

        {/* Destination Hospital Pre-Alert */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-blue-950 border border-blue-500/40 text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-heading">{assignedHospital.name}</h4>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{assignedHospital.address}</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
              ★ {assignedHospital.smartScore}/100 Match
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-cyan-400 text-sm font-heading">{assignedHospital.icuBedsAvailable}</div>
              <div className="text-[9px] text-slate-400">ICU Beds</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-emerald-400 text-sm font-heading">{assignedHospital.erBedsAvailable}</div>
              <div className="text-[9px] text-slate-400">ER Bays</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-white text-sm font-heading">{assignedHospital.estimatedWaitMinutes}m</div>
              <div className="text-[9px] text-slate-400">Wait Time</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
            <span>Hospital ER Pre-Alert:</span>
            <strong className="font-bold">Resuscitation Bay 1 Reserved</strong>
          </div>
        </div>
      </div>

      {/* Real-time Incident Audit Log */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3 shadow-xl">
        <h4 className="text-sm font-bold text-white font-heading flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Incident Telemetry & Audit Timeline</span>
        </h4>
        <div className="space-y-2">
          {activeEmergency.timeline.map((event, idx) => (
            <div key={idx} className="flex items-start space-x-3 text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono text-[10px] shrink-0">
                {event.timestamp}
              </span>
              <div className="flex-1 text-slate-300">
                <strong className="text-white">{event.status.replace(/_/g, ' ')}:</strong> {event.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
