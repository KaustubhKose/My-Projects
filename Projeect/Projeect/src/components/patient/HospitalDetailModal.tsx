import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  MapPin, 
  Clock, 
  Star, 
  BedDouble, 
  Users, 
  ShieldCheck, 
  Pill, 
  FlaskConical, 
  Droplet, 
  FileText, 
  CheckCircle2, 
  PhoneCall,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Hospital } from '../../types';

interface HospitalDetailModalProps {
  hospital: Hospital | null;
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (hospital: Hospital) => void;
}

type HospitalDetailTab = 
  | 'overview' 
  | 'beds' 
  | 'doctors' 
  | 'emergency' 
  | 'pharmacy_lab' 
  | 'insurance' 
  | 'reviews';

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({
  hospital,
  isOpen,
  onClose,
  onBookAppointment
}) => {
  const [activeTab, setActiveTab] = useState<HospitalDetailTab>('overview');

  if (!isOpen || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass-card border border-cyan-500/40 bg-[#0A0F1D] shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header Banner */}
        <div className="relative h-44 shrink-0 overflow-hidden">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-full object-cover brightness-75 filter"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Hospital Name & Smart Score */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase">
                  {hospital.isOpen24x7 ? 'Open 24/7' : 'Standard Hours'}
                </span>
                <span className="text-xs text-slate-300 flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <strong className="text-white">{hospital.rating}</strong> (480+ reviews)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {hospital.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{hospital.address} • {hospital.distanceKm} km ({hospital.etaMinutes} min)</span>
              </p>
            </div>

            {/* Smart Score Box */}
            <div className="px-4 py-2 rounded-2xl bg-slate-950/90 border border-cyan-400 shadow-xl text-center shrink-0">
              <div className="text-lg font-black text-cyan-400 font-heading">
                ★ {hospital.smartScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <div className="text-[10px] text-slate-300 font-medium">Smart AI Rank</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="border-b border-slate-800 px-6 bg-slate-950/60 flex items-center space-x-4 overflow-x-auto text-xs shrink-0 py-2">
          {[
            { id: 'overview', label: 'Overview & Facilities' },
            { id: 'beds', label: `Beds (${hospital.availableBeds} Available)` },
            { id: 'doctors', label: `Doctors & Specialists` },
            { id: 'emergency', label: 'Emergency & Trauma' },
            { id: 'pharmacy_lab', label: 'Pharmacy, Lab & Blood Bank' },
            { id: 'insurance', label: 'Insurance & Billing' },
            { id: 'reviews', label: 'Patient Reviews' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HospitalDetailTab)}
              className={`py-2 px-3 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Highlight Recommendation */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Why LifeLink Recommends This Hospital</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {hospital.recommendedReason}
                </p>
              </div>

              {/* Core Hospital Capacity Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-black text-white font-heading">{hospital.totalBeds}</div>
                  <div className="text-[10px] text-slate-400">Total Bed Capacity</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-black text-emerald-400 font-heading">{hospital.availableBeds}</div>
                  <div className="text-[10px] text-slate-400">Available Beds</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-black text-cyan-400 font-heading">{hospital.icuBedsAvailable}</div>
                  <div className="text-[10px] text-slate-400">ICU Slots Open</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-black text-amber-400 font-heading">{hospital.estimatedWaitMinutes}m</div>
                  <div className="text-[10px] text-slate-400">Predicted Wait Time</div>
                </div>
              </div>

              {/* Facilities Checklist */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-heading">
                  Facilities & Accreditations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Level 1 Trauma Center</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cath Lab & Angiography</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24/7 CT & MRI Radiology</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Certified Blood Bank</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24/7 In-House Pharmacy</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Helipad Air Ambulance</span>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-heading">
                  Clinical Departments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(hospital.departments || hospital.specialties || ['Emergency & Trauma', 'Cardiology', 'Neurology', 'Critical Care']).map((dept: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BEDS MANAGEMENT */}
          {activeTab === 'beds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Real-Time Bed Occupancy Telemetry
                </h4>
                <span className="text-[11px] text-slate-400">Live sync via hospital sensor bus</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {hospital.beds.map(bed => (
                  <div
                    key={bed.id}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                      bed.status === 'AVAILABLE'
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : bed.status === 'RESERVED'
                        ? 'bg-blue-950/30 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{bed.number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        bed.status === 'AVAILABLE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : bed.status === 'RESERVED'
                          ? 'bg-blue-950 text-cyan-300 border border-cyan-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bed.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <div>Type: <strong className="text-white">{bed.type}</strong></div>
                      <div>Location: {bed.floor}</div>
                      <div className="text-[9px] text-slate-500">Updated {bed.lastUpdated}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCTORS & SPECIALISTS */}
          {activeTab === 'doctors' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                On-Duty Specialists & Emergency Physicians
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hospital.doctors.map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
                    />
                    <div>
                      <h5 className="font-bold text-white text-xs">{doc.name}</h5>
                      <p className="text-[11px] text-cyan-400 font-medium">{doc.specialty}</p>
                      <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9px] mt-1">
                        ● {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EMERGENCY & TRAUMA */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 text-xs text-red-200 space-y-2">
                <div className="font-bold text-red-300 text-sm flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                  <span>24/7 Level 1 Trauma Resuscitation Protocol</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Equipped with dedicated resuscitation bays, immediate blood bank access, catheterization laboratory, and a 24/7 acute stroke & myocardial infarction team.
                </p>
                <div className="pt-2 flex items-center space-x-4">
                  <span className="font-bold text-white">Emergency Hotline:</span>
                  <a href={`tel:${hospital.contactNumber}`} className="text-cyan-400 font-mono font-bold hover:underline">
                    {hospital.contactNumber}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PHARMACY & LAB */}
          {activeTab === 'pharmacy_lab' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Pill className="w-4 h-4" />
                  <span>24/7 E-Pharmacy</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Fully stocked with emergency thrombolytics, cardiac injectables, blood pressure stabilizers, and digital prescription dispensing.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <FlaskConical className="w-4 h-4" />
                  <span>Automated Pathology Lab</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Stat blood gas analysis, cardiac troponin assays, blood typing, and toxicological screening with &lt;15 min turnaround.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-bold">
                  <Droplet className="w-4 h-4" />
                  <span>Certified Blood Bank</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  O-negative universal donor units, plasma, platelets, and whole blood ready on instant pre-alert.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: INSURANCE */}
          {activeTab === 'insurance' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                Accepted Insurance Networks (Cashless Emergency Admission)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(hospital.insuranceAccepted || ['Star Health & Allied Insurance', 'HDFC ERGO Health', 'ICICI Lombard', 'Ayushman Bharat PM-JAY', 'Care Health']).map((ins: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Jessica Miller</span>
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  "The emergency response was incredible. The doctor was prepped before our ambulance even pulled into the bay!"
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">David K.</span>
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  "State of the art cardiac trauma center. Professional triage team and rapid admission."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <a
            href={`tel:${hospital.contactNumber}`}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            <span>Call Hotline</span>
          </a>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(hospital);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:brightness-110 transition flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
