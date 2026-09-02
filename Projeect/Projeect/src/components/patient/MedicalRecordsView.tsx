import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  User, 
  Pill, 
  FlaskConical, 
  Download, 
  Share2, 
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const MedicalRecordsView: React.FC = () => {
  const { medicalRecords } = useEmergency();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadSuccess(id);
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Digital Medical Health Records</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Encrypted diagnostic records, past emergency handoffs, and digital prescriptions.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* Records Timeline List */}
      <div className="space-y-4">
        {medicalRecords.map(record => (
          <div
            key={record.id}
            className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">{record.diagnosis}</h3>
                  <p className="text-xs text-slate-400">{record.hospitalName} • Attending: {record.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>Date: {record.date}</span>
                </span>
                <button
                  onClick={() => handleDownload(record.id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                  title="Download Record PDF"
                >
                  {downloadSuccess === record.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Prescriptions & Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Pill className="w-4 h-4" />
                  <span>Prescribed Medications</span>
                </div>
                <ul className="space-y-1 text-slate-300">
                  {(record.prescription || ['Amlodipine 5mg (Daily morning)', 'Atorvastatin 20mg (Bedtime)']).map((med: string, i: number) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{med}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(record.labReports || ['hs-Troponin I (14.2 ng/L)', 'Lipid Profile (Optimal)']) && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <FlaskConical className="w-4 h-4" />
                    <span>Diagnostics & Pathology Results</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {(record.labReports || ['hs-Troponin I (14.2 ng/L)', 'Lipid Profile (Optimal)']).map((lab: string, i: number) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{lab}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {record.followUpDate && (
              <div className="text-[11px] text-cyan-300 flex items-center space-x-1.5">
                <span>🗓️ Recommended Follow-up: <strong>{record.followUpDate}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
