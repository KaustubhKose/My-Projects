import React from 'react';
import { 
  History, 
  Truck, 
  MapPin, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

export const TripHistoryView: React.FC = () => {
  const { currentUser } = useAuth();
  const { emergencyHistory } = useEmergency();

  const mockPastTrips = [
    {
      id: 'TRIP-8841',
      patientName: 'Robert Langdon',
      severity: 'CRITICAL',
      pickup: '1024 Bush St, Metro Center',
      hospital: 'Metro Health Academic Medical Center',
      durationMinutes: 7,
      date: 'Today at 14:15',
      status: 'HANDOFF_COMPLETE'
    },
    {
      id: 'TRIP-7730',
      patientName: 'Clara Oswald',
      severity: 'URGENT',
      pickup: '550 Mission St, Financial District',
      hospital: 'St. Jude Memorial Healthcare Institute',
      durationMinutes: 9,
      date: 'Yesterday at 18:40',
      status: 'HANDOFF_COMPLETE'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Driver Trip & Dispatch History</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Paramedic {currentUser.name} • Completed emergency dispatches, response times, and patient handoffs.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Total Shift Triages: <strong className="text-emerald-400">14 Trips</strong></span>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {mockPastTrips.map(trip => (
          <div
            key={trip.id}
            className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white font-heading">
                      Patient: {trip.patientName}
                    </h3>
                    <span className="px-2 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/40 text-[9px] font-bold">
                      {trip.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Trip ID: {trip.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Handoff Completed</span>
                </span>
                <span className="text-xs text-slate-400">{trip.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Scene Location:</span>
                <div className="font-semibold text-white flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{trip.pickup}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Destination Hospital:</span>
                <div className="font-semibold text-white flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{trip.hospital}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Transit Duration:</span>
                <div className="font-semibold text-emerald-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{trip.durationMinutes} minutes (On-Target)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
