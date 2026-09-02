import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Building2, 
  Truck, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Compass,
  Zap,
  Clock,
  BedDouble
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Hospital, AmbulanceVehicle } from '../../types';

interface MapViewProps {
  heightClass?: string;
  focusAmbulanceId?: string;
  focusHospitalId?: string;
  showAllHospitals?: boolean;
  showAllAmbulances?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  heightClass = 'h-[440px]',
  focusAmbulanceId,
  focusHospitalId,
  showAllHospitals = true,
  showAllAmbulances = true
}) => {
  const { activeEmergency, hospitals, ambulances } = useEmergency();
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'hospital' | 'ambulance' | 'patient'; data: Hospital | AmbulanceVehicle | null } | null>(null);
  const [isTrafficLayer, setIsTrafficLayer] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto select active emergency ambulance or hospital
  useEffect(() => {
    if (activeEmergency) {
      if (focusAmbulanceId) {
        const amb = ambulances.find(a => a.id === focusAmbulanceId);
        if (amb) setSelectedEntity({ type: 'ambulance', data: amb });
      } else if (focusHospitalId) {
        const hosp = hospitals.find(h => h.id === focusHospitalId);
        if (hosp) setSelectedEntity({ type: 'hospital', data: hosp });
      }
    }
  }, [activeEmergency, focusAmbulanceId, focusHospitalId, ambulances, hospitals]);

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : `${heightClass} rounded-2xl`} overflow-hidden border border-blue-500/30 glass-card bg-[#080D1A] shadow-2xl transition-all`}>
      {/* Simulation Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Simulated Road Network Lines (Vector Streets) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-blue-500/20">
        <path d="M 50 120 Q 200 180 350 130 T 700 160 T 1100 200" fill="none" strokeWidth="2" strokeDasharray="4 4" className="stroke-cyan-500/20" />
        <path d="M 100 380 Q 300 320 600 360 T 950 300 T 1200 400" fill="none" strokeWidth="3" strokeDasharray="6 6" className="stroke-blue-500/30" />
        <path d="M 280 40 L 280 450" fill="none" strokeWidth="2" strokeDasharray="2 2" className="stroke-slate-700/40" />
        <path d="M 680 20 L 680 460" fill="none" strokeWidth="2" strokeDasharray="2 2" className="stroke-slate-700/40" />
        <path d="M 450 80 L 450 420" fill="none" strokeWidth="1.5" strokeDasharray="2 2" className="stroke-slate-700/40" />

        {/* Live Route Polyline if Active Emergency */}
        {activeEmergency && (
          <g>
            <path
              d="M 280 220 Q 420 180 620 230"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="4"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            />
            <path
              d="M 280 220 Q 420 180 620 230"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="8 8"
              className="animate-[dash_1s_linear_infinite]"
            />
          </g>
        )}
      </svg>

      {/* Map Control Bar Top */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 shadow-lg text-xs font-semibold text-white flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>METRO GPS DISPATCH RADAR</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          {isTrafficLayer && (
            <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-300">
              <Zap className="w-3 h-3" />
              <span>Traffic AI: Low Delay</span>
            </div>
          )}
        </div>

        {/* Map Actions */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setIsTrafficLayer(!isTrafficLayer)}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs transition ${
              isTrafficLayer ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/80 border-slate-800 text-slate-400'
            }`}
            title="Toggle Live Traffic Overlay"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.min(18, prev + 1))}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(10, prev - 1))}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            -
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Interactive Nodes Container */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
        {/* Node 1: Hospital 1 (Metro AMC - Top Right) */}
        {showAllHospitals && hospitals[0] && (
          <div 
            className="absolute top-16 right-16 cursor-pointer group transform transition hover:scale-105"
            onClick={() => setSelectedEntity({ type: 'hospital', data: hospitals[0] })}
          >
            <div className="relative flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-lg bg-blue-950/90 border border-cyan-400/50 shadow-xl backdrop-blur-md text-[11px] font-bold text-white flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Metro AMC</span>
                <span className="px-1 py-0.2 rounded bg-cyan-900/60 text-cyan-300 text-[9px] font-semibold">
                  {hospitals[0].icuBedsAvailable} ICU
                </span>
              </div>
              <div className="w-3 h-3 bg-blue-600 border-2 border-cyan-400 rotate-45 mt-1 shadow-lg shadow-cyan-500/50" />
            </div>
          </div>
        )}

        {/* Node 2: Hospital 2 (St. Jude - Top Left) */}
        {showAllHospitals && hospitals[1] && (
          <div 
            className="absolute top-20 left-16 cursor-pointer group transform transition hover:scale-105"
            onClick={() => setSelectedEntity({ type: 'hospital', data: hospitals[1] })}
          >
            <div className="relative flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-blue-500/40 shadow-xl backdrop-blur-md text-[11px] font-medium text-slate-200 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>St. Jude Hospital</span>
                <span className="px-1 py-0.2 rounded bg-blue-950 text-blue-300 text-[9px]">
                  {hospitals[1].icuBedsAvailable} ICU
                </span>
              </div>
              <div className="w-3 h-3 bg-blue-800 border-2 border-blue-400 rotate-45 mt-1" />
            </div>
          </div>
        )}

        {/* Node 3: Hospital 3 (Apex Trauma - Bottom Right) */}
        {showAllHospitals && hospitals[2] && (
          <div 
            className="absolute bottom-20 right-28 cursor-pointer group transform transition hover:scale-105"
            onClick={() => setSelectedEntity({ type: 'hospital', data: hospitals[2] })}
          >
            <div className="relative flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 shadow-xl backdrop-blur-md text-[11px] font-medium text-slate-200 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Apex Trauma</span>
                <span className="px-1 py-0.2 rounded bg-purple-950 text-purple-300 text-[9px]">
                  {hospitals[2].erBedsAvailable} ER
                </span>
              </div>
              <div className="w-3 h-3 bg-purple-800 border-2 border-purple-400 rotate-45 mt-1" />
            </div>
          </div>
        )}

        {/* Node 4: Active Emergency Patient Location (Center-Left) */}
        {activeEmergency ? (
          <div 
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
            onClick={() => setSelectedEntity({ type: 'patient', data: null })}
          >
            <div className="relative flex flex-col items-center">
              {/* Radar Pulsing Rings */}
              <div className="absolute -inset-6 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute -inset-3 rounded-full bg-red-500/40 animate-pulse" />

              <div className="relative px-3 py-1.5 rounded-xl bg-red-950 border border-red-500/80 shadow-2xl backdrop-blur-md text-xs font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
                <span>PATIENT SOS: {activeEmergency.patientName}</span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px]">
                  {activeEmergency.aiAssessment.severity}
                </span>
              </div>
              <div className="w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full mt-1.5 shadow-lg shadow-red-500/80" />
            </div>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-70">
            <div className="p-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Your Location (824 Market St)</span>
          </div>
        )}

        {/* Node 5: Dispatched / Available Ambulance 1 */}
        {showAllAmbulances && ambulances[0] && (
          <div 
            className={`absolute transition-all duration-1000 ease-out cursor-pointer z-30 group ${
              activeEmergency?.status === 'EN_ROUTE' 
                ? 'top-[44%] left-[42%]' 
                : activeEmergency?.status === 'HOSPITAL_EN_ROUTE'
                ? 'top-[28%] right-[24%]'
                : 'bottom-24 left-1/4'
            }`}
            onClick={() => setSelectedEntity({ type: 'ambulance', data: ambulances[0] })}
          >
            <div className="relative flex flex-col items-center">
              {ambulances[0].status !== 'AVAILABLE' && (
                <div className="absolute -inset-4 rounded-full bg-cyan-400/20 animate-ping" />
              )}
              <div className="px-2.5 py-1 rounded-xl bg-slate-950/90 border border-cyan-400 shadow-2xl backdrop-blur-md text-[11px] font-bold text-white flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{ambulances[0].callSign}</span>
                <span className="px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[9px]">
                  {ambulances[0].status}
                </span>
              </div>
              <div className="w-3 h-3 bg-cyan-500 border-2 border-white rounded-full mt-1 shadow-lg shadow-cyan-400/80" />
            </div>
          </div>
        )}
      </div>

      {/* Selected Entity Detailed Popover Bottom Left */}
      {selectedEntity && (
        <div className="absolute bottom-3 left-3 z-30 max-w-sm w-full p-3.5 rounded-xl glass-card border border-cyan-500/40 bg-slate-950/95 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {selectedEntity.type === 'hospital' && <Building2 className="w-4 h-4 text-cyan-400" />}
              {selectedEntity.type === 'ambulance' && <Truck className="w-4 h-4 text-cyan-400" />}
              {selectedEntity.type === 'patient' && <ShieldAlert className="w-4 h-4 text-red-400" />}
              <h4 className="text-xs font-bold text-white font-heading">
                {selectedEntity.type === 'hospital' && (selectedEntity.data as Hospital).name}
                {selectedEntity.type === 'ambulance' && (selectedEntity.data as AmbulanceVehicle).callSign}
                {selectedEntity.type === 'patient' && `Active Incident #${activeEmergency?.id}`}
              </h4>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>

          {selectedEntity.type === 'hospital' && (
            <div className="mt-2 text-xs space-y-1 text-slate-300">
              <p className="text-[11px] text-slate-400">{(selectedEntity.data as Hospital).address}</p>
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                <div className="p-1 rounded bg-slate-900 border border-slate-800">
                  <div className="text-cyan-400 font-bold">{(selectedEntity.data as Hospital).icuBedsAvailable}</div>
                  <div className="text-[9px] text-slate-400">ICU Beds</div>
                </div>
                <div className="p-1 rounded bg-slate-900 border border-slate-800">
                  <div className="text-emerald-400 font-bold">{(selectedEntity.data as Hospital).erBedsAvailable}</div>
                  <div className="text-[9px] text-slate-400">ER Bays</div>
                </div>
                <div className="p-1 rounded bg-slate-900 border border-slate-800">
                  <div className="text-white font-bold">{(selectedEntity.data as Hospital).estimatedWaitMinutes}m</div>
                  <div className="text-[9px] text-slate-400">LSTM Wait</div>
                </div>
              </div>
              <div className="text-[10px] text-cyan-300 pt-1">
                ⭐ Smart Score: <strong>{(selectedEntity.data as Hospital).smartScore}/100</strong>
              </div>
            </div>
          )}

          {selectedEntity.type === 'ambulance' && (
            <div className="mt-2 text-xs space-y-1 text-slate-300">
              <div className="flex items-center justify-between text-[11px]">
                <span>Driver: {(selectedEntity.data as AmbulanceVehicle).driverName}</span>
                <span className="text-emerald-400 font-medium">Speed: {(selectedEntity.data as AmbulanceVehicle).speedKmh} km/h</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Type: {(selectedEntity.data as AmbulanceVehicle).type}</span>
                <span>Fuel: {(selectedEntity.data as AmbulanceVehicle).fuelPercent}%</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Equipment: {((selectedEntity.data as AmbulanceVehicle).equipment || ['12-Lead ECG', 'Defibrillator', 'Ventilator']).slice(0, 3).join(', ')}...
              </div>
            </div>
          )}

          {selectedEntity.type === 'patient' && activeEmergency && (
            <div className="mt-2 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Symptoms: {activeEmergency.symptoms.join(', ')}</span>
                <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold">
                  {activeEmergency.aiAssessment.severity}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                <div className="p-1 rounded bg-slate-900">HR: <strong className="text-white">{activeEmergency.vitals.heartRate}</strong></div>
                <div className="p-1 rounded bg-slate-900">SpO2: <strong className="text-cyan-400">{activeEmergency.vitals.spO2}%</strong></div>
                <div className="p-1 rounded bg-slate-900">BP: <strong className="text-white">{activeEmergency.vitals.bloodPressureSys}/{activeEmergency.vitals.bloodPressureDia}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
