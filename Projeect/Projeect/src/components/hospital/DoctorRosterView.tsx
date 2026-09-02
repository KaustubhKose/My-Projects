import React, { useState } from 'react';
import { 
  Users, 
  PhoneCall, 
  Activity, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { DoctorStatus } from '../../types';

export const DoctorRosterView: React.FC = () => {
  const { currentUser } = useAuth();
  const { hospitals } = useEmergency();
  const currentHospital = hospitals.find(h => h.id === (currentUser.hospitalId || 'hosp-1')) || hospitals[0];
  const [pagedDoctor, setPagedDoctor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageDoctor = (docName: string) => {
    setPagedDoctor(docName);
    setTimeout(() => setPagedDoctor(null), 3000);
  };

  const filteredDoctors = currentHospital.doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Doctor Management & Shift Roster Command</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {currentHospital.name} • Active shifts, emergency availability flags, and live patient queue loads.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
          <Clock className="w-4 h-4" />
          <span>Current Shift: 08:00 - 16:00 (Day Shift)</span>
        </div>
      </div>

      {pagedDoctor && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-400 text-cyan-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>STAT Page Broadcast Transmitted to {pagedDoctor}! Response acknowledgment expected &lt;60s.</span>
          </div>
          <span className="text-emerald-400 font-bold text-[10px]">TRANSMITTED</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-slate-950/80 flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search physician by name, department, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none text-xs focus:border-cyan-400"
          />
        </div>

        <span className="text-slate-400 hidden sm:inline">
          Showing <strong>{filteredDoctors.length}</strong> Registered Physicians
        </span>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start space-x-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base font-heading">{doc.name}</h3>
                      <p className="text-cyan-400 text-xs font-semibold">{doc.specialty}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      doc.status === 'ON_DUTY'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : doc.status === 'BUSY'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : 'bg-slate-900 text-slate-400'
                    }`}>
                      ● {doc.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div>Department: <strong className="text-white">{doc.department}</strong></div>
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Shift: <strong className="text-slate-200">{doc.shift}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-base font-bold text-white font-heading">{doc.currentPatientsCount}</div>
                  <div className="text-[10px] text-slate-400">Current Queue</div>
                </div>
                <div>
                  <div className="text-base font-bold text-red-400 font-heading">{doc.activeEmergenciesCount}</div>
                  <div className="text-[10px] text-slate-400">Active Trauma</div>
                </div>
                <div>
                  <div className={`text-base font-bold font-heading ${doc.emergencyAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {doc.emergencyAvailable ? 'YES' : 'NO'}
                  </div>
                  <div className="text-[10px] text-slate-400">SOS Standby</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
              <button
                onClick={() => handlePageDoctor(doc.name)}
                className="w-full py-2.5 rounded-xl bg-purple-600/40 hover:bg-purple-600 border border-purple-500/40 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Page Doctor</span>
              </button>
              <a
                href={`tel:${doc.phone}`}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
