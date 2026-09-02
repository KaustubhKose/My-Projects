import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  FileText,
  Activity,
  Sparkles
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const LaboratoryView: React.FC = () => {
  const { labReports, completeLabReport } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredReports = labReports.filter(r => {
    const matchSearch = r.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <FlaskConical className="w-6 h-6 text-emerald-400" />
            <span>Clinical Pathology & Diagnostic Laboratory</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Automated blood gas assays, cardiac biomarker panels, and stat emergency turnaround tracker.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          <Clock className="w-4 h-4" />
          <span>Stat Turnaround: &lt; 14 mins</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lab tests, patient ID, pathologist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {['ALL', 'Biochemistry', 'Hematology', 'Pathology'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-xl font-medium transition cursor-pointer ${
                selectedCategory === c
                  ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-400'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Reports List */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <div
            key={report.id}
            className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-heading">{report.testName}</h3>
                  <p className="text-xs text-slate-400">Category: <strong className="text-cyan-300">{report.category}</strong> • Physician: {report.doctorName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  ● {report.status}
                </span>
                <span className="text-xs text-slate-400">{report.date}</span>
              </div>
            </div>

            {/* Results Parameter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {report.resultValues.map((v, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px] block">{v.parameter}</span>
                    <strong className="text-white font-mono text-xs">{v.value}</strong>
                    <span className="text-[9px] text-slate-500 block">Norm: {v.normalRange}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    v.status === 'NORMAL' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>

            {report.doctorRemarks && (
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-cyan-300">Pathology Sign-Off:</span> {report.doctorRemarks}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
