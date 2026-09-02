// Domain Models and Types for LifeLink Platform

export type UserRole = 
  | 'PATIENT' 
  | 'HOSPITAL_ADMIN' 
  | 'DOCTOR' 
  | 'NURSE' 
  | 'AMBULANCE_DRIVER' 
  | 'SUPER_ADMIN';

export type SeverityLevel = 'STABLE' | 'URGENT' | 'CRITICAL';

export type EmergencyStatus = 
  | 'REQUESTED'
  | 'VERIFYING'
  | 'DISPATCHING'
  | 'AMBULANCE_ASSIGNED'
  | 'DRIVER_ACCEPTED'
  | 'EN_ROUTE'
  | 'PICKUP'
  | 'PATIENT_ONBOARD'
  | 'HOSPITAL_EN_ROUTE'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type BedCategory = 
  | 'ICU' 
  | 'ER_TRAUMA' 
  | 'GENERAL_WARD' 
  | 'PRIVATE' 
  | 'PEDIATRIC' 
  | 'ISOLATION' 
  | 'OPERATION_THEATRE';

export type BedStatus = 
  | 'AVAILABLE' 
  | 'OCCUPIED' 
  | 'RESERVED' 
  | 'CLEANING' 
  | 'MAINTENANCE';

export type DoctorStatus = 
  | 'ON_DUTY' 
  | 'OFF_DUTY' 
  | 'BUSY' 
  | 'ON_BREAK' 
  | 'EMERGENCY_ONLY';

export type MedicineCategory = 
  | 'Cardiac' 
  | 'Emergency IV' 
  | 'Respiratory' 
  | 'Analgesic' 
  | 'Antibiotic' 
  | 'Anesthesia' 
  | 'Sedative' 
  | 'Neurology' 
  | 'Endocrine';

export interface Vitals {
  heartRate: number; // bpm
  spO2: number; // percentage (e.g. 98)
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  temperature: number; // Fahrenheit
  respiratoryRate?: number; // breaths/min
  gcsScore?: number; // Glasgow Coma Scale (3-15)
  ecgTelemetryStatus?: 'NORMAL_SINUS' | 'ARRHYTHMIA' | 'STEMI_ELEVATION' | 'TACHYCARDIA';
}

export interface AISeverityAssessment {
  severity: SeverityLevel;
  score: number; // 0.0 - 1.0 (XGBoost probability)
  news2Score?: number;
  primaryDiagnosisIntent: string; // BERT extracted clinical intent (e.g., Code STEMI)
  recommendedSpecialty: string;
  icuPreAlertRequired: boolean;
  estimatedWaitTimeMinutes: number;
  confidenceInterval: [number, number];
  bertSymptomsIdentified?: string[];
  explanation?: string;
  timestamp?: string;
  clinicalOverride?: {
    overriddenBy: string;
    previousSeverity: SeverityLevel;
    newSeverity: SeverityLevel;
    reason: string;
    timestamp: string;
  };
}

export interface LocationPoint {
  lat: number;
  lng: number;
  address?: string;
  landmark?: string;
}

export interface TimelineEvent {
  status: EmergencyStatus;
  timestamp: string;
  note?: string;
}

