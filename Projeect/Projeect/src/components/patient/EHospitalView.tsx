import React, { useState } from 'react';
import { 
  Pill, 
  FlaskConical, 
  FileText, 
  Receipt, 
  Download, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  Sparkles,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { BillingInvoice, LabReport } from '../../types';

type EHospitalTab = 'prescriptions' | 'lab_reports' | 'radiology' | 'billing' | 'discharge';

export const EHospitalView: React.FC = () => {
  const { currentUser } = useAuth();
  const { prescriptions, labReports, radiologyReports, invoices, issuePrescriptionMedication } = useEmergency();
  const [activeTab, setActiveTab] = useState<EHospitalTab>('prescriptions');
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);
  const [refillSuccess, setRefillSuccess] = useState<string | null>(null);

  const handleRefillRequest = (id: string) => {
    setRefillSuccess(id);
    issuePrescriptionMedication(id);
    setTimeout(() => setRefillSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>UNIVERSAL PATIENT E-HOSPITAL RECORD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            E-Hospital Medical Records & Digital Billing
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access active prescriptions, pathology lab reports, radiology imaging, and itemized billing receipts.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">HIPAA & HL7 Encrypted</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'prescriptions', label: `Active Prescriptions (${prescriptions.length})`, icon: Pill },
          { id: 'lab_reports', label: `Lab & Bloodwork (${labReports.length})`, icon: FlaskConical },
          { id: 'radiology', label: `Radiology & Imaging (${radiologyReports.length})`, icon: Eye },
          { id: 'billing', label: `Invoices & Receipts (${invoices.length})`, icon: Receipt },
          { id: 'discharge', label: 'Discharge Summaries', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EHospitalTab)}
              className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600/40 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map(rx => (
            <div
              key={rx.id}
              className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm font-heading">{rx.medicineName}</h3>
                      <span className="text-xs text-cyan-400 font-semibold">{rx.dosage}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    Rx ID #{rx.id}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Frequency:</span>
                    <strong className="text-white">{rx.frequency}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold text-emerald-400">{rx.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Prescribing Doctor:</span>
                    <span className="text-white">{rx.doctorName}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                    Instructions: <em>{rx.instructions}</em>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Date: {rx.prescribedDate}</span>
                {rx.refillAvailable && (
                  <button
                    onClick={() => handleRefillRequest(rx.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600/40 hover:bg-cyan-600 border border-cyan-500/50 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    {refillSuccess === rx.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Refill Sent!</span>
                      </>
                    ) : (
                      <span>Request E-Pharmacy Refill</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LAB REPORTS */}
      {activeTab === 'lab_reports' && (
        <div className="space-y-4">
          {labReports.map(report => (
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
                    <p className="text-xs text-slate-400">{report.hospitalName} • Pathologist: {report.doctorName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    {report.status}
                  </span>
                  <span className="text-xs text-slate-400">{report.date}</span>
                </div>
              </div>

              {/* Parameter Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="pb-2">Test Parameter</th>
                      <th className="pb-2">Observed Value</th>
                      <th className="pb-2">Biological Reference Range</th>
                      <th className="pb-2">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {report.resultValues.map((val, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2 font-medium text-white">{val.parameter}</td>
                        <td className="py-2 font-bold font-mono text-cyan-300">{val.value}</td>
                        <td className="py-2 text-slate-400">{val.normalRange}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            val.status === 'NORMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
                          }`}>
                            {val.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {report.doctorRemarks && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-white block mb-0.5">Clinical Pathology Remarks:</span>
                  {report.doctorRemarks}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RADIOLOGY */}
      {activeTab === 'radiology' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {radiologyReports.map(rad => (
            <div
              key={rad.id}
              className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm font-heading">{rad.scanType}</h3>
                      <span className="text-xs text-cyan-400 font-semibold">{rad.bodyPart}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    {rad.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Radiological Findings:</span>
                    <p className="text-white text-xs">{rad.findings}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">Clinical Impression:</span>
                    <p className="text-slate-200">{rad.impression}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Radiologist: {rad.radiologistName}</span>
                <span>{rad.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          {invoices.map(inv => (
            <div
              key={inv.id}
              className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-heading">{inv.invoiceNumber}</h3>
                    <p className="text-xs text-slate-400">{inv.hospitalName} • Date: {inv.date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    ● {inv.paymentStatus}
                  </span>
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Hospital Billed:</span>
                  <strong className="text-white text-base font-heading">${inv.totalCost.toFixed(2)}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-emerald-400 block">Insurance Settled (90%):</span>
                  <strong className="text-emerald-400 text-base font-heading">-${inv.insuranceCoveredAmount.toFixed(2)}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-cyan-400 block">Patient Net Co-Pay:</span>
                  <strong className="text-cyan-400 text-base font-heading">${inv.patientPayableAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: DISCHARGE SUMMARIES */}
      {activeTab === 'discharge' && (
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm font-heading">Recent Discharge & Treatment Summaries</h3>
            <span className="text-xs text-slate-400">1 Completed Summary</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between text-white font-bold">
              <span>Cardiovascular Triage & Stabilization Evaluation</span>
              <span className="text-cyan-400">June 12, 2026</span>
            </div>
            <p>
              Patient evaluated in outpatient cardiology clinic following mild hypertension episodes. 12-lead ECG showed normal sinus rhythm with trace arrhythmia. Echocardiogram confirmed normal resting LV ejection fraction at 62%. Initiated on Amlodipine 5mg and Atorvastatin 20mg. Patient discharged in physiologically stable condition.
            </p>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-card border border-cyan-500/50 bg-[#0A0F1D] shadow-2xl p-6 sm:p-8 text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Official Medical Billing Receipt</h3>
                <p className="text-xs text-slate-400">Invoice #{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div>Patient Name: <strong className="text-white">{selectedInvoice.patientName}</strong></div>
                <div>Hospital: <strong className="text-cyan-400">{selectedInvoice.hospitalName}</strong></div>
                <div>Payment Method: <strong className="text-emerald-400">{selectedInvoice.paymentMethod}</strong></div>
              </div>

              <div className="divide-y divide-slate-800/80">
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{item.description}</div>
                      <div className="text-[10px] text-slate-400">{item.department}</div>
                    </div>
                    <span className="font-mono text-white">${item.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-blue-950/40 border border-cyan-500/30 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span>Gross Total:</span>
                  <strong className="text-white">${selectedInvoice.totalCost.toFixed(2)}</strong>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Insurance Settlement:</span>
                  <strong>-${selectedInvoice.insuranceCoveredAmount.toFixed(2)}</strong>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-bold pt-1 border-t border-blue-900/50 text-sm">
                  <span>Total Paid by Patient:</span>
                  <span>${selectedInvoice.patientPayableAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Download PDF & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
