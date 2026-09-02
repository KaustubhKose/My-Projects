import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  ShieldCheck, 
  PhoneCall, 
  Activity, 
  Droplet, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  FileText, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PatientProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name,
    age: 34,
    gender: 'Male',
    bloodGroup: currentUser.bloodGroup || 'O+',
    phone: currentUser.phone || '+1 (555) 234-8901',
    emergencyContact: currentUser.emergencyContact || 'Sarah Mercer (+1 555 987-6543 - Wife)',
    preferredHospital: 'Metro Health Academic Medical Center',
    allergies: 'Penicillin (Severe Rash), Shellfish',
    medicalConditions: 'Mild Hypertension (Under Medication)',
    currentMedicines: 'Amlodipine 5mg (Daily morning), Atorvastatin 20mg (Night)',
    previousSurgeries: 'Appendectomy (2018 - Laparoscopic, No complications)',
    insuranceProvider: 'BlueCross BlueShield Comprehensive PPO (#BC-99042)',
    insurancePolicyNumber: 'POL-9920-CARDIO-PRO',
    // Consent Controls
    consentEmergencyDataShare: true,
    consentAiTriageAssistance: true,
    consentWearableTelemetrySync: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/30"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {currentUser.name}
            </h2>
            <p className="text-xs text-cyan-400 font-medium">
              Universal Patient Profile • <strong className="font-mono text-white">#HQ-99042</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Patient ID</span>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-6 text-xs shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-heading flex items-center space-x-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Emergency Medical ID, Clinical History & Insurance</span>
          </h3>
          {isSaved && (
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile Updated!</span>
            </span>
          )}
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Age & Gender</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-20 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            >
              <option value="O+">O Positive (O+)</option>
              <option value="O-">O Negative (O-)</option>
              <option value="A+">A Positive (A+)</option>
              <option value="A-">A Negative (A-)</option>
              <option value="B+">B Positive (B+)</option>
              <option value="B-">B Negative (B-)</option>
              <option value="AB+">AB Positive (AB+)</option>
              <option value="AB-">AB Negative (AB-)</option>
            </select>
          </div>
        </div>

        {/* Contacts & Preferred Hospital */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Emergency Contact (SMS Trigger)</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Preferred Emergency Hospital</label>
            <input
              type="text"
              value={formData.preferredHospital}
              onChange={(e) => setFormData({ ...formData, preferredHospital: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Clinical History & Current Meds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Known Drug & Food Allergies</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Pre-Existing Conditions</label>
            <input
              type="text"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Current Daily Medications</label>
            <input
              type="text"
              value={formData.currentMedicines}
              onChange={(e) => setFormData({ ...formData, currentMedicines: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Previous Surgeries & Procedures</label>
            <input
              type="text"
              value={formData.previousSurgeries}
              onChange={(e) => setFormData({ ...formData, previousSurgeries: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Insurance */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Health Insurance Policy Details (Cashless Hospitalization)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">Insurance Provider</label>
              <input
                type="text"
                value={formData.insuranceProvider}
                onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">Policy / Member ID</label>
              <input
                type="text"
                value={formData.insurancePolicyNumber}
                onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Consent Controls */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-3">
          <div className="font-bold text-white flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Emergency Data Privacy & Consent Controls</span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 text-xs">Share Medical History with Arriving Ambulance & ER Triage Team</span>
              <input
                type="checkbox"
                checked={formData.consentEmergencyDataShare}
                onChange={(e) => setFormData({ ...formData, consentEmergencyDataShare: e.target.checked })}
                className="accent-cyan-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 text-xs">Enable BERT + XGBoost AI Clinical Decision Support on SOS Trigger</span>
              <input
                type="checkbox"
                checked={formData.consentAiTriageAssistance}
                onChange={(e) => setFormData({ ...formData, consentAiTriageAssistance: e.target.checked })}
                className="accent-cyan-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 text-xs">Sync Live Smartwatch Vitals (Heart Rate & SpO2)</span>
              <input
                type="checkbox"
                checked={formData.consentWearableTelemetrySync}
                onChange={(e) => setFormData({ ...formData, consentWearableTelemetrySync: e.target.checked })}
                className="accent-cyan-400 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition cursor-pointer"
          >
            Save Health Profile & Privacy Consents
          </button>
        </div>
      </form>
    </div>
  );
};
