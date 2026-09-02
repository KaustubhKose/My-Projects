import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  BedDouble, 
  UserCheck, 
  Pill, 
  Sparkles, 
  Clock, 
  Heart, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { EmergencyEvent, Hospital } from '../../types';
import { useEmergency } from '../../context/EmergencyContext';

interface PreAlertModalProps {
  emergency: EmergencyEvent | null;
  hospital: Hospital;
  isOpen: boolean;
  onClose: () => void;
}

export const PreAlertModal: React.FC<PreAlertModalProps> = ({
  emergency,
  hospital,
  isOpen,
  onClose
}) => {
  const { hospitalAcknowledgePreAlert } = useEmergency();

  const [selectedBed, setSelectedBed] = useState('b-icu-101');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Sarah Vance (Emergency Lead)');
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([
    'IV Heparin 5000 IU',
    'Aspirin 325mg chewable',
    'Sublingual Nitroglycerin',
    'Normal Saline 1000ml Infusion'
  ]);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !emergency) return null;

  const handleAcknowledge = () => {
    hospitalAcknowledgePreAlert(selectedBed, assignedDoctor, selectedMedicines);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-red-500/60 bg-[#0A0F1D] shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        {/* Glow Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-red-950 border border-red-500 text-red-400 animate-sos-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white font-heading">
                  INCOMING EMERGENCY PRE-ALERT
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/60 text-[10px] font-black uppercase">
                  {emergency.aiAssessment.severity}
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-medium">
                Ambulance En Route • ETA ~{emergency.etaMinutes || 5} min • Patient: {emergency.patientName} (Age {emergency.patientAge})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white font-heading">ER Team Prepped & Bed Allocated!</h4>
            <p className="text-xs text-slate-300">
              Trauma bay reserved and specialist notified. Telemetry synchronized with arriving ambulance.
            </p>
          </div>
        ) : (
          <div className="space-y-5 pt-4 text-xs">
            {/* Live Vitals & AI Diagnostic Intent */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BERT AI Diagnosis: {emergency.aiAssessment.primaryDiagnosisIntent}</span>
                </span>
                <span className="text-cyan-400 font-semibold text-[11px]">
                  Specialty: {emergency.aiAssessment.recommendedSpecialty}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-red-400 font-bold text-sm">{emergency.vitals.heartRate} bpm</div>
                  <div className="text-[10px] text-slate-400">Heart Rate</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 font-bold text-sm">{emergency.vitals.spO2}%</div>
                  <div className="text-[10px] text-slate-400">SpO2 Level</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-white font-bold text-sm">{emergency.vitals.bloodPressureSys}/{emergency.vitals.bloodPressureDia}</div>
                  <div className="text-[10px] text-slate-400">Blood Pressure</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-amber-400 font-bold text-sm">{emergency.vitals.temperature}°F</div>
                  <div className="text-[10px] text-slate-400">Body Temp</div>
                </div>
              </div>
            </div>

            {/* Bed Reservation Selector */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center space-x-1.5">
                <BedDouble className="w-4 h-4 text-cyan-400" />
                <span>Assign Immediate Resuscitation / ICU Bed</span>
              </label>
              <select
                value={selectedBed}
                onChange={(e) => setSelectedBed(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-cyan-400"
              >
                <option value="b-icu-101">ICU-101 (3rd Floor East - Resuscitation Ready)</option>
                <option value="b-icu-102">ICU-102 (3rd Floor East)</option>
                <option value="b-er-201">ER-BAY-1 (Ground Floor Trauma Suite)</option>
                <option value="b-er-202">ER-BAY-2 (Ground Floor Trauma Suite)</option>
                <option value="b-vent-301">VENT-01 (Ventilator Bay)</option>
              </select>
            </div>

            {/* Doctor Triage Lead */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Assign Attending Emergency Physician</span>
              </label>
              <select
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-cyan-400"
              >
                <option value="Dr. Sarah Vance (Emergency Lead)">Dr. Sarah Vance (Emergency Lead)</option>
                <option value="Dr. Marcus Chen (Cardiology Interventionalist)">Dr. Marcus Chen (Cardiology Interventionalist)</option>
                <option value="Dr. Liam Thorne (Trauma Surgeon)">Dr. Liam Thorne (Trauma Surgeon)</option>
              </select>
            </div>

            {/* Emergency Medication Tray Checklist */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-amber-400" />
                <span>Pre-Package Emergency Drug Kit (E-Pharmacy Auto-Order)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'IV Heparin 5000 IU',
                  'Aspirin 325mg chewable',
                  'Sublingual Nitroglycerin',
                  'Normal Saline 1000ml Infusion',
                  'Morphine 4mg IV Ampoule',
                  'Epinephrine 1:10,000'
                ].map((med, i) => (
                  <label key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedMedicines.includes(med)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMedicines([...selectedMedicines, med]);
                        } else {
                          setSelectedMedicines(selectedMedicines.filter(m => m !== med));
                        }
                      }}
                      className="accent-cyan-400 w-3.5 h-3.5 rounded"
                    />
                    <span className="text-[11px] text-slate-300 truncate">{med}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleAcknowledge}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acknowledge Pre-Alert & Dispatch ER Team</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
