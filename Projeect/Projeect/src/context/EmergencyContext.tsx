import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  EmergencyEvent, 
  EmergencyStatus, 
  Hospital, 
  AmbulanceVehicle, 
  Vitals, 
  SeverityLevel,
  AppNotification,
  Appointment,
  MedicalRecord,
  HospitalBed,
  MedicineInventoryItem,
  LabReport,
  RadiologyReport,
  BillingInvoice,
  PrescriptionItem,
  UserRole,
  BedCategory,
  BedStatus
} from '../types';
import { 
  INITIAL_HOSPITALS, 
  INITIAL_AMBULANCES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_MEDICAL_RECORDS,
  INITIAL_MEDICINE_INVENTORY,
  INITIAL_LAB_REPORTS,
  INITIAL_RADIOLOGY_REPORTS,
  INITIAL_INVOICES,
  INITIAL_PRESCRIPTIONS
} from '../services/mockData';
import { AIService } from '../services/aiService';
import { SmartRankingService } from '../services/rankingService';

interface EmergencyContextType {
  activeEmergency: EmergencyEvent | null;
  emergencyHistory: EmergencyEvent[];
  hospitals: Hospital[];
  ambulances: AmbulanceVehicle[];
  notifications: AppNotification[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  prescriptions: PrescriptionItem[];
  labReports: LabReport[];
  radiologyReports: RadiologyReport[];
  invoices: BillingInvoice[];
  medicines: MedicineInventoryItem[];
  soundEnabled: boolean;
  demoMode: boolean;
  toggleSound: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Emergency actions
  createEmergencyRequest: (
    symptoms: string[], 
    vitals: Vitals, 
    notes?: string, 
    patientName?: string, 
    patientPhone?: string
  ) => EmergencyEvent;
  
  cancelActiveEmergency: (reason?: string) => void;
  driverAcceptDispatch: (driverId: string, ambulanceId: string) => void;
  driverRejectDispatch: (driverId: string, ambulanceId: string) => void;
  updateEmergencyStatus: (newStatus: EmergencyStatus, note?: string) => void;
  hospitalAcknowledgePreAlert: (bedId: string, doctorName: string, medicines: string[]) => void;
  hospitalTogglePreparationAction: (actionKey: 'bedAllocated' | 'doctorNotified' | 'medicinePrepped' | 'bloodPrepped' | 'roomReady') => void;
  toggleBedStatus: (hospitalId: string, bedId: string, newStatus: BedStatus) => void;
  adminOverrideSeverity: (newSeverity: SeverityLevel, reason: string, adminName: string) => void;
  
  // Appointments
  bookAppointment: (data: Omit<Appointment, 'id' | 'queueToken' | 'status'>) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newSlot: string) => void;
  
  // Pharmacy & Inventory
  addMedicine: (medicine: Omit<MedicineInventoryItem, 'id'>) => void;
  updateMedicineStock: (id: string, deltaQuantity: number, type: 'IN' | 'OUT') => void;
  issuePrescriptionMedication: (prescriptionId: string) => void;
  
  // Labs & Radiology
  completeLabReport: (reportId: string, remarks?: string) => void;
  
