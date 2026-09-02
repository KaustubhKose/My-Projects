import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  BedDouble, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles,
  ArrowRight,
  Stethoscope,
  Heart
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Hospital } from '../../types';
import { HospitalDetailModal } from './HospitalDetailModal';
import { BookAppointmentModal } from './BookAppointmentModal';

export const HospitalDirectory: React.FC = () => {
  const { hospitals } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [maxDistance, setMaxDistance] = useState(15);
  const [selectedHospitalForDetails, setSelectedHospitalForDetails] = useState<Hospital | null>(null);
  const [selectedHospitalForBooking, setSelectedHospitalForBooking] = useState<Hospital | null>(null);

  const filterChips = [
    { id: 'ALL', label: 'All Hospitals' },
    { id: 'ICU', label: 'ICU Available' },
    { id: 'Cardiology', label: 'Cardiology' },
    { id: 'Neurology', label: 'Neurology / Stroke' },
    { id: 'Trauma', label: 'Trauma & ER' },
    { id: 'Pediatrics', label: 'Pediatrics' },
    { id: 'BloodBank', label: 'Blood Bank' },
    { id: 'Pharmacy', label: '24/7 Pharmacy' }
  ];

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(hosp => {
      const depts = hosp.departments || hosp.specialties || [];
      const specs = hosp.specialistsOnDuty || hosp.doctors.map(d => d.specialty) || [];

      // Search text match
      const queryMatch = 
        hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        depts.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!queryMatch) return false;
      if (hosp.distanceKm > maxDistance) return false;

      // Filter chip match
      if (selectedFilter === 'ICU') return hosp.icuBedsAvailable > 0;
      if (selectedFilter === 'Cardiology') return depts.some((d: string) => d.includes('Cardiology')) || specs.some((s: string) => s.includes('Cardiologist'));
      if (selectedFilter === 'Neurology') return depts.some((d: string) => d.includes('Neurology')) || specs.some((s: string) => s.includes('Neurologist'));
      if (selectedFilter === 'Trauma') return hosp.facilities?.hasTraumaCenterLevel1 ?? true;
      if (selectedFilter === 'Pediatrics') return depts.some((d: string) => d.includes('Pediatric'));
      if (selectedFilter === 'BloodBank') return hosp.facilities?.hasBloodBank ?? true;
      if (selectedFilter === 'Pharmacy') return hosp.facilities?.hasEmergencyPharmacy24x7 ?? true;

      return true;
    }).sort((a, b) => b.smartScore - a.smartScore);
  }, [hospitals, searchQuery, selectedFilter, maxDistance]);

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <span>Smart Hospital Discovery & Real-Time Capacity</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Browse nearby emergency medical centers with live ICU beds, predicted waiting times, and on-duty specialists.
          </p>
        </div>

        {/* Search Input & Distance Slider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name, specialty (e.g. Cardiology), or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-300 text-[11px]">Radius: <strong className="text-cyan-400">{maxDistance} km</strong></span>
            <input
              type="range"
              min="2"
              max="25"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-32 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {filterChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => setSelectedFilter(chip.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedFilter === chip.id
                  ? 'bg-blue-600/40 text-cyan-300 border border-cyan-400 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map(hosp => (
          <div
            key={hosp.id}
            className="rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 overflow-hidden hover:border-cyan-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={hosp.image}
                  alt={hosp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1527] via-transparent to-black/40" />

                {/* Badges Top Left & Right */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase backdrop-blur-md">
                    {hosp.isOpen24x7 ? 'Open 24/7' : 'Standard'}
                  </span>
                  {hosp.hasTraumaCenterLevel1 && (
                    <span className="px-2.5 py-1 rounded-full bg-red-950/90 text-red-300 border border-red-500/40 text-[10px] font-bold uppercase backdrop-blur-md">
                      Level 1 Trauma
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-slate-950/90 border border-cyan-400 text-xs font-black text-cyan-400 shadow-lg backdrop-blur-md">
                  ★ {hosp.smartScore}/100 <span className="text-[9px] font-normal text-slate-300">Rank</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs text-slate-200 flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <strong className="text-white">{hosp.rating}</strong> (450+)
                  </span>
                  <span className="text-xs text-cyan-300 font-semibold flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{hosp.distanceKm} km ({hosp.etaMinutes} min)</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition">
                    {hosp.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{hosp.address}</p>
                </div>

                {/* AI Recommendation Highlight */}
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{hosp.recommendedReason}</span>
                </div>

                {/* Key Capacity Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-black text-cyan-400 text-sm font-heading">{hosp.icuBedsAvailable}</div>
                    <div className="text-[10px] text-slate-400">ICU Slots</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-black text-emerald-400 text-sm font-heading">{hosp.erBedsAvailable}</div>
                    <div className="text-[10px] text-slate-400">ER Bays</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-black text-amber-400 text-sm font-heading">{hosp.estimatedWaitMinutes} min</div>
                    <div className="text-[10px] text-slate-400">Wait Time</div>
                  </div>
                </div>

                {/* Specialists on duty */}
                <div className="text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 block mb-1">On-Duty Emergency Team:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(hosp.specialistsOnDuty || hosp.doctors.map(d => d.specialty) || ['Cardiologist', 'Trauma Surgeon']).slice(0, 3).map((spec: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 px-5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedHospitalForDetails(hosp)}
                className="text-xs text-slate-300 hover:text-cyan-400 font-semibold transition cursor-pointer"
              >
                View Full Details →
              </button>

              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${hosp.contactNumber}`}
                  className="p-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300"
                  title="Call Hospital Hotline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setSelectedHospitalForBooking(hosp)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
                >
                  Book Visit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Detail Modal */}
      <HospitalDetailModal
        hospital={selectedHospitalForDetails}
        isOpen={!!selectedHospitalForDetails}
        onClose={() => setSelectedHospitalForDetails(null)}
        onBookAppointment={(hosp) => setSelectedHospitalForBooking(hosp)}
      />

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        hospital={selectedHospitalForBooking}
        isOpen={!!selectedHospitalForBooking}
        onClose={() => setSelectedHospitalForBooking(null)}
      />
    </div>
  );
};
