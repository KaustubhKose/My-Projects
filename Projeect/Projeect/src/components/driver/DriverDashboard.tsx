import React, { useState } from 'react';
import { 
  Truck, 
  ShieldAlert, 
  Navigation, 
  MapPin, 
  PhoneCall, 
  Activity, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Radio, 
  Zap, 
  Battery, 
  Gauge, 
  ArrowRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { MapView } from '../common/MapView';

interface DriverDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { 
    activeEmergency, 
    ambulances, 
    hospitals, 
    driverAcceptDispatch, 
    updateEmergencyStatus 
  } = useEmergency();

  const [isOnline, setIsOnline] = useState(true);
  const myAmbulance = ambulances.find(a => a.driverId === currentUser.id) || ambulances[0];
  const assignedHospital = hospitals.find(h => h.id === activeEmergency?.assignedHospitalId) || hospitals[0];

  const hasIncomingDispatch = activeEmergency && activeEmergency.status === 'DISPATCHING';
  const isCurrentlyEnRoute = activeEmergency && activeEmergency.status !== 'DISPATCHING' && activeEmergency.status !== 'COMPLETED';

  return (
    <div className="space-y-6">
      {/* Driver Cockpit Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                {myAmbulance.callSign} Cockpit
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                {myAmbulance.type}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Paramedic: <strong className="text-white">{currentUser.name}</strong> • Unit #{myAmbulance.plateNumber}
            </p>
          </div>
        </div>

        {/* Online / Offline Toggle */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Shift Status:</span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                isOnline 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-red-950 text-red-300 border border-red-500/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              <span>{isOnline ? 'ONLINE & DISPATCHABLE' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* INCOMING DISPATCH POPUP (When DISPATCHING) */}
      {hasIncomingDispatch && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border-2 border-red-500 bg-gradient-to-r from-red-950/90 via-[#0D1527] to-red-950/90 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-red-500/40 pb-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/50 animate-sos-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    NEW DISPATCH REQUEST #{activeEmergency.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/60 text-xs font-bold">
                    {activeEmergency.aiAssessment.severity}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white font-heading mt-1">
                  Patient: {activeEmergency.patientName} • {activeEmergency.location.address || '824 Market St'}
                </h3>
              </div>
            </div>

            {/* Accept Button */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={() => driverAcceptDispatch(currentUser.id, myAmbulance.id)}
                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/40 hover:brightness-110 transition cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>ACCEPT DISPATCH & START SIREN</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Reported Symptoms (BERT NLP):</span>
              <strong className="text-white text-xs">{activeEmergency.symptoms.join(', ')}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Target Hospital:</span>
              <strong className="text-cyan-400 text-xs">{assignedHospital.name}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Distance to Scene:</span>
              <strong className="text-emerald-400 text-xs">~2.1 km (ETA 5 min)</strong>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE EMERGENCY NAVIGATION & CONTROLS HUD */}
      {isCurrentlyEnRoute && (
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/40 bg-slate-950/90 space-y-6 shadow-2xl">
          {/* Header Status Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  ACTIVE MISSION HUD • #{activeEmergency.id}
                </span>
                <h3 className="text-lg font-black text-white font-heading">
                  Current Status: {activeEmergency.status.replace('_', ' ')}
                </h3>
              </div>
            </div>

            {/* Live Speed & Fuel telemetry */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div className="font-bold text-emerald-400 text-sm">{myAmbulance.speedKmh} km/h</div>
                <div className="text-[9px] text-slate-400">Vehicle Speed</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div className="font-bold text-cyan-400 text-sm">{myAmbulance.oxygenLevelPercent}%</div>
                <div className="text-[9px] text-slate-400">Oxygen Tank</div>
              </div>
            </div>
          </div>

          {/* Quick 1-Tap Progression Buttons for Driver */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-heading">
              Update Emergency Journey Stage (1-Tap):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
              <button
                onClick={() => updateEmergencyStatus('PICKUP', 'Ambulance reached patient at scene.')}
                disabled={activeEmergency.status === 'PICKUP' || activeEmergency.status === 'PATIENT_ONBOARD'}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white transition cursor-pointer disabled:opacity-50"
              >
                1. At Scene / Patient Contact
              </button>
              <button
                onClick={() => updateEmergencyStatus('PATIENT_ONBOARD', 'Patient secured in ambulance. Vitals monitor attached.')}
                disabled={activeEmergency.status === 'PATIENT_ONBOARD' || activeEmergency.status === 'HOSPITAL_EN_ROUTE'}
                className="py-3 px-3 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-cyan-500/50 text-cyan-300 transition cursor-pointer disabled:opacity-50"
              >
                2. Patient Onboard
              </button>
              <button
                onClick={() => updateEmergencyStatus('HOSPITAL_EN_ROUTE', 'Speeding towards destination hospital with sirens.')}
                disabled={activeEmergency.status === 'HOSPITAL_EN_ROUTE' || activeEmergency.status === 'ARRIVED'}
                className="py-3 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 transition cursor-pointer disabled:opacity-50"
              >
                3. En Route to Hospital
              </button>
              <button
                onClick={() => updateEmergencyStatus('COMPLETED', 'Patient safely admitted to hospital ER bay. Triage complete.')}
                className="py-3 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 transition cursor-pointer"
              >
                4. Handoff Complete (Close)
              </button>
            </div>
          </div>

          {/* Navigation Map View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Route Simulation & Turn-by-Turn GPS</span>
              </span>
              <span className="text-emerald-400 font-semibold">Destination: {assignedHospital.name}</span>
            </div>
            <MapView heightClass="h-[360px]" focusAmbulanceId={myAmbulance.id} focusHospitalId={assignedHospital.id} />
          </div>

          {/* Telemetry Stream to Hospital */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                <span>Patient Vitals Telemetry (Transmitting to {assignedHospital.name})</span>
              </span>
              <span className="text-[10px] text-emerald-400">Connected 5G Hub</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-black text-red-400 text-sm">{activeEmergency.vitals.heartRate} bpm</div>
                <div className="text-[10px] text-slate-400">Heart Rate</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-black text-cyan-400 text-sm">{activeEmergency.vitals.spO2}%</div>
                <div className="text-[10px] text-slate-400">SpO2 Level</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-black text-white text-sm">{activeEmergency.vitals.bloodPressureSys}/{activeEmergency.vitals.bloodPressureDia}</div>
                <div className="text-[10px] text-slate-400">Blood Pressure</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-black text-amber-400 text-sm">{activeEmergency.vitals.temperature}°F</div>
                <div className="text-[10px] text-slate-400">Temp</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Systems Status Checklist */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4">
        <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>Vehicle Equipment & Telemetry Telematics</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Fuel Tank</span>
              <strong className="text-white text-sm font-heading">{myAmbulance.fuelPercent}%</strong>
            </div>
            <Gauge className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Oxygen Reserves</span>
              <strong className="text-cyan-400 text-sm font-heading">{myAmbulance.oxygenLevelPercent}%</strong>
            </div>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">AED Defibrillator</span>
              <strong className="text-emerald-400 text-sm font-heading">Ready (100%)</strong>
            </div>
            <Battery className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">5G Radio Hub</span>
              <strong className="text-white text-sm font-heading">Active</strong>
            </div>
            <Radio className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">Onboard Life Support Kit:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            {(myAmbulance.equipment || ['12-Lead ECG Monitor', 'Defibrillator', 'Oxygen Ventilator', 'Trauma Kit']).map((eq: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                ✓ {eq}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
