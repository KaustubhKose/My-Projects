import React, { useState } from 'react';
import { 
  Calendar, 
  X, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  Video, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Ticket,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Hospital, Appointment } from '../../types';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

interface BookAppointmentModalProps {
  hospital: Hospital | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'HOSPITAL' | 'DEPARTMENT' | 'DOCTOR' | 'DATE_SLOT' | 'CONFIRM' | 'SUCCESS';

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  hospital: initialHospital,
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const { hospitals, bookAppointment } = useEmergency();

  const [step, setStep] = useState<BookingStep>('DEPARTMENT');
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(initialHospital || hospitals[0]);
  const [selectedDept, setSelectedDept] = useState<string>('Cardiology & Cath Lab');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Dr. Marcus Chen (Cardiologist)');
  const [consultType, setConsultType] = useState<'IN_PERSON' | 'TELE_CONSULT'>('IN_PERSON');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [reason, setReason] = useState<string>('Quarterly cardiovascular checkup & consultation');
  const [reminders, setReminders] = useState<boolean>(true);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const departmentsList = [
    { name: 'Cardiology & Cath Lab', icon: '🫀', doctors: ['Dr. Marcus Chen (Cardiologist)', 'Dr. Rahul Sharma'] },
    { name: 'Emergency & Trauma', icon: '🚑', doctors: ['Dr. Sarah Vance (Emergency Lead)', 'Dr. Liam Thorne'] },
    { name: 'Neurology & Stroke', icon: '🧠', doctors: ['Dr. Priya Patel', 'Dr. Evelyn Reed'] },
    { name: 'Orthopedics & Spine', icon: '🦴', doctors: ['Dr. Aaron Patel (Orthopedic Surgeon)'] },
    { name: 'Pediatric Care', icon: '👶', doctors: ['Dr. Emily Watson (Pediatrician)'] }
  ];

  const availableSlots = [
    '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
    '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
  ];

  const handleConfirmBooking = () => {
    const apt = bookAppointment({
      patientId: currentUser.id,
      patientName: currentUser.name,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      doctorName: selectedDoctor,
      department: selectedDept,
      date: selectedDate,
      timeSlot: selectedSlot,
      dateTime: `${selectedDate} at ${selectedSlot}`,
      type: consultType,
      reason,
      remindersEnabled: reminders
    });

    setConfirmedAppointment(apt);
    setStep('SUCCESS');

    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-card border border-cyan-500/50 bg-[#0A0F1D] shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Smart Appointment & Token Generator
              </h3>
              <p className="text-[11px] text-cyan-400 font-medium">
                {selectedHospital.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP SUCCESS: DIGITAL QUEUE TOKEN */}
        {step === 'SUCCESS' && confirmedAppointment && (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white font-heading">Appointment Confirmed!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your consultation is booked. Please display your digital token upon arrival.
              </p>
            </div>

            {/* Digital Token Pass */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-2 border-cyan-400 text-center space-y-2 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>DIGITAL QUEUE PASS</span>
                <span className="font-mono text-cyan-400">ID #{confirmedAppointment.id}</span>
              </div>

              <div className="py-2">
                <div className="text-3xl font-black text-white font-heading tracking-wider">
                  {confirmedAppointment.queueToken}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest mt-1">
                  Confirmed Queue Token
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-xs pt-2 border-t border-slate-800 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block">Doctor:</span>
                  <strong className="text-white">{confirmedAppointment.doctorName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Schedule:</span>
                  <strong className="text-cyan-300">{confirmedAppointment.dateTime}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Done & Add to Dashboard
            </button>
          </div>
        )}

        {/* STEP: DEPARTMENT SELECTION */}
        {step === 'DEPARTMENT' && (
          <div className="space-y-4 py-3 text-xs">
            <label className="block text-slate-300 font-bold">Step 1: Select Clinical Department</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {departmentsList.map(dept => (
                <button
                  key={dept.name}
                  onClick={() => {
                    setSelectedDept(dept.name);
                    setSelectedDoctor(dept.doctors[0]);
                    setStep('DOCTOR');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition cursor-pointer ${
                    selectedDept === dept.name
                      ? 'bg-blue-600/30 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{dept.icon}</span>
                  <div>
                    <h5 className="font-bold text-white text-xs">{dept.name}</h5>
                    <span className="text-[10px] text-slate-400">{dept.doctors.length} Doctors on duty</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: DOCTOR SELECTION */}
        {step === 'DOCTOR' && (
          <div className="space-y-4 py-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-bold">Step 2: Choose Specialist ({selectedDept})</label>
              <button onClick={() => setStep('DEPARTMENT')} className="text-cyan-400 text-[11px] hover:underline">
                Change Dept
              </button>
            </div>

            <div className="space-y-2">
              {(departmentsList.find(d => d.name === selectedDept)?.doctors || ['Dr. Marcus Chen']).map(doc => (
                <div
                  key={doc}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                    selectedDoctor === doc
                      ? 'bg-blue-600/30 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h5 className="font-bold text-white text-xs">{doc}</h5>
                      <span className="text-[10px] text-emerald-400">● On-Duty Slots Available Today</span>
                    </div>
                  </div>
                  {selectedDoctor === doc && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('DEPARTMENT')}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep('DATE_SLOT')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Continue to Time Slot →
              </button>
            </div>
          </div>
        )}

        {/* STEP: DATE & SLOT SELECTION */}
        {step === 'DATE_SLOT' && (
          <div className="space-y-4 py-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-bold">Step 3: Select Date & Available Slot</label>
              <button onClick={() => setStep('DOCTOR')} className="text-cyan-400 text-[11px] hover:underline">
                Back to Doctor
              </button>
            </div>

            {/* In-Person vs Tele-consult */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConsultType('IN_PERSON')}
                className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 transition ${
                  consultType === 'IN_PERSON'
                    ? 'bg-blue-600/30 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Hospital Visit</span>
              </button>
              <button
                type="button"
                onClick={() => setConsultType('TELE_CONSULT')}
                className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 transition ${
                  consultType === 'TELE_CONSULT'
                    ? 'bg-blue-600/30 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Virtual Tele-Consult</span>
              </button>
            </div>

            {/* Date Picker Buttons */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Select Day:</span>
              <div className="grid grid-cols-4 gap-2">
                {['Today', 'Tomorrow', 'In 2 Days', 'Next Week'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 rounded-xl text-center font-bold border transition ${
                      selectedDate === d
                        ? 'bg-cyan-600/40 border-cyan-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">Available Consultation Slots:</span>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-xl text-center font-medium border text-[11px] transition ${
                      selectedSlot === slot
                        ? 'bg-blue-600 border-cyan-400 text-white font-bold shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reason for Consultation</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('DOCTOR')}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-xl shadow-cyan-500/30 hover:brightness-110 transition cursor-pointer"
              >
                Confirm & Generate Token →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