  // Reset
  resetAllDemoData: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

// Web Audio API Synthesizer
const playAudioAlert = (type: 'siren' | 'chime' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'siren') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'chime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {}
};

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('lifelink_hospitals_v2');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [ambulances, setAmbulances] = useState<AmbulanceVehicle[]>(() => {
    const saved = localStorage.getItem('lifelink_ambulances_v2');
    return saved ? JSON.parse(saved) : INITIAL_AMBULANCES;
  });

  const [activeEmergency, setActiveEmergency] = useState<EmergencyEvent | null>(() => {
    const saved = localStorage.getItem('lifelink_active_emergency_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyEvent[]>(() => {
    const saved = localStorage.getItem('lifelink_history_emergencies_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [medicines, setMedicines] = useState<MedicineInventoryItem[]>(() => {
    const saved = localStorage.getItem('lifelink_medicines_v2');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINE_INVENTORY;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('lifelink_appointments_v2');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(INITIAL_PRESCRIPTIONS);
  const [labReports, setLabReports] = useState<LabReport[]>(INITIAL_LAB_REPORTS);
  const [radiologyReports] = useState<RadiologyReport[]>(INITIAL_RADIOLOGY_REPORTS);
  const [invoices] = useState<BillingInvoice[]>(INITIAL_INVOICES);
  const [medicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'LifeLink E-Hospital Connected',
      message: 'All 4 panels active with 3-second live GPS bus and drug inventory synchronization.',
      type: 'INFO',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const gpsIntervalRef = useRef<number | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('lifelink_hospitals_v2', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('lifelink_ambulances_v2', JSON.stringify(ambulances));
  }, [ambulances]);

  useEffect(() => {
    localStorage.setItem('lifelink_medicines_v2', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('lifelink_appointments_v2', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    if (activeEmergency) {
      localStorage.setItem('lifelink_active_emergency_v2', JSON.stringify(activeEmergency));
    } else {
      localStorage.removeItem('lifelink_active_emergency_v2');
    }
  }, [activeEmergency]);

  useEffect(() => {
    localStorage.setItem('lifelink_history_emergencies_v2', JSON.stringify(emergencyHistory));
  }, [emergencyHistory]);

  const toggleSound = () => setSoundEnabled(prev => !prev);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    if (soundEnabled) {
      if (notif.type === 'EMERGENCY' || notif.type === 'PRE_ALERT') playAudioAlert('siren');
      else if (notif.type === 'SUCCESS') playAudioAlert('success');
      else playAudioAlert('chime');
    }
  }, [soundEnabled]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 3-Second Live GPS & ETA Countdown Simulation
  useEffect(() => {
    if (!activeEmergency || !activeEmergency.assignedAmbulanceId) {
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
      return;
    }

    const ambId = activeEmergency.assignedAmbulanceId;
    const isMoving = activeEmergency.status === 'EN_ROUTE' || activeEmergency.status === 'HOSPITAL_EN_ROUTE';

    if (isMoving) {
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);

      gpsIntervalRef.current = window.setInterval(() => {
        // 1. Move Ambulance Coordinates
        setAmbulances(prevAmbs => {
          return prevAmbs.map(amb => {
            if (amb.id !== ambId) return amb;

            const targetLat = activeEmergency.status === 'EN_ROUTE' 
              ? activeEmergency.location.lat 
              : 37.7749; // Metro Hospital Lat
            const targetLng = activeEmergency.status === 'EN_ROUTE' 
              ? activeEmergency.location.lng 
              : -122.4194; // Metro Hospital Lng

            const dLat = (targetLat - amb.currentLocation.lat) * 0.08;
            const dLng = (targetLng - amb.currentLocation.lng) * 0.08;

            return {
              ...amb,
              currentLocation: {
                ...amb.currentLocation,
                lat: Number((amb.currentLocation.lat + dLat).toFixed(6)),
                lng: Number((amb.currentLocation.lng + dLng).toFixed(6))
              },
              speedKmh: Math.floor(52 + Math.random() * 16)
            };
          });
        });

        // 2. Decrement Dynamic ETA Seconds
        setActiveEmergency(prev => {
          if (!prev) return null;
          const currentSec = prev.etaSecondsRemaining || (prev.etaMinutes ? prev.etaMinutes * 60 : 360);
          const nextSec = Math.max(30, currentSec - 3);
          const nextMin = Math.ceil(nextSec / 60);

          return {
            ...prev,
            etaSecondsRemaining: nextSec,
            etaMinutes: nextMin
          };
        });
      }, 3000); // Exactly every 3 seconds as required by Specification 33
    } else {
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    }

    return () => {
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    };
  }, [activeEmergency?.status, activeEmergency?.assignedAmbulanceId]);

  // Create Emergency SOS Request with AI Triage & Smart Ranking
  const createEmergencyRequest = (
    symptoms: string[],
    vitals: Vitals,
    notes: string = '',
    patientName: string = 'Alex Mercer',
    patientPhone: string = '+1 (555) 234-8901'
  ): EmergencyEvent => {
    const aiAssessment = AIService.evaluateSeverityWithXGBoost(vitals, symptoms, notes, 34);
    const rankedHospitals = SmartRankingService.rankHospitals(
      hospitals,
      aiAssessment.recommendedSpecialty,
      aiAssessment.severity
    );
    const bestHospital = rankedHospitals[0].hospital;
    const availableAmb = ambulances.find(a => a.status === 'AVAILABLE') || ambulances[0];
    const emergencyId = `EMG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newEmergency: EmergencyEvent = {
      id: emergencyId,
      patientId: 'usr-patient-1',
      patientName,
      patientPhone,
      patientAge: 34,
      patientGender: 'Male',
      patientBloodGroup: 'O+',
      location: {
        lat: 37.7725,
        lng: -122.4140,
        address: '824 Market Street, Downtown Metro',
        landmark: 'Near Central Station'
      },
      symptoms,
      symptomNotes: notes,
      vitals,
      aiAssessment,
      status: 'DISPATCHING',
      assignedAmbulanceId: availableAmb.id,
      assignedHospitalId: bestHospital.id,
      etaMinutes: 6,
      etaSecondsRemaining: 360,
      distanceKm: 2.1,
      preparationSteps: {
        bedAllocated: false,
        doctorNotified: false,
        medicinePrepped: false,
        bloodPrepped: false,
        roomReady: false
      },
      timeline: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'One-Tap SOS triggered with OTP verification.'
        },
        {
          status: 'DISPATCHING',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `AI classified as ${aiAssessment.severity} (${(aiAssessment.score * 100).toFixed(0)}%). Smart ranked ${bestHospital.name}.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActiveEmergency(newEmergency);

    setAmbulances(prev => prev.map(a => a.id === availableAmb.id ? {
      ...a,
      status: 'DISPATCHED',
      assignedEmergencyId: emergencyId,
      assignedHospitalId: bestHospital.id
    } : a));

    addNotification({
      title: `🚨 EMERGENCY DISPATCH: ${aiAssessment.severity}`,
      message: `${patientName} reported ${symptoms.join(', ') || 'acute distress'}. ${availableAmb.callSign} assigned to ${bestHospital.name}.`,
      type: 'EMERGENCY',
      emergencyId
    });

    if (aiAssessment.icuPreAlertRequired) {
      addNotification({
        title: `⚠️ ICU PRE-ALERT: ${bestHospital.name}`,
        message: `Critical patient incoming (${aiAssessment.primaryDiagnosisIntent}). Direct Resuscitation Bay allocation advised.`,
        type: 'PRE_ALERT',
        emergencyId
      });
    }

    return newEmergency;
  };

  const cancelActiveEmergency = (reason: string = 'User cancelled') => {
    if (!activeEmergency) return;
    
    if (activeEmergency.assignedAmbulanceId) {
      setAmbulances(prev => prev.map(a => a.id === activeEmergency.assignedAmbulanceId ? {
        ...a,
        status: 'AVAILABLE',
        assignedEmergencyId: undefined,
        assignedHospitalId: undefined,
        speedKmh: 0
      } : a));
    }

    const cancelled = {
      ...activeEmergency,
      status: 'CANCELLED' as EmergencyStatus,
      timeline: [
        ...activeEmergency.timeline,
        {
          status: 'CANCELLED' as EmergencyStatus,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: reason
        }
      ]
    };

    setEmergencyHistory(prev => [cancelled, ...prev]);
    setActiveEmergency(null);

    addNotification({
      title: 'Emergency Cancelled',
      message: `Emergency ${activeEmergency.id} cancelled (${reason}).`,
      type: 'INFO'
    });
  };

  const driverAcceptDispatch = (driverId: string, ambulanceId: string) => {
    if (!activeEmergency) return;

    setAmbulances(prev => prev.map(a => a.id === ambulanceId ? {
      ...a,
      status: 'EN_ROUTE',
      speedKmh: 56
    } : a));

    const updated: EmergencyEvent = {
      ...activeEmergency,
      status: 'EN_ROUTE',
      timeline: [
        ...activeEmergency.timeline,
        {
          status: 'DRIVER_ACCEPTED',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Driver David Rodriguez accepted dispatch. Siren active.`
        }
      ]
    };

    setActiveEmergency(updated);

    addNotification({
      title: 'Ambulance En Route',
      message: `Driver David Rodriguez accepted SOS. Live GPS tracking active (~5 min).`,
      type: 'DISPATCH',
      emergencyId: activeEmergency.id
    });
  };

  const driverRejectDispatch = (driverId: string, ambulanceId: string) => {
    if (!activeEmergency) return;
    addNotification({
      title: 'Dispatch Rejected by Driver',
      message: 'Re-routing emergency to next available EMS unit in zone...',
      type: 'INFO',
      emergencyId: activeEmergency.id
    });
  };

  const updateEmergencyStatus = (newStatus: EmergencyStatus, note?: string) => {
    if (!activeEmergency) return;

    let defaultNote = '';
    if (newStatus === 'PICKUP') defaultNote = 'Ambulance arrived at patient location.';
    else if (newStatus === 'PATIENT_ONBOARD') defaultNote = 'Patient secured inside ambulance. Vitals telemetry streaming.';
    else if (newStatus === 'HOSPITAL_EN_ROUTE') defaultNote = 'Ambulance speeding toward destination hospital.';
    else if (newStatus === 'ARRIVED') defaultNote = 'Ambulance arrived at hospital emergency bay.';
    else if (newStatus === 'COMPLETED') defaultNote = 'Emergency triage handoff successfully completed.';

    const updatedTimeline = [
      ...activeEmergency.timeline,
      {
        status: newStatus,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: note || defaultNote
      }
    ];

    if (newStatus === 'COMPLETED') {
      const completedRecord: EmergencyEvent = {
        ...activeEmergency,
        status: 'COMPLETED',
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };

      if (activeEmergency.assignedAmbulanceId) {
        setAmbulances(prev => prev.map(a => a.id === activeEmergency.assignedAmbulanceId ? {
          ...a,
          status: 'AVAILABLE',
          assignedEmergencyId: undefined,
          assignedHospitalId: undefined,
          speedKmh: 0,
          todayTripsCount: (a.todayTripsCount || 0) + 1
        } : a));
      }

      setEmergencyHistory(prev => [completedRecord, ...prev]);
      setActiveEmergency(null);

      addNotification({
        title: 'Emergency Handoff Complete',
        message: `Emergency ${activeEmergency.id} closed. Patient admitted to ER.`,
        type: 'SUCCESS'
      });
    } else {
      const updated: EmergencyEvent = {
        ...activeEmergency,
        status: newStatus,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString()
      };
      setActiveEmergency(updated);

      addNotification({
        title: `Status: ${newStatus.replace('_', ' ')}`,
        message: note || defaultNote,
        type: 'INFO',
        emergencyId: activeEmergency.id
      });
    }
  };

  const hospitalAcknowledgePreAlert = (bedId: string, doctorName: string, selectedMedicines: string[]) => {
    if (!activeEmergency) return;

    if (activeEmergency.assignedHospitalId) {
      setHospitals(prev => prev.map(h => {
        if (h.id !== activeEmergency.assignedHospitalId) return h;
        return {
          ...h,
          availableBeds: Math.max(0, h.availableBeds - 1),
          icuBedsAvailable: Math.max(0, h.icuBedsAvailable - 1),
          beds: h.beds.map(b => b.id === bedId ? { ...b, status: 'RESERVED' as const } : b)
        };
      }));
    }

    const updated: EmergencyEvent = {
      ...activeEmergency,
      hospitalPreAlertAcknowledged: true,
      bedReservedId: bedId,
      assignedDoctorName: doctorName,
      medicinesPrepped: selectedMedicines,
      preparationSteps: {
        ...activeEmergency.preparationSteps,
        bedAllocated: true,
        doctorNotified: true,
        medicinePrepped: true,
        roomReady: true
      },
      timeline: [
        ...activeEmergency.timeline,
        {
          status: activeEmergency.status,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Hospital ER Team prepped Bed ${bedId}, assigned ${doctorName}, and prepared medications.`
        }
      ]
    };

    setActiveEmergency(updated);

    addNotification({
      title: 'Hospital Prepped & Bed Allocated',
      message: `ER Team prepped Bed ${bedId} for incoming patient.`,
      type: 'SUCCESS',
      emergencyId: activeEmergency.id
    });
  };

  const hospitalTogglePreparationAction = (actionKey: 'bedAllocated' | 'doctorNotified' | 'medicinePrepped' | 'bloodPrepped' | 'roomReady') => {
    if (!activeEmergency) return;

    const currentVal = activeEmergency.preparationSteps?.[actionKey] || false;
    const updated: EmergencyEvent = {
      ...activeEmergency,
      preparationSteps: {
        ...activeEmergency.preparationSteps,
        [actionKey]: !currentVal
      }
    };
    setActiveEmergency(updated);

    addNotification({
      title: `Preparation Step: ${actionKey}`,
      message: `Status updated to ${!currentVal ? 'READY' : 'PENDING'}`,
      type: 'INFO'
    });
  };

  const toggleBedStatus = (hospitalId: string, bedId: string, newStatus: BedStatus) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hospitalId) return h;
      const updatedBeds = h.beds.map(b => b.id === bedId ? { ...b, status: newStatus, lastUpdated: 'Just now' } : b);
      const availableCount = updatedBeds.filter(b => b.status === 'AVAILABLE').length;
      const icuCount = updatedBeds.filter(b => b.type === 'ICU' && b.status === 'AVAILABLE').length;
      const erCount = updatedBeds.filter(b => b.type === 'ER_TRAUMA' && b.status === 'AVAILABLE').length;
      
      return {
        ...h,
        beds: updatedBeds,
        availableBeds: availableCount,
        icuBedsAvailable: icuCount,
        erBedsAvailable: erCount
      };
    }));
  };

  const adminOverrideSeverity = (newSeverity: SeverityLevel, reason: string, adminName: string) => {
    if (!activeEmergency) return;

    const previousSeverity = activeEmergency.aiAssessment.severity;
    const updated: EmergencyEvent = {
      ...activeEmergency,
      aiAssessment: {
        ...activeEmergency.aiAssessment,
        severity: newSeverity,
        clinicalOverride: {
          overriddenBy: adminName,
          previousSeverity,
          newSeverity,
          reason,
          timestamp: new Date().toISOString()
        }
      },
      timeline: [
        ...activeEmergency.timeline,
        {
          status: activeEmergency.status,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Clinical Override by ${adminName}: ${previousSeverity} ➔ ${newSeverity} (${reason})`
        }
      ]
    };

    setActiveEmergency(updated);

    addNotification({
      title: 'AI Classification Overridden',
      message: `Triage updated from ${previousSeverity} to ${newSeverity} by ${adminName}.`,
      type: 'INFO',
      emergencyId: activeEmergency.id
    });
  };

  // Appointments Management with Digital Token Generation
  const bookAppointment = (data: Omit<Appointment, 'id' | 'queueToken' | 'status'>): Appointment => {
    const tokenNumber = Math.floor(10 + Math.random() * 89);
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      queueToken: `#Q-${tokenNumber}`,
      status: 'CONFIRMED',
      remindersEnabled: true
    };
    setAppointments(prev => [newApt, ...prev]);

    addNotification({
      title: `Appointment Confirmed (${newApt.queueToken})`,
      message: `Confirmed with ${data.doctorName} at ${data.hospitalName} for ${data.dateTime}. Digital Queue Token: ${newApt.queueToken}`,
      type: 'APPOINTMENT'
    });

    return newApt;
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' as const } : a));
    addNotification({
      title: 'Appointment Cancelled',
      message: `Appointment ${id} has been cancelled.`,
      type: 'INFO'
    });
  };

  const rescheduleAppointment = (id: string, newDate: string, newSlot: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      date: newDate,
      timeSlot: newSlot,
      dateTime: `${newDate} at ${newSlot}`,
      status: 'RESCHEDULED' as const
    } : a));

    addNotification({
      title: 'Appointment Rescheduled',
      message: `Updated to ${newDate} at ${newSlot}.`,
      type: 'SUCCESS'
    });
  };

  // Medicine Inventory Management
  const addMedicine = (medicine: Omit<MedicineInventoryItem, 'id'>) => {
    const newMed: MedicineInventoryItem = {
      ...medicine,
      id: `med-${Date.now()}`
    };
    setMedicines(prev => [newMed, ...prev]);
    addNotification({
      title: 'Medicine Added to Inventory',
      message: `${medicine.name} (${medicine.quantity} units) logged in ${medicine.location}.`,
      type: 'SUCCESS'
    });
  };

  const updateMedicineStock = (id: string, deltaQuantity: number, type: 'IN' | 'OUT') => {
    setMedicines(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updatedQty = type === 'IN' ? m.quantity + deltaQuantity : Math.max(0, m.quantity - deltaQuantity);
      return { ...m, quantity: updatedQty };
    }));

    addNotification({
      title: `Stock ${type === 'IN' ? 'Restocked' : 'Dispensed'}`,
      message: `${type === 'IN' ? '+' : '-'}${deltaQuantity} units updated.`,
      type: 'INFO'
    });
  };

  const issuePrescriptionMedication = (prescriptionId: string) => {
    addNotification({
      title: 'Prescription Dispensed by Pharmacy',
      message: `Prescription #${prescriptionId} dispensed and ready for patient pickup.`,
      type: 'PRESCRIPTION'
    });
  };

  // Labs & Radiology
  const completeLabReport = (reportId: string, remarks?: string) => {
    setLabReports(prev => prev.map(r => r.id === reportId ? {
      ...r,
      status: 'COMPLETED' as const,
      doctorRemarks: remarks || r.doctorRemarks
    } : r));

    addNotification({
      title: 'Lab Report Verified',
      message: `Diagnostic report #${reportId} signed off by attending pathologist.`,
      type: 'LAB'
    });
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setHospitals(INITIAL_HOSPITALS);
    setAmbulances(INITIAL_AMBULANCES);
    setMedicines(INITIAL_MEDICINE_INVENTORY);
    setActiveEmergency(null);
    setEmergencyHistory([]);
    setAppointments(INITIAL_APPOINTMENTS);
    addNotification({
      title: 'Demo Data Reset',
      message: 'All demo hospitals, fleet status, and test queues have been reset to factory defaults.',
      type: 'INFO'
    });
  };

  return (
    <EmergencyContext.Provider
      value={{
        activeEmergency,
        emergencyHistory,
        hospitals,
        ambulances,
        notifications,
        appointments,
        medicalRecords,
        prescriptions,
        labReports,
        radiologyReports,
        invoices,
        medicines,
        soundEnabled,
        demoMode: true,
        toggleSound,
        markNotificationAsRead,
        clearAllNotifications,
        createEmergencyRequest,
        cancelActiveEmergency,
        driverAcceptDispatch,
        driverRejectDispatch,
        updateEmergencyStatus,
        hospitalAcknowledgePreAlert,
        hospitalTogglePreparationAction,
        toggleBedStatus,
        adminOverrideSeverity,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        addMedicine,
        updateMedicineStock,
        issuePrescriptionMedication,
        completeLabReport,
        resetAllDemoData
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