export interface EmergencyEvent {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  patientBloodGroup?: string;
  location: LocationPoint;
  symptoms: string[];
  symptomNotes?: string;
  vitals: Vitals;
  aiAssessment: AISeverityAssessment;
  status: EmergencyStatus;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  etaMinutes?: number;
  etaSecondsRemaining?: number;
  distanceKm?: number;
  hospitalPreAlertAcknowledged?: boolean;
  bedReservedId?: string;
  assignedDoctorName?: string;
  medicinesPrepped?: string[];
  preparationSteps?: {
    bedAllocated?: boolean;
    doctorNotified?: boolean;
    medicinePrepped?: boolean;
    bloodPrepped?: boolean;
    roomReady?: boolean;
  };
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface HospitalBed {
  id: string;
  number: string;
  type: BedCategory;
  status: BedStatus;
  floor: string;
  assignedPatientName?: string;
  attendingDoctor?: string;
  admissionTime?: string;
  lastUpdated: string;
}

export interface DoctorStaff {
  id: string;
  name: string;
  specialty: string;
  department: string;
  shift: string;
  status: DoctorStatus;
  role?: 'DOCTOR' | 'NURSE' | 'HEAD_OF_DEPT' | 'RESIDENT';
  currentPatientsCount: number;
  activeEmergenciesCount: number;
  emergencyAvailable: boolean;
  avatar: string;
  phone: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  smartScore: number; // 0-100 Multi-factor ranking score
  totalBeds: number;
  availableBeds: number;
  icuBedsAvailable: number;
  erBedsAvailable: number;
  currentLoadPercent: number; // 0-100
  estimatedWaitMinutes: number;
  rating: number;
  contactPhone: string;
  contactNumber?: string;
  image?: string;
  isOpen24x7?: boolean;
  etaMinutes?: number;
  recommendedReason?: string;
  departments?: string[];
  specialistsOnDuty?: string[];
  insuranceAccepted?: string[];
  hasTraumaCenterLevel1?: boolean;
  hasBloodBank?: boolean;
  has24x7Pharmacy?: boolean;
  facilities: {
    hasTraumaCenterLevel1: boolean;
    hasCardiacCathLab: boolean;
    hasBloodBank: boolean;
    hasRadiology24x7: boolean;
    hasEmergencyPharmacy24x7: boolean;
    hasHelipad?: boolean;
  };
  specialties: string[];
  doctors: DoctorStaff[];
  beds: HospitalBed[];
}

export interface AmbulanceVehicle {
  id: string;
  plateNumber: string;
  callSign: string;
  type: 'ALS (Advanced Life Support)' | 'BLS (Basic Life Support)' | 'MICU (Mobile ICU)' | 'MICU (Mobile Intensive Care)';
  driverName: string;
  driverPhone: string;
  driverId?: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'EN_ROUTE' | 'AT_SCENE' | 'TRANSPORTING' | 'BUSY' | 'OFFLINE';
  currentLocation: LocationPoint;
  speedKmh: number;
  fuelPercent: number;
  oxygenLevelPercent: number;
  assignedEmergencyId?: string;
  assignedHospitalId?: string;
  todayTripsCount?: number;
  shiftStart?: string;
  equipment?: string[];
}

export interface MedicineInventoryItem {
  id: string;
  name: string;
  category: MedicineCategory;
  quantity: number;
  minQuantity: number;
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  price: number;
  location: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctorName: string;
  hospitalName?: string;
  instructions: string;
  prescribedDate: string;
  refillAvailable?: boolean;
}

export interface LabReport {
  id: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Pathology';
  hospitalName: string;
  doctorName: string;
  date: string;
  status: 'COMPLETED' | 'IN_ANALYSIS' | 'ORDERED';
  resultValues: {
    parameter: string;
    value: string;
    normalRange: string;
    status: 'NORMAL' | 'HIGH' | 'CRITICAL';
  }[];
  doctorRemarks?: string;
}

export interface RadiologyReport {
  id: string;
  scanType: string;
  bodyPart: string;
  hospitalName: string;
  radiologistName: string;
  date: string;
  findings: string;
  impression: string;
  status: 'COMPLETED' | 'PROCESSING';
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  hospitalName: string;
  patientName: string;
  date: string;
  totalCost: number;
  insuranceCoveredAmount: number;
  patientPayableAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'INSURANCE_CLAIM_PROCESSING';
  paymentMethod: string;
  items: {
    description: string;
    department: string;
    cost: number;
  }[];
}

export interface Appointment {
  id: string;
  queueToken: string;
  patientId: string;
  patientName: string;
  hospitalId: string;
  hospitalName: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  dateTime: string;
  type: 'IN_PERSON' | 'TELE_CONSULT';
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  reason: string;
  remindersEnabled?: boolean;
}

export interface MedicalRecord {
  id: string;
  title?: string;
  date: string;
  diagnosis?: string;
  category?: string;
  hospitalName: string;
  doctorName: string;
  vitalsAtDischarge?: Vitals;
  prescription?: string[];
  prescriptions?: PrescriptionItem[];
  labReports?: string[];
  followUpDate?: string;
  dischargeSummary?: string;
  summary?: string;
  documentUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  avatar?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  hospitalId?: string;
  ambulanceId?: string;
  department?: string;
  isActive?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'EMERGENCY' | 'DISPATCH' | 'PRE_ALERT' | 'INFO' | 'SUCCESS' | 'APPOINTMENT' | 'PRESCRIPTION' | 'LAB';
  timestamp: string;
  read: boolean;
  emergencyId?: string;
}

export interface AICapacityForecast {
  hour: string;
  loadPercent: number;
  status: 'NORMAL' | 'HIGH_DEMAND' | 'CRITICAL_SURGE';
  estimatedArrivals?: number;
}
