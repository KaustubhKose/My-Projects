import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Activity, 
  Sparkles, 
  RotateCcw,
  ArrowRight,
  Stethoscope,
  Info
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { Vitals } from '../../types';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymptom?: string;
}

type SosStep = 'CONFIRM' | 'COUNTDOWN' | 'OTP' | 'TRIAGE' | 'PROCESSING';

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, initialSymptom }) => {
  const { currentUser } = useAuth();
  const { createEmergencyRequest } = useEmergency();

  const [step, setStep] = useState<SosStep>('CONFIRM');
  const [countdown, setCountdown] = useState(10);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Symptoms & Vitals State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialSymptom ? [initialSymptom] : ['Severe Chest Pain']);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 118,
    spO2: 91,
    bloodPressureSys: 145,
    bloodPressureDia: 95,
    temperature: 99.2
  });

  const availableSymptoms = [
    { id: 'chest_pain', label: 'Chest Pain', icon: '🫀', critical: true },
    { id: 'breathing', label: 'Difficulty Breathing', icon: '🫁', critical: true },
    { id: 'unconscious', label: 'Unconscious / Fainting', icon: '🧠', critical: true },
    { id: 'bleeding', label: 'Severe Bleeding', icon: '🩸', critical: true },
    { id: 'accident', label: 'Severe Accident / Trauma', icon: '🚑', critical: true },
    { id: 'high_fever', label: 'High Fever & Chills', icon: '🌡️', critical: false },
    { id: 'stroke', label: 'Numbness / Slurred Speech', icon: '⚡', critical: true },
    { id: 'fracture', label: 'Suspected Fracture / Fall', icon: '🦴', critical: false },
    { id: 'burn', label: 'Thermal / Chemical Burn', icon: '🔥', critical: true },
    { id: 'other', label: 'Other Acute Distress', icon: '⚠️', critical: false }
  ];

  // 10 Second Countdown Timer
  useEffect(() => {
    let timer: number;
    if (isOpen && step === 'COUNTDOWN') {
      if (countdown > 0) {
        timer = window.setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        setStep('OTP');
      }
    }
    return () => clearInterval(timer);
  }, [isOpen, step, countdown]);

  // Resend OTP Timer
  useEffect(() => {
    let timer: number;
    if (step === 'OTP' && resendTimer > 0) {
      timer = window.setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullOtp = otp.join('');
    // Demo OTP is 123456 or any 6 digits in demo mode
    if (fullOtp === '123456' || fullOtp.length === 6) {
      setStep('TRIAGE');
    } else {
      setOtpError('Invalid OTP code. Please enter demo OTP: 123456');
    }
  };

  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
  };

  const toggleSymptom = (label: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const applyVitalsPreset = (type: 'CRITICAL' | 'URGENT' | 'STABLE') => {
    if (type === 'CRITICAL') {
      setVitals({ heartRate: 138, spO2: 87, bloodPressureSys: 180, bloodPressureDia: 110, temperature: 101.4 });
      setSelectedSymptoms(['Chest Pain', 'Difficulty Breathing']);
    } else if (type === 'URGENT') {
      setVitals({ heartRate: 105, spO2: 94, bloodPressureSys: 140, bloodPressureDia: 90, temperature: 100.2 });
      setSelectedSymptoms(['Suspected Fracture / Fall']);
    } else {
      setVitals({ heartRate: 78, spO2: 99, bloodPressureSys: 120, bloodPressureDia: 80, temperature: 98.6 });
      setSelectedSymptoms(['High Fever & Chills']);
    }
  };

  const handleSubmitEmergency = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      createEmergencyRequest(
        selectedSymptoms,
        vitals,
        symptomNotes,
        currentUser.name,
        currentUser.phone
      );
      onClose();
      // Reset modal state
      setStep('CONFIRM');
      setCountdown(10);
      setOtp(['', '', '', '', '', '']);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-card border border-red-500/50 bg-[#0A0F1D] shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: CONFIRMATION MODAL */}
        {step === 'CONFIRM' && (
          <div className="text-center space-y-6 py-2">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-red-950/80 border-2 border-red-500/80 flex items-center justify-center shadow-2xl shadow-red-500/50 animate-sos-pulse">
              <ShieldAlert className="w-10 h-10 text-red-400" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white font-heading tracking-tight">
                Request Emergency Assistance?
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                An immediate ambulance dispatch and smart hospital pre-alert will be requested for your verified GPS location: <strong className="text-cyan-400">824 Market St, Downtown</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-left text-xs text-red-200 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Life-Threatening Protocol Alert</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Once confirmed, our BERT + XGBoost AI triage engine will score your symptoms and dispatch the nearest Advanced Life Support (ALS) vehicle.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('COUNTDOWN')}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white font-bold text-sm shadow-xl shadow-red-600/40 hover:brightness-110 transition cursor-pointer flex items-center space-x-2"
              >
                <span>Confirm Emergency SOS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 10 SECOND SAFETY COUNTDOWN */}
        {step === 'COUNTDOWN' && (
          <div className="text-center space-y-6 py-4">
            <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
              {/* Circular Progress Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="rgba(239, 68, 68, 0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#EF4444"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - countdown / 10)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white font-heading animate-pulse">
                  {countdown}
                </span>
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Seconds</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-heading">
                Safety Verification in Progress
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Dispatching emergency response in {countdown}s. Press cancel if triggered accidentally.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setStep('CONFIRM');
                  setCountdown(10);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl border border-red-500/50 bg-red-950/60 text-red-300 hover:bg-red-900/80 font-bold text-xs transition cursor-pointer"
              >
                CANCEL EMERGENCY
              </button>
              <button
                onClick={() => setStep('OTP')}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Skip to OTP →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION SCREEN */}
        {step === 'OTP' && (
          <div className="space-y-6 py-2">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-2">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Verify Emergency Request
              </h3>
              <p className="text-xs text-slate-300">
                We sent a 6-digit verification code to your mobile <strong className="text-white">+1 (555) 234-8901</strong>.
              </p>
            </div>

            {/* Demo Mode OTP Helper Banner */}
            <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Demo Mode Active: <strong>Demo OTP: 123456</strong></span>
              </div>
              <button
                onClick={fillDemoOtp}
                className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition cursor-pointer"
              >
                Auto-Fill 123456
              </button>
            </div>

            {/* 6-Digit OTP Box Grid */}
            <div className="flex justify-center space-x-2 sm:space-x-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-13 text-center text-xl font-bold text-white bg-slate-900/90 border border-slate-700 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-red-400 text-center font-medium">{otpError}</p>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Didn't receive code?</span>
              {resendTimer > 0 ? (
                <span className="text-slate-500">Resend code in {resendTimer}s</span>
              ) : (
                <button
                  onClick={() => {
                    setResendTimer(30);
                    fillDemoOtp();
                  }}
                  className="text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:brightness-110 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Continue to AI Triage</span>
            </button>
          </div>
        )}

        {/* STEP 4: AI SYMPTOMS & VITALS CAPTURE */}
        {step === 'TRIAGE' && (
          <div className="space-y-5 py-1 max-h-[75vh] overflow-y-auto pr-1">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white font-heading">
                    AI Severity & Symptoms Assessment
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Step 4 of 4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Select your acute symptoms or input vitals to trigger the BERT NLP & XGBoost ranking engines.
              </p>
            </div>

            {/* Quick Simulation Presets */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 text-[11px]">Quick Presets:</span>
              <button
                onClick={() => applyVitalsPreset('CRITICAL')}
                className="px-2 py-1 rounded bg-red-950/70 border border-red-500/40 text-red-300 text-[11px] hover:bg-red-900 transition"
              >
                ⚡ Critical (Chest Pain / Hypoxia)
              </button>
              <button
                onClick={() => applyVitalsPreset('URGENT')}
                className="px-2 py-1 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[11px] hover:bg-amber-900 transition"
              >
                ⚠️ Urgent (Fracture / Trauma)
              </button>
              <button
                onClick={() => applyVitalsPreset('STABLE')}
                className="px-2 py-1 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] hover:bg-emerald-900 transition"
              >
                ✅ Stable (Fever)
              </button>
            </div>

            {/* Symptoms Tag Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                What is happening? (Select all applicable)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSymptoms.map(item => {
                  const isSelected = selectedSymptoms.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleSymptom(item.label)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer flex items-center space-x-2 ${
                        isSelected
                          ? item.critical
                            ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-500/20'
                            : 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vitals Telemetry Inputs */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span>Patient Vitals Telemetry</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Optional / Sensor Sync</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={vitals.spO2}
                    onChange={(e) => setVitals({ ...vitals, spO2: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Blood Pressure</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={vitals.bloodPressureSys}
                      onChange={(e) => setVitals({ ...vitals, bloodPressureSys: Number(e.target.value) })}
                      className="w-1/2 px-1.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white"
                    />
                    <span className="text-slate-500">/</span>
                    <input
                      type="number"
                      value={vitals.bloodPressureDia}
                      onChange={(e) => setVitals({ ...vitals, bloodPressureDia: Number(e.target.value) })}
                      className="w-1/2 px-1.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional description (optional natural language for BERT NLP)
              </label>
              <textarea
                rows={2}
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                placeholder="e.g., Heavy radiating chest pain to left arm for past 20 minutes, cold sweat..."
                className="w-full px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Dispatch Action Button */}
            <button
              onClick={handleSubmitEmergency}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/40 hover:brightness-110 transition cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>DISPATCH AMBULANCE & PRE-ALERT HOSPITAL NOW</span>
            </button>
          </div>
        )}

        {/* STEP 5: PROCESSING LOADER */}
        {step === 'PROCESSING' && (
          <div className="text-center py-12 space-y-4">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
              <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-heading">
                Running BERT NLP & XGBoost Scoring...
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Selecting nearest suitable ambulance & smart ranking top hospital capacity...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
