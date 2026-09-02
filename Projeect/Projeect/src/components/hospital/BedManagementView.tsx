import React, { useState } from 'react';
import { 
  BedDouble, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  UserCheck,
  Building2,
  Trash2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { BedCategory, BedStatus } from '../../types';

export const BedManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const { hospitals, toggleBedStatus } = useEmergency();
  const currentHospital = hospitals.find(h => h.id === (currentUser.hospitalId || 'hosp-1')) || hospitals[0];

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const filteredBeds = currentHospital.beds.filter(b => {
    if (selectedTypeFilter !== 'ALL' && b.type !== selectedTypeFilter) return false;
    if (selectedStatusFilter !== 'ALL' && b.status !== selectedStatusFilter) return false;
    return true;
  });

  const nextStatusMap: Record<BedStatus, BedStatus> = {
    AVAILABLE: 'OCCUPIED',
    OCCUPIED: 'RESERVED',
    RESERVED: 'CLEANING',
    CLEANING: 'MAINTENANCE',
    MAINTENANCE: 'AVAILABLE'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <BedDouble className="w-6 h-6 text-cyan-400" />
            <span>Hospital Bed & Ward Command System</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {currentHospital.name} • 7 Ward Categories, admission tracking, and cleaning status cycles.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            {currentHospital.icuBedsAvailable} ICU Open
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
            {currentHospital.erBedsAvailable} ER Bays Open
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          <span className="text-slate-400 font-semibold shrink-0">Ward Category:</span>
          {['ALL', 'ICU', 'ER_TRAUMA', 'GENERAL_WARD', 'PRIVATE', 'PEDIATRIC', 'ISOLATION', 'OPERATION_THEATRE'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTypeFilter(t)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                selectedTypeFilter === t
                  ? 'bg-blue-600/40 text-cyan-300 border border-cyan-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          <span className="text-slate-400 font-semibold shrink-0">Status:</span>
          {['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MAINTENANCE'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatusFilter(s)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                selectedStatusFilter === s
                  ? 'bg-cyan-600/40 text-cyan-300 border border-cyan-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBeds.map(bed => (
          <div
            key={bed.id}
            onClick={() => toggleBedStatus(currentHospital.id, bed.id, nextStatusMap[bed.status])}
            className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer select-none shadow-xl flex flex-col justify-between group ${
              bed.status === 'AVAILABLE'
                ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/40 hover:border-emerald-400'
                : bed.status === 'RESERVED'
                ? 'bg-blue-950/30 border-cyan-400 hover:bg-blue-950/50'
                : bed.status === 'CLEANING'
                ? 'bg-purple-950/20 border-purple-500/40 hover:bg-purple-950/40'
                : bed.status === 'MAINTENANCE'
                ? 'bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-black text-white font-heading">{bed.number}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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

              <div className="text-xs space-y-1.5 text-slate-300">
                <div>Category: <strong className="text-white">{bed.type.replace('_', ' ')}</strong></div>
                <div>Location: {bed.floor}</div>
                {bed.assignedPatientName && (
                  <div className="text-cyan-300">
                    Patient: <strong>{bed.assignedPatientName}</strong> (Admitted: {bed.admissionTime || '11:45'})
                  </div>
                )}
                {bed.attendingDoctor && (
                  <div className="text-slate-400 text-[11px]">
                    Doctor: <span className="text-white">{bed.attendingDoctor}</span>
                  </div>
                )}
                <div className="text-[10px] text-slate-500">Updated: {bed.lastUpdated}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 mt-3 text-[10px] text-cyan-400 font-semibold group-hover:underline flex items-center justify-between">
              <span>Click to advance status</span>
              <span>➔ {nextStatusMap[bed.status]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
