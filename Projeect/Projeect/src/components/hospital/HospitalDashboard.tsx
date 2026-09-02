import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  BedDouble, 
  Users, 
  Activity, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  Heart, 
  AlertTriangle, 
  Pill, 
  Calendar, 
  Droplet, 
  DoorOpen, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { PreAlertModal } from './PreAlertModal';
import { BedStatus } from '../../types';

interface HospitalDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { 
    activeEmergency, 
    hospitals, 
    toggleBedStatus, 
    ambulances,
    medicines,
    appointments,
    hospitalTogglePreparationAction,
    updateEmergencyStatus
  } = useEmergency();

  const currentHospital = hospitals.find(h => h.id === (currentUser.hospitalId || 'hosp-1')) || hospitals[0];
  const [showPreAlertModal, setShowPreAlertModal] = useState(false);

  const assignedAmbulance = ambulances.find(a => a.id === activeEmergency?.assignedAmbulanceId);
  const lowStockCount = medicines.filter(m => m.quantity <= m.minQuantity).length;
  const onDutyDoctorsCount = currentHospital.doctors.filter(d => d.status === 'ON_DUTY').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                {currentHospital.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                Level 1 Trauma Command
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Emergency Response, Resuscitation Bays & Digital Pharmacy Operations
            </p>
          </div>
        </div>

        {/* Load & Wait Time */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="font-bold text-white font-heading">{currentHospital.currentLoadPercent}%</div>
            <div className="text-[10px] text-slate-400">ER Load Factor</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-center">
            <div className="font-bold text-cyan-400 font-heading">{currentHospital.estimatedWaitMinutes} min</div>
            <div className="text-[10px] text-slate-400">LSTM Wait Time</div>
          </div>
        </div>
      </div>

      {/* 8 LIVE CARDS WITH ANIMATED COUNTERS (Specification 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Beds</span>
            <BedDouble className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{currentHospital.totalBeds}</div>
          <div className="text-[10px] text-slate-400">{currentHospital.availableBeds} Available</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-emerald-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
            <span>Available Beds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-heading">{currentHospital.availableBeds}</div>
          <div className="text-[10px] text-slate-400">All wards combined</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-cyan-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold">
            <span>ICU Beds</span>
            <Heart className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-heading">{currentHospital.icuBedsAvailable}</div>
          <div className="text-[10px] text-slate-400">Critical Care slots</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-red-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-red-400 text-xs font-semibold">
            <span>ER Trauma Beds</span>
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-heading">{currentHospital.erBedsAvailable}</div>
          <div className="text-[10px] text-slate-400">Instant triage ready</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Today's Appts</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{appointments.length}</div>
          <div className="text-[10px] text-slate-400">Scheduled consultations</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-red-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-red-400 text-xs font-semibold">
            <span>Emergency Patients</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-heading">{activeEmergency ? 1 : 0}</div>
          <div className="text-[10px] text-slate-400">{activeEmergency ? 'Critical Pre-Alert' : 'Queue Empty'}</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-purple-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-purple-400 text-xs font-semibold">
            <span>Doctors On Duty</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-heading">{onDutyDoctorsCount}</div>
          <div className="text-[10px] text-slate-400">Cardiology, Trauma, Neuro</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-amber-500/30 bg-slate-950/80 space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
            <span>Low Stock Meds</span>
            <Pill className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-heading">{lowStockCount}</div>
          <div className="text-[10px] text-slate-400">{lowStockCount > 0 ? 'Restock required' : 'Inventory optimal'}</div>
        </div>
      </div>

      {/* INCOMING EMERGENCY PRIORITY QUEUE (Specifications 24 & 25) */}
      {activeEmergency ? (
        <div className="p-6 rounded-3xl glass-card border-2 border-red-500/80 bg-gradient-to-r from-red-950/80 via-[#0D1527] to-red-950/80 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-red-500/40 pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/50 animate-sos-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    PRIORITY 1: INCOMING CRITICAL PATIENT
                  </span>
                  <span className="text-xs text-red-200 font-mono font-bold">#{activeEmergency.id}</span>
                </div>
                <h3 className="text-lg font-black text-white font-heading mt-0.5">
                  Patient: {activeEmergency.patientName} (Age {activeEmergency.patientAge}, Blood Group: {activeEmergency.patientBloodGroup || 'O+'})
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-black text-white font-heading">
                  ETA: ~{activeEmergency.etaMinutes || 5} MIN
                </div>
                <div className="text-[11px] text-cyan-400 font-mono">
                  {assignedAmbulance?.callSign || 'Rescue Alpha-1'} ({assignedAmbulance?.plateNumber})
                </div>
              </div>
              <button
                onClick={() => setShowPreAlertModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white font-bold text-xs shadow-xl shadow-red-600/30 hover:brightness-110 transition cursor-pointer flex items-center space-x-2"
              >
                <span>Full Pre-Alert Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vitals Telemetry & AI Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BERT Diagnosis Intent</span>
              </div>
              <p className="text-white font-bold">{activeEmergency.aiAssessment.primaryDiagnosisIntent}</p>
              <p className="text-[11px] text-slate-400 truncate">{activeEmergency.symptoms.join(', ')}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                <Heart className="w-3.5 h-3.5 animate-pulse" />
                <span>Live 12-Lead Vitals Telemetry</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="p-1 rounded bg-slate-950 border border-slate-800 font-bold text-red-400">
                  {activeEmergency.vitals.heartRate} bpm <span className="text-[9px] text-slate-400 block font-normal">HR</span>
                </div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800 font-bold text-cyan-400">
                  {activeEmergency.vitals.spO2}% <span className="text-[9px] text-slate-400 block font-normal">SpO2</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Recommended Clinical Action</span>
              <p className="text-cyan-300 text-xs">
                {activeEmergency.aiAssessment.icuPreAlertRequired ? 'Reserve ICU Bed 101 + Code STEMI Team' : 'Trauma Bay 1 Allocation'}
              </p>
            </div>
          </div>

          {/* HOSPITAL PREPARATION ACTION CHECKLIST BUTTONS (Specification 24) */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-heading">
              Hospital Team Action Protocol (1-Click Preparation):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-bold">
              <button
                onClick={() => hospitalTogglePreparationAction('roomReady')}
                className={`py-2.5 px-2 rounded-xl border transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeEmergency.preparationSteps?.roomReady
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>PREPARE ROOM</span>
              </button>

              <button
                onClick={() => hospitalTogglePreparationAction('doctorNotified')}
                className={`py-2.5 px-2 rounded-xl border transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeEmergency.preparationSteps?.doctorNotified
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>NOTIFY DOCTOR</span>
              </button>

              <button
                onClick={() => hospitalTogglePreparationAction('medicinePrepped')}
                className={`py-2.5 px-2 rounded-xl border transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeEmergency.preparationSteps?.medicinePrepped
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                <span>PREPARE MEDS</span>
              </button>

              <button
                onClick={() => hospitalTogglePreparationAction('bloodPrepped')}
                className={`py-2.5 px-2 rounded-xl border transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeEmergency.preparationSteps?.bloodPrepped
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>PREPARE BLOOD</span>
              </button>

              <button
                onClick={() => hospitalTogglePreparationAction('bedAllocated')}
                className={`py-2.5 px-2 rounded-xl border transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeEmergency.preparationSteps?.bedAllocated
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>ICU BED READY</span>
              </button>

              <button
                onClick={() => updateEmergencyStatus('ARRIVED', 'Hospital triage confirmed ambulance arrival at bay.')}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white border border-emerald-400 shadow-md transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MARK READY</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/60 text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 text-xs font-bold font-heading">
            <CheckCircle2 className="w-4 h-4" />
            <span>EMERGENCY QUEUE CLEAR & SIRENS STANDING BY</span>
          </div>
          <p className="text-xs text-slate-400">
            No active emergency pre-alerts. Ready to receive high-priority ambulance dispatches.
          </p>
        </div>
      )}

      {/* BED STATUS MATRIX WITH 7 CATEGORIES & 5 STATUSES */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-slate-950/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <BedDouble className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Bed Occupancy & Category Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any bed status to toggle (`AVAILABLE` ➔ `OCCUPIED` ➔ `RESERVED` ➔ `CLEANING` ➔ `MAINTENANCE`). Syncs instantly to patient hospital ranking.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('beds')}
            className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>Full Bed Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentHospital.beds.map(bed => {
            const nextStatusMap: Record<BedStatus, BedStatus> = {
              AVAILABLE: 'OCCUPIED',
              OCCUPIED: 'RESERVED',
              RESERVED: 'CLEANING',
              CLEANING: 'MAINTENANCE',
              MAINTENANCE: 'AVAILABLE'
            };

            return (
              <div
                key={bed.id}
                onClick={() => toggleBedStatus(currentHospital.id, bed.id, nextStatusMap[bed.status])}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  bed.status === 'AVAILABLE'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/40'
                    : bed.status === 'RESERVED'
                    ? 'bg-blue-950/40 border-cyan-400 text-cyan-200 hover:bg-blue-900/50'
                    : bed.status === 'CLEANING'
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200 hover:bg-purple-900/40'
                    : bed.status === 'MAINTENANCE'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 hover:bg-amber-900/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-xs">{bed.number}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    bed.status === 'AVAILABLE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : bed.status === 'RESERVED'
                      ? 'bg-blue-950 text-cyan-300 border border-cyan-400'
                      : bed.status === 'CLEANING'
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                      : bed.status === 'MAINTENANCE'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {bed.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  <div>Category: <strong className="text-white">{bed.type}</strong></div>
                  <div>Floor: {bed.floor}</div>
                  {bed.assignedPatientName && <div className="text-cyan-300">Pt: {bed.assignedPatientName}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Alert Modal */}
      <PreAlertModal
        emergency={activeEmergency}
        hospital={currentHospital}
        isOpen={showPreAlertModal}
        onClose={() => setShowPreAlertModal(false)}
      />
    </div>
  );
};
