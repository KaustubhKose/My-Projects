import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Video, 
  Plus, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Ticket, 
  Bell, 
  AlertCircle
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { BookAppointmentModal } from './BookAppointmentModal';
import { Hospital } from '../../types';

export const PatientAppointmentsView: React.FC = () => {
  const { appointments, hospitals, cancelAppointment, rescheduleAppointment } = useEmergency();
  const [showBookModal, setShowBookModal] = useState(false);
  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('Next Monday');
  const [newSlot, setNewSlot] = useState('02:00 PM');

  const handleRescheduleSubmit = (id: string) => {
    rescheduleAppointment(id, newDate, newSlot);
    setRescheduleModalId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0A0F1D] to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <span>Consultations & Digital Queue Pass Manager</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage upcoming specialist appointments, digital token numbers, and live queue status.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Active Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map(apt => (
          <div
            key={apt.id}
            className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {apt.type === 'TELE_CONSULT' ? <Video className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-heading">{apt.doctorName}</h3>
                    <p className="text-[11px] text-cyan-400 font-medium">{apt.department}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-950 to-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-black font-mono">
                    {apt.queueToken || '#Q-14'}
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Digital Token</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{apt.hospitalName}</span>
                </div>
                <div className="flex items-center space-x-2 text-white font-medium">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{apt.dateTime}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                  Reason: <strong>{apt.reason}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                apt.status === 'CONFIRMED'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : apt.status === 'RESCHEDULED'
                  ? 'bg-blue-950 text-cyan-300 border border-cyan-400'
                  : 'bg-slate-900 text-slate-400'
              }`}>
                ● {apt.status}
              </span>

              {apt.status !== 'CANCELLED' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRescheduleModalId(apt.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl glass-card border border-cyan-500/50 bg-[#0A0F1D] shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleModalId(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Date</label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                >
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="In 2 Days">In 2 Days</option>
                  <option value="Next Monday">Next Monday</option>
                  <option value="Next Thursday">Next Thursday</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:15 PM">04:15 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRescheduleModalId(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRescheduleSubmit(rescheduleModalId)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20"
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        hospital={hospitals[0]}
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
      />
    </div>
  );
};
