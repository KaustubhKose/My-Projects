import { 
  Hospital, 
  AmbulanceVehicle, 
  User, 
  Appointment, 
  MedicalRecord, 
  PrescriptionItem, 
  LabReport, 
  RadiologyReport, 
  BillingInvoice, 
  MedicineInventoryItem, 
  EmergencyEvent,
  AICapacityForecast 
} from '../types';

// ==========================================
// 1. DEMO USERS (Indian Demographics & Roles)
// ==========================================
export const DEMO_USERS: User[] = [
  {
    id: 'usr-patient-1',
    email: 'patient@lifelink.demo',
    role: 'PATIENT',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bloodGroup: 'O+',
    emergencyContact: 'Priya Sharma (+91 98765 11223 - Wife)',
    insuranceProvider: 'Star Health Comprehensive MediClassic (#SH-99042)',
    isActive: true
  },
  {
    id: 'usr-hosp-admin-1',
    email: 'hospital@lifelink.demo',
    role: 'HOSPITAL_ADMIN',
    name: 'Dr. Sarah Vance',
    phone: '+91 91234 56780',
    avatar: 'https://images.unsplash.com/photo-1594824813629-9e8c7512411e?w=150',
    hospitalId: 'hosp-1',
    isActive: true
  },
  {
    id: 'usr-doctor-1',
    email: 'doctor@lifelink.demo',
    role: 'DOCTOR',
    name: 'Dr. Rajesh Verma',
    phone: '+91 98201 23456',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    hospitalId: 'hosp-1',
    department: 'Cardiology & Cath Lab',
    isActive: true
  },
  {
    id: 'usr-nurse-1',
    email: 'nurse@lifelink.demo',
    role: 'NURSE',
    name: 'Sister Anjali Nair',
    phone: '+91 98332 98765',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    hospitalId: 'hosp-1',
    isActive: true
  },
  {
    id: 'usr-driver-1',
    email: 'driver@lifelink.demo',
    role: 'AMBULANCE_DRIVER',
    name: 'Rajesh Kumar (Driver Raj)',
    phone: '+91 97110 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ambulanceId: 'amb-1',
    isActive: true
  },
  {
    id: 'usr-admin-1',
    email: 'admin@lifelink.demo',
    role: 'SUPER_ADMIN',
    name: 'Vikramaditya Singhania',
    phone: '+91 99000 88888',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isActive: true
  }
];

// =======================================================
// 2. PREMIER HOSPITALS (5+ Major Indian Tertiary Centers)
// =======================================================
export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Apollo Indraprastha & Trauma Institute',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    lat: 28.5355,
    lng: 77.2910,
    distanceKm: 2.3,
    smartScore: 97,
    totalBeds: 240,
    availableBeds: 34,
    icuBedsAvailable: 6,
    erBedsAvailable: 9,
    currentLoadPercent: 68,
    estimatedWaitMinutes: 7,
    rating: 4.9,
    contactPhone: '+91 11 2692 5858',
    facilities: {
      hasTraumaCenterLevel1: true,
      hasCardiacCathLab: true,
      hasBloodBank: true,
      hasRadiology24x7: true,
      hasEmergencyPharmacy24x7: true,
      hasHelipad: true
    },
    specialties: ['Cardiology', 'Trauma Surgery', 'Neurology', 'Critical Care', 'Pediatrics'],
    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Rajesh Verma',
        specialty: 'Interventional Cardiologist',
        department: 'Cardiology & Cath Lab',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 3,
        activeEmergenciesCount: 1,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        phone: '+91 98201 23456'
      },
      {
        id: 'doc-2',
        name: 'Dr. Priya Patel',
        specialty: 'Trauma & Emergency Lead',
        department: 'Emergency & Trauma',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 4,
        activeEmergenciesCount: 2,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1594824813629-9e8c7512411e?w=150',
        phone: '+91 98201 77889'
      },
      {
        id: 'doc-3',
        name: 'Dr. Arvind Swamy',
        specialty: 'Neurosurgeon & Stroke Lead',
        department: 'Neurology & Stroke',
        shift: '16:00 - 00:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
        phone: '+91 98201 99112'
      },
      {
        id: 'doc-4',
        name: 'Dr. Ananya Sen',
        specialty: 'Pediatric Critical Care Specialist',
        department: 'Pediatrics',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        phone: '+91 98201 33445'
      }
    ],
    beds: [
      { id: 'b-icu-101', number: 'ICU-101 (Ventilator Bay)', type: 'ICU', status: 'AVAILABLE', floor: '3rd Floor East', lastUpdated: '3 mins ago' },
      { id: 'b-icu-102', number: 'ICU-102', type: 'ICU', status: 'AVAILABLE', floor: '3rd Floor East', lastUpdated: '10 mins ago' },
      { id: 'b-icu-103', number: 'ICU-103', type: 'ICU', status: 'OCCUPIED', floor: '3rd Floor East', assignedPatientName: 'Amit Saxena', admissionTime: '06:30 AM', attendingDoctor: 'Dr. Rajesh Verma', lastUpdated: '1 hour ago' },
      { id: 'b-er-201', number: 'ER-BAY-1 (STAT Resuscitation)', type: 'ER_TRAUMA', status: 'AVAILABLE', floor: 'Ground Floor ER', lastUpdated: 'Just now' },
      { id: 'b-er-202', number: 'ER-BAY-2', type: 'ER_TRAUMA', status: 'AVAILABLE', floor: 'Ground Floor ER', lastUpdated: '5 mins ago' },
      { id: 'b-er-203', number: 'ER-BAY-3', type: 'ER_TRAUMA', status: 'OCCUPIED', floor: 'Ground Floor ER', assignedPatientName: 'Sanjay Dutt', admissionTime: '08:15 AM', attendingDoctor: 'Dr. Priya Patel', lastUpdated: '25 mins ago' },
      { id: 'b-gw-301', number: 'GW-301 (General Ward)', type: 'GENERAL_WARD', status: 'AVAILABLE', floor: '2nd Floor North', lastUpdated: '12 mins ago' },
      { id: 'b-ot-401', number: 'OT-CARDIAC-1', type: 'OPERATION_THEATRE', status: 'AVAILABLE', floor: '4th Floor OT', lastUpdated: '8 mins ago' },
      { id: 'b-iso-501', number: 'ISO-501 (Negative Pressure)', type: 'ISOLATION', status: 'AVAILABLE', floor: '5th Floor Wing B', lastUpdated: '1 hour ago' }
    ]
  },
  {
    id: 'hosp-2',
    name: 'Fortis Memorial Research Institute & Cardiac Center',
    address: 'Sector 44, Gurugram, NCR',
    lat: 28.4595,
    lng: 77.0725,
    distanceKm: 3.8,
    smartScore: 93,
    totalBeds: 280,
    availableBeds: 42,
    icuBedsAvailable: 7,
    erBedsAvailable: 11,
    currentLoadPercent: 62,
    estimatedWaitMinutes: 10,
    rating: 4.8,
    contactPhone: '+91 124 4962200',
    facilities: {
      hasTraumaCenterLevel1: true,
      hasCardiacCathLab: true,
      hasBloodBank: true,
      hasRadiology24x7: true,
      hasEmergencyPharmacy24x7: true,
      hasHelipad: true
    },
    specialties: ['Cardiology', 'Oncology', 'Organ Transplant', 'Trauma'],
    doctors: [
      {
        id: 'doc-5',
        name: 'Dr. Rohan Mehra',
        specialty: 'Chief Cardiologist',
        department: 'Cardiology',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 5,
        activeEmergenciesCount: 1,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        phone: '+91 98111 22334'
      },
      {
        id: 'doc-6',
        name: 'Dr. Sunita Rao',
        specialty: 'Emergency Physician',
        department: 'Emergency & Trauma',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 3,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1594824813629-9e8c7512411e?w=150',
        phone: '+91 98111 33445'
      },
      {
        id: 'doc-7',
        name: 'Dr. Sanjay Gupta',
        specialty: 'Orthopedic Surgeon',
        department: 'Orthopedics',
        shift: '16:00 - 00:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
        phone: '+91 98111 44556'
      },
      {
        id: 'doc-8',
        name: 'Dr. Kavita Nair',
        specialty: 'Neurologist',
        department: 'Neurology',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 1,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        phone: '+91 98111 55667'
      }
    ],
    beds: [
      { id: 'b-f-icu-1', number: 'ICU-B1', type: 'ICU', status: 'AVAILABLE', floor: '2nd Floor ICU', lastUpdated: '15 mins ago' },
      { id: 'b-f-er-1', number: 'ER-T1', type: 'ER_TRAUMA', status: 'AVAILABLE', floor: 'Ground Floor ER', lastUpdated: '5 mins ago' }
    ]
  },
  {
    id: 'hosp-3',
    name: 'AIIMS Apex Trauma Center & Multi-Specialty',
    address: 'Ring Road, Ansari Nagar, New Delhi',
    lat: 28.5672,
    lng: 77.2100,
    distanceKm: 5.1,
    smartScore: 91,
    totalBeds: 350,
    availableBeds: 48,
    icuBedsAvailable: 8,
    erBedsAvailable: 14,
    currentLoadPercent: 78,
    estimatedWaitMinutes: 14,
    rating: 4.9,
    contactPhone: '+91 11 2659 8700',
    facilities: {
      hasTraumaCenterLevel1: true,
      hasCardiacCathLab: true,
      hasBloodBank: true,
      hasRadiology24x7: true,
      hasEmergencyPharmacy24x7: true,
      hasHelipad: true
    },
    specialties: ['Level 1 Trauma', 'Cardiac Surgery', 'Neurosurgery', 'Toxicology', 'Burns'],
    doctors: [
      {
        id: 'doc-9',
        name: 'Dr. Alok Nath',
        specialty: 'Trauma Surgeon',
        department: 'Apex Trauma',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 6,
        activeEmergenciesCount: 2,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        phone: '+91 98700 11223'
      },
      {
        id: 'doc-10',
        name: 'Dr. Meenakshi Sundaram',
        specialty: 'Anesthesiologist & Critical Care',
        department: 'Critical Care',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 4,
        activeEmergenciesCount: 1,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1594824813629-9e8c7512411e?w=150',
        phone: '+91 98700 22334'
      },
      {
        id: 'doc-11',
        name: 'Dr. Devendra Joshi',
        specialty: 'Vascular Surgeon',
        department: 'Vascular Surgery',
        shift: '16:00 - 00:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
        phone: '+91 98700 33445'
      },
      {
        id: 'doc-12',
        name: 'Dr. Shilpa Shetty-Vora',
        specialty: 'Radiologist',
        department: 'Radiology',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 3,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        phone: '+91 98700 44556'
      }
    ],
    beds: [
      { id: 'b-ai-icu-1', number: 'AIIMS-ICU-01', type: 'ICU', status: 'AVAILABLE', floor: '1st Floor Trauma ICU', lastUpdated: '12 mins ago' }
    ]
  },
  {
    id: 'hosp-4',
    name: 'Manipal Academic Heart & Multi-Care Hospital',
    address: 'Old Airport Road, Kodihalli, Bengaluru',
    lat: 12.9592,
    lng: 77.6534,
    distanceKm: 6.4,
    smartScore: 89,
    totalBeds: 210,
    availableBeds: 31,
    icuBedsAvailable: 4,
    erBedsAvailable: 7,
    currentLoadPercent: 70,
    estimatedWaitMinutes: 12,
    rating: 4.7,
    contactPhone: '+91 80 2502 4444',
    facilities: {
      hasTraumaCenterLevel1: true,
      hasCardiacCathLab: true,
      hasBloodBank: true,
      hasRadiology24x7: true,
      hasEmergencyPharmacy24x7: true,
      hasHelipad: false
    },
    specialties: ['Cardiology', 'Pediatrics', 'Gastroenterology', 'Urology'],
    doctors: [
      {
        id: 'doc-13',
        name: 'Dr. Girish Pillai',
        specialty: 'Senior Cardiologist',
        department: 'Cardiology',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 3,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        phone: '+91 98450 12345'
      },
      {
        id: 'doc-14',
        name: 'Dr. Deepa Nair',
        specialty: 'Pediatric Lead',
        department: 'Pediatrics',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1594824813629-9e8c7512411e?w=150',
        phone: '+91 98450 23456'
      },
      {
        id: 'doc-15',
        name: 'Dr. Naveen Hegde',
        specialty: 'Gastroenterologist',
        department: 'Gastroenterology',
        shift: '16:00 - 00:00',
        status: 'ON_DUTY',
        currentPatientsCount: 1,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
        phone: '+91 98450 34567'
      },
      {
        id: 'doc-16',
        name: 'Dr. Swati Rao',
        specialty: 'ER Specialist',
        department: 'Emergency & Trauma',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 4,
        activeEmergenciesCount: 1,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        phone: '+91 98450 45678'
      }
    ],
    beds: [
      { id: 'b-man-icu-1', number: 'MAN-ICU-3', type: 'ICU', status: 'AVAILABLE', floor: '3rd Floor', lastUpdated: '20 mins ago' }
    ]
  },
  {
    id: 'hosp-5',
    name: 'Max Super Specialty & Acute Care Center',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi',
    lat: 28.5273,
    lng: 77.2144,
    distanceKm: 7.2,
    smartScore: 88,
    totalBeds: 260,
    availableBeds: 36,
    icuBedsAvailable: 5,
    erBedsAvailable: 8,
    currentLoadPercent: 65,
    estimatedWaitMinutes: 11,
    rating: 4.8,
    contactPhone: '+91 11 2651 5050',
    facilities: {
      hasTraumaCenterLevel1: true,
      hasCardiacCathLab: true,
      hasBloodBank: true,
      hasRadiology24x7: true,
      hasEmergencyPharmacy24x7: true,
      hasHelipad: true
    },
    specialties: ['Cardiology', 'Pulmonology', 'Nephrology', 'Critical Care'],
    doctors: [
      {
        id: 'doc-17',
        name: 'Dr. Pradeep Chowbey',
        specialty: 'Minimal Access Surgeon',
        department: 'Surgery',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        phone: '+91 98100 55667'
      },
      {
        id: 'doc-18',
        name: 'Dr. Vivek Raj',
        specialty: 'Pulmonologist',
        department: 'Pulmonology',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 3,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1594824813629-9e8c7512411e?w=150',
        phone: '+91 98100 66778'
      },
      {
        id: 'doc-19',
        name: 'Dr. Aarti Batra',
        specialty: 'Nephrologist',
        department: 'Nephrology',
        shift: '16:00 - 00:00',
        status: 'ON_DUTY',
        currentPatientsCount: 2,
        activeEmergenciesCount: 0,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
        phone: '+91 98100 77889'
      },
      {
        id: 'doc-20',
        name: 'Dr. Sameer Bhati',
        specialty: 'Emergency Physician',
        department: 'Emergency & Trauma',
        shift: '08:00 - 16:00',
        status: 'ON_DUTY',
        currentPatientsCount: 4,
        activeEmergenciesCount: 1,
        emergencyAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        phone: '+91 98100 88990'
      }
    ],
    beds: [
      { id: 'b-max-icu-1', number: 'MAX-ICU-10', type: 'ICU', status: 'AVAILABLE', floor: '4th Floor', lastUpdated: '10 mins ago' }
    ]
  }
];

// ============================================================
// 3. AMBULANCE FLEET (10+ GPS-Enabled Units with Indian Plates)
// ============================================================
export const INITIAL_AMBULANCES: AmbulanceVehicle[] = [
  {
    id: 'amb-1',
    plateNumber: 'MH-02-ER-9104',
    callSign: 'Rescue Alpha-1 (ALS)',
    type: 'ALS (Advanced Life Support)',
    driverName: 'Rajesh Kumar (Driver Raj)',
    driverPhone: '+91 97110 44556',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5380, lng: 77.2890 },
    speedKmh: 0,
    fuelPercent: 92,
    oxygenLevelPercent: 98,
    todayTripsCount: 4,
    shiftStart: '07:00 AM'
  },
  {
    id: 'amb-2',
    plateNumber: 'DL-01-AMB-4421',
    callSign: 'Cardiac Cruiser-2 (MICU)',
    type: 'MICU (Mobile Intensive Care)',
    driverName: 'Amit Patel',
    driverPhone: '+91 97110 55667',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5320, lng: 77.2950 },
    speedKmh: 0,
    fuelPercent: 88,
    oxygenLevelPercent: 95,
    todayTripsCount: 6,
    shiftStart: '07:00 AM'
  },
  {
    id: 'amb-3',
    plateNumber: 'KA-03-MED-8891',
    callSign: 'Apex Rapid-3 (ALS)',
    type: 'ALS (Advanced Life Support)',
    driverName: 'Vikram Singh',
    driverPhone: '+91 97110 66778',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5410, lng: 77.2850 },
    speedKmh: 0,
    fuelPercent: 94,
    oxygenLevelPercent: 99,
    todayTripsCount: 3,
    shiftStart: '08:00 AM'
  },
  {
    id: 'amb-4',
    plateNumber: 'MH-12-EM-2244',
    callSign: 'Trauma Unit-4 (BLS)',
    type: 'BLS (Basic Life Support)',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 97110 77889',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.4620, lng: 77.0750 },
    speedKmh: 0,
    fuelPercent: 78,
    oxygenLevelPercent: 90,
    todayTripsCount: 5,
    shiftStart: '06:00 AM'
  },
  {
    id: 'amb-5',
    plateNumber: 'GJ-01-LS-7711',
    callSign: 'LifeSaver-5 (ALS)',
    type: 'ALS (Advanced Life Support)',
    driverName: 'Arjun Verma',
    driverPhone: '+91 97110 88990',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5690, lng: 77.2120 },
    speedKmh: 0,
    fuelPercent: 85,
    oxygenLevelPercent: 96,
    todayTripsCount: 2,
    shiftStart: '08:00 AM'
  },
  {
    id: 'amb-6',
    plateNumber: 'TS-09-ER-5512',
    callSign: 'Metro Squad-6 (MICU)',
    type: 'MICU (Mobile Intensive Care)',
    driverName: 'Deepak Chopra',
    driverPhone: '+91 97110 99001',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5290, lng: 77.2160 },
    speedKmh: 0,
    fuelPercent: 90,
    oxygenLevelPercent: 97,
    todayTripsCount: 4,
    shiftStart: '07:30 AM'
  },
  {
    id: 'amb-7',
    plateNumber: 'TN-01-AMB-3341',
    callSign: 'Express ER-7 (ALS)',
    type: 'ALS (Advanced Life Support)',
    driverName: 'Manoj Bajpayee',
    driverPhone: '+91 97110 11223',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5450, lng: 77.2990 },
    speedKmh: 0,
    fuelPercent: 82,
    oxygenLevelPercent: 94,
    todayTripsCount: 3,
    shiftStart: '08:00 AM'
  },
  {
    id: 'amb-8',
    plateNumber: 'WB-02-ER-9910',
    callSign: 'Cardiac Rescue-8 (MICU)',
    type: 'MICU (Mobile Intensive Care)',
    driverName: 'Kunal Roy',
    driverPhone: '+91 97110 22334',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.4680, lng: 77.0690 },
    speedKmh: 0,
    fuelPercent: 96,
    oxygenLevelPercent: 100,
    todayTripsCount: 5,
    shiftStart: '07:00 AM'
  },
  {
    id: 'amb-9',
    plateNumber: 'HR-26-EMS-1188',
    callSign: 'Guardian ALS-9',
    type: 'ALS (Advanced Life Support)',
    driverName: 'Ravi Teja',
    driverPhone: '+91 97110 33445',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5720, lng: 77.2080 },
    speedKmh: 0,
    fuelPercent: 75,
    oxygenLevelPercent: 91,
    todayTripsCount: 4,
    shiftStart: '06:30 AM'
  },
  {
    id: 'amb-10',
    plateNumber: 'UP-16-AMB-6602',
    callSign: 'Silver Line-10 (BLS)',
    type: 'BLS (Basic Life Support)',
    driverName: 'Harpreet Singh',
    driverPhone: '+91 97110 44556',
    status: 'AVAILABLE',
    currentLocation: { lat: 28.5310, lng: 77.2200 },
    speedKmh: 0,
    fuelPercent: 91,
    oxygenLevelPercent: 98,
    todayTripsCount: 2,
    shiftStart: '08:30 AM'
  }
];

// =================================================================
// 4. MEDICINE INVENTORY (50+ Emergency Drugs with ₹ INR Pricing)
// =================================================================
export const INITIAL_MEDICINE_INVENTORY: MedicineInventoryItem[] = [
  { id: 'med-01', name: 'Aspirin 325mg (Chewable Dispersible)', category: 'Cardiac', quantity: 340, minQuantity: 100, batchNumber: 'ASP-2026-IND-01', expiryDate: '2028-12-31', supplier: 'Sun Pharma Healthcare', price: 45.00, location: 'Rack A-12' },
  { id: 'med-02', name: 'IV Heparin Sodium 5000 IU/ml', category: 'Cardiac', quantity: 45, minQuantity: 50, batchNumber: 'HEP-990-21', expiryDate: '2027-08-15', supplier: 'Cipla Critical Care', price: 420.00, location: 'Vault C-02' },
  { id: 'med-03', name: 'Sublingual Nitroglycerin 0.4mg', category: 'Cardiac', quantity: 180, minQuantity: 60, batchNumber: 'NTG-441-A', expiryDate: '2028-04-30', supplier: 'Dr. Reddy\'s Labs', price: 160.00, location: 'Rack A-14' },
  { id: 'med-04', name: 'IV Atropine Sulphate 0.6mg/ml', category: 'Emergency IV', quantity: 95, minQuantity: 40, batchNumber: 'ATR-2026-09', expiryDate: '2028-10-31', supplier: 'Lupin Pharma', price: 85.00, location: 'Rack B-01' },
  { id: 'med-05', name: 'IV Epinephrine (Adrenaline) 1mg/ml (1:1000)', category: 'Emergency IV', quantity: 110, minQuantity: 50, batchNumber: 'EPI-STAT-88', expiryDate: '2027-11-20', supplier: 'Cadila MedTech', price: 195.00, location: 'Emergency Crash Cart' },
  { id: 'med-06', name: 'IV Amiodarone 150mg/3ml', category: 'Cardiac', quantity: 60, minQuantity: 30, batchNumber: 'AMD-332-B', expiryDate: '2027-09-12', supplier: 'Sun Pharma', price: 340.00, location: 'Rack A-05' },
  { id: 'med-07', name: 'IV Furosemide (Lasix) 20mg/2ml', category: 'Emergency IV', quantity: 140, minQuantity: 50, batchNumber: 'FUR-880-99', expiryDate: '2028-06-30', supplier: 'Sanofi India', price: 65.00, location: 'Rack B-04' },
  { id: 'med-08', name: 'IV Dextrose 50% 100ml Solution', category: 'Emergency IV', quantity: 75, minQuantity: 40, batchNumber: 'DEX-50-2026', expiryDate: '2028-03-31', supplier: 'Baxter India', price: 120.00, location: 'Infusion Shelf 1' },
  { id: 'med-09', name: 'IV Morphine Sulphate 10mg/ml', category: 'Analgesic', quantity: 28, minQuantity: 30, batchNumber: 'MOR-NARCO-01', expiryDate: '2027-12-31', supplier: 'Government Opium & Alkaloid Works', price: 550.00, location: 'Double-Locked Narcotic Vault' },
  { id: 'med-10', name: 'IV Fentanyl Citrate 100mcg/2ml', category: 'Analgesic', quantity: 22, minQuantity: 25, batchNumber: 'FNT-NARCO-09', expiryDate: '2028-01-15', supplier: 'Troikaa Pharma', price: 620.00, location: 'Double-Locked Narcotic Vault' },
  { id: 'med-11', name: 'Nebulized Salbutamol (Albuterol) 2.5mg', category: 'Respiratory', quantity: 260, minQuantity: 80, batchNumber: 'SAL-RESP-11', expiryDate: '2028-07-20', supplier: 'Cipla Respiratory', price: 35.00, location: 'Respiratory Cart' },
  { id: 'med-12', name: 'Nebulized Ipratropium Bromide 0.5mg', category: 'Respiratory', quantity: 190, minQuantity: 60, batchNumber: 'IPR-RESP-44', expiryDate: '2028-05-15', supplier: 'Cipla Respiratory', price: 55.00, location: 'Respiratory Cart' },
  { id: 'med-13', name: 'IV Hydrocortisone 100mg', category: 'Emergency IV', quantity: 85, minQuantity: 40, batchNumber: 'HYD-STAT-77', expiryDate: '2027-10-31', supplier: 'Abbott Healthcare', price: 110.00, location: 'Rack B-08' },
  { id: 'med-14', name: 'IV Methylprednisolone 1000mg Pulse', category: 'Emergency IV', quantity: 30, minQuantity: 20, batchNumber: 'MPS-PULSE-02', expiryDate: '2028-02-28', supplier: 'Pfizer India', price: 1450.00, location: 'Rack B-09' },
  { id: 'med-15', name: 'IV Ceftriaxone 1g (Rocephin)', category: 'Antibiotic', quantity: 220, minQuantity: 80, batchNumber: 'CEF-ANT-90', expiryDate: '2028-09-30', supplier: 'Alkem Laboratories', price: 180.00, location: 'Antibiotic Bay 1' },
  { id: 'med-16', name: 'IV Meropenem 1g (Stat Antibiotic)', category: 'Antibiotic', quantity: 90, minQuantity: 40, batchNumber: 'MER-ANT-55', expiryDate: '2028-08-31', supplier: 'AstraZeneca India', price: 950.00, location: 'Antibiotic Bay 2' },
  { id: 'med-17', name: 'IV Piperacillin + Tazobactam 4.5g', category: 'Antibiotic', quantity: 130, minQuantity: 50, batchNumber: 'PTZ-ANT-21', expiryDate: '2028-11-30', supplier: 'Cipla Critical Care', price: 480.00, location: 'Antibiotic Bay 1' },
  { id: 'med-18', name: 'IV Vancomycin 500mg', category: 'Antibiotic', quantity: 70, minQuantity: 35, batchNumber: 'VAN-ANT-14', expiryDate: '2027-12-15', supplier: 'Eli Lilly India', price: 520.00, location: 'Antibiotic Bay 2' },
  { id: 'med-19', name: 'IV Paracetamol (Acetaminophen) 1000mg/100ml', category: 'Analgesic', quantity: 310, minQuantity: 100, batchNumber: 'PCM-IV-88', expiryDate: '2029-01-31', supplier: 'Mankind Pharma', price: 190.00, location: 'Infusion Shelf 2' },
  { id: 'med-20', name: 'IV Tramadol 50mg/ml', category: 'Analgesic', quantity: 140, minQuantity: 50, batchNumber: 'TRM-ANAL-66', expiryDate: '2028-06-30', supplier: 'Sun Pharma', price: 75.00, location: 'Rack C-04' },
  { id: 'med-21', name: 'IV Ondansetron (Zofran) 4mg/2ml', category: 'Emergency IV', quantity: 280, minQuantity: 90, batchNumber: 'OND-ANTI-99', expiryDate: '2028-12-31', supplier: 'GlaxoSmithKline India', price: 42.00, location: 'Rack B-12' },
  { id: 'med-22', name: 'IV Pantoprazole 40mg', category: 'Emergency IV', quantity: 290, minQuantity: 100, batchNumber: 'PAN-STAT-33', expiryDate: '2028-11-30', supplier: 'Torrent Pharma', price: 85.00, location: 'Rack B-13' },
  { id: 'med-23', name: 'IV Tranexamic Acid 500mg/5ml', category: 'Emergency IV', quantity: 65, minQuantity: 30, batchNumber: 'TXA-TRAUMA-11', expiryDate: '2028-04-30', supplier: 'Macleods Pharma', price: 210.00, location: 'Trauma Crash Bay' },
  { id: 'med-24', name: 'IV Noradrenaline (Norepinephrine) 4mg/2ml', category: 'Emergency IV', quantity: 95, minQuantity: 40, batchNumber: 'NOR-VASO-04', expiryDate: '2027-10-15', supplier: 'Samarth Life Sciences', price: 380.00, location: 'ICU Vasopressor Fridge' },
  { id: 'med-25', name: 'IV Dobutamine 250mg/20ml', category: 'Cardiac', quantity: 50, minQuantity: 25, batchNumber: 'DOB-VASO-88', expiryDate: '2027-09-30', supplier: 'Viatris Healthcare', price: 440.00, location: 'ICU Vasopressor Fridge' },
  { id: 'med-26', name: 'IV Dopamine 200mg/5ml', category: 'Cardiac', quantity: 55, minQuantity: 25, batchNumber: 'DOP-VASO-99', expiryDate: '2027-11-30', supplier: 'Fresenius Kabi', price: 220.00, location: 'ICU Vasopressor Fridge' },
  { id: 'med-27', name: 'IV Adenosine 6mg/2ml (Rapid Push)', category: 'Cardiac', quantity: 40, minQuantity: 20, batchNumber: 'ADN-STAT-77', expiryDate: '2028-03-31', supplier: 'Wockhardt Pharma', price: 580.00, location: 'Cath Lab Tray' },
  { id: 'med-28', name: 'IV Midazolam 5mg/ml', category: 'Sedative', quantity: 48, minQuantity: 25, batchNumber: 'MID-SED-12', expiryDate: '2028-01-31', supplier: 'Neon Labs', price: 135.00, location: 'Sedation Drawer' },
  { id: 'med-29', name: 'IV Propofol 1% 20ml Emulsion', category: 'Anesthesia', quantity: 60, minQuantity: 30, batchNumber: 'PRO-ANES-88', expiryDate: '2027-12-15', supplier: 'Bharat Serums', price: 320.00, location: 'Anesthesia Fridge' },
  { id: 'med-30', name: 'IV Succinylcholine 100mg/2ml', category: 'Anesthesia', quantity: 40, minQuantity: 20, batchNumber: 'SUC-RSI-01', expiryDate: '2027-08-31', supplier: 'Themis Medicare', price: 160.00, location: 'RSI Rapid Sequence Kit' },
  { id: 'med-31', name: 'IV Rocuronium Bromide 50mg/5ml', category: 'Anesthesia', quantity: 35, minQuantity: 20, batchNumber: 'ROC-RSI-02', expiryDate: '2028-02-28', supplier: 'Organon India', price: 890.00, location: 'RSI Rapid Sequence Kit' },
  { id: 'med-32', name: 'IV Calcium Gluconate 10% 10ml', category: 'Emergency IV', quantity: 80, minQuantity: 30, batchNumber: 'CAL-GLU-55', expiryDate: '2028-10-31', supplier: 'Swiss Garnier', price: 75.00, location: 'Rack B-15' },
  { id: 'med-33', name: 'IV Sodium Bicarbonate 8.4% 25ml', category: 'Emergency IV', quantity: 90, minQuantity: 35, batchNumber: 'SOD-BIC-44', expiryDate: '2028-07-31', supplier: 'Denis Chem Lab', price: 95.00, location: 'Rack B-16' },
  { id: 'med-34', name: 'IV Magnesium Sulphate 50% 2ml', category: 'Emergency IV', quantity: 70, minQuantity: 30, batchNumber: 'MAG-SUL-99', expiryDate: '2028-09-30', supplier: 'Troikaa Pharma', price: 50.00, location: 'Obstetric/Cardiac Bay' },
  { id: 'med-35', name: 'IV Mannitol 20% 100ml Infusion', category: 'Emergency IV', quantity: 85, minQuantity: 30, batchNumber: 'MAN-ICP-10', expiryDate: '2028-06-30', supplier: 'Otsuka Pharma', price: 140.00, location: 'Neuro Trauma Bay' },
  { id: 'med-36', name: 'IV Levetiracetam (Keppra) 500mg/5ml', category: 'Neurology', quantity: 65, minQuantity: 25, batchNumber: 'LEV-SEIZ-08', expiryDate: '2028-05-31', supplier: 'UCB India', price: 420.00, location: 'Neuro Bay' },
  { id: 'med-37', name: 'IV Phenytoin Sodium 100mg/2ml', category: 'Neurology', quantity: 50, minQuantity: 25, batchNumber: 'PHT-SEIZ-11', expiryDate: '2027-11-30', supplier: 'Abbott Healthcare', price: 110.00, location: 'Neuro Bay' },
  { id: 'med-38', name: 'IV Diazepam 10mg/2ml (Calmpose)', category: 'Neurology', quantity: 80, minQuantity: 30, batchNumber: 'DIA-STAT-99', expiryDate: '2028-04-30', supplier: 'Ranbaxy Labs', price: 65.00, location: 'Sedation Drawer' },
  { id: 'med-39', name: 'IV Labetalol 20mg/4ml', category: 'Cardiac', quantity: 45, minQuantity: 20, batchNumber: 'LAB-HTN-33', expiryDate: '2028-03-31', supplier: 'Samarth Pharma', price: 280.00, location: 'Rack A-18' },
  { id: 'med-40', name: 'IV Nitroglycerin Infusion 25mg/5ml', category: 'Cardiac', quantity: 40, minQuantity: 20, batchNumber: 'NTG-INF-22', expiryDate: '2028-08-31', supplier: 'Neon Labs', price: 490.00, location: 'ICU Cardiac Tray' },
  { id: 'med-41', name: 'IV Tenecteplase 40mg (Thrombolytic)', category: 'Cardiac', quantity: 12, minQuantity: 10, batchNumber: 'TNK-LYSE-01', expiryDate: '2027-09-30', supplier: 'Boehringer Ingelheim', price: 28500.00, location: 'Cath Lab Thrombolytic Vault' },
  { id: 'med-42', name: 'IV Alteplase (r-tPA) 50mg (Stroke Thrombolytic)', category: 'Neurology', quantity: 8, minQuantity: 6, batchNumber: 'ALT-STROKE-02', expiryDate: '2027-10-31', supplier: 'Genentech / Roche', price: 42000.00, location: 'Stroke Rescue Vault' },
  { id: 'med-43', name: 'IV Human Albumin 20% 100ml', category: 'Emergency IV', quantity: 24, minQuantity: 15, batchNumber: 'ALB-PLASMA-99', expiryDate: '2028-01-31', supplier: 'Reliance Life Sciences', price: 3800.00, location: 'Plasma Bank Fridge' },
  { id: 'med-44', name: 'IV Normal Saline 0.9% 500ml', category: 'Emergency IV', quantity: 650, minQuantity: 200, batchNumber: 'NS-500-2026', expiryDate: '2029-06-30', supplier: 'Aculife Healthcare', price: 45.00, location: 'Main IV Stockroom' },
  { id: 'med-45', name: 'IV Ringer Lactate (RL) 500ml', category: 'Emergency IV', quantity: 580, minQuantity: 200, batchNumber: 'RL-500-2026', expiryDate: '2029-06-30', supplier: 'Aculife Healthcare', price: 50.00, location: 'Main IV Stockroom' },
  { id: 'med-46', name: 'IV Potassium Chloride (KCl) 15% 10ml', category: 'Emergency IV', quantity: 95, minQuantity: 40, batchNumber: 'KCL-ELECT-09', expiryDate: '2028-07-31', supplier: 'Denis Chem', price: 35.00, location: 'Electrolyte Vault' },
  { id: 'med-47', name: 'Amlodipine 5mg Tablets', category: 'Cardiac', quantity: 500, minQuantity: 150, batchNumber: 'AML-TAB-99', expiryDate: '2028-12-31', supplier: 'Sun Pharma', price: 65.00, location: 'Outpatient Pharmacy Rack 4' },
  { id: 'med-48', name: 'Atorvastatin 20mg Tablets', category: 'Cardiac', quantity: 450, minQuantity: 150, batchNumber: 'ATO-TAB-88', expiryDate: '2028-12-31', supplier: 'Zydus Cadila', price: 120.00, location: 'Outpatient Pharmacy Rack 4' },
  { id: 'med-49', name: 'Metformin 500mg (Glycomet)', category: 'Endocrine', quantity: 600, minQuantity: 200, batchNumber: 'MET-TAB-77', expiryDate: '2029-02-28', supplier: 'USV Pharma', price: 40.00, location: 'Outpatient Pharmacy Rack 2' },
  { id: 'med-50', name: 'Telmisartan 40mg Tablets', category: 'Cardiac', quantity: 420, minQuantity: 120, batchNumber: 'TEL-TAB-44', expiryDate: '2028-10-31', supplier: 'Glenmark Pharma', price: 95.00, location: 'Outpatient Pharmacy Rack 4' },
  { id: 'med-51', name: 'Clopidogrel 75mg Tablets (Plavix)', category: 'Cardiac', quantity: 380, minQuantity: 100, batchNumber: 'CLP-TAB-11', expiryDate: '2028-09-30', supplier: 'Sanofi India', price: 140.00, location: 'Outpatient Pharmacy Rack 4' },
  { id: 'med-52', name: 'IV Pantoprazole 40mg Infusion', category: 'Emergency IV', quantity: 210, minQuantity: 60, batchNumber: 'PAN-INF-09', expiryDate: '2028-11-30', supplier: 'Torrent Pharma', price: 75.00, location: 'Rack B-13' }
];

// ================================================================
// 5. APPOINTMENTS (30+ Realistic Consultations with Queue Tokens)
// ================================================================
export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'apt-01', queueToken: '#Q-01', patientId: 'usr-patient-1', patientName: 'Rahul Sharma', hospitalId: 'hosp-1', hospitalName: 'Apollo Indraprastha', doctorName: 'Dr. Rajesh Verma', department: 'Cardiology & Cath Lab', date: 'Today', timeSlot: '09:30 AM', dateTime: 'Today at 09:30 AM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Post-angioplasty routine follow-up', remindersEnabled: true },
  { id: 'apt-02', queueToken: '#Q-02', patientId: 'usr-patient-2', patientName: 'Meera Deshmukh', hospitalId: 'hosp-1', hospitalName: 'Apollo Indraprastha', doctorName: 'Dr. Priya Patel', department: 'Emergency & Trauma', date: 'Today', timeSlot: '10:15 AM', dateTime: 'Today at 10:15 AM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Suture removal & wound inspection', remindersEnabled: true },
  { id: 'apt-03', queueToken: '#Q-03', patientId: 'usr-patient-3', patientName: 'Sanjay Dutt', hospitalId: 'hosp-1', hospitalName: 'Apollo Indraprastha', doctorName: 'Dr. Arvind Swamy', department: 'Neurology & Stroke', date: 'Today', timeSlot: '11:00 AM', dateTime: 'Today at 11:00 AM', type: 'TELE_CONSULT', status: 'CONFIRMED', reason: 'Chronic migraine telemetry consult', remindersEnabled: true },
  { id: 'apt-04', queueToken: '#Q-04', patientId: 'usr-patient-4', patientName: 'Aarav Gupta', hospitalId: 'hosp-1', hospitalName: 'Apollo Indraprastha', doctorName: 'Dr. Ananya Sen', department: 'Pediatrics', date: 'Today', timeSlot: '11:45 AM', dateTime: 'Today at 11:45 AM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Pediatric immunizations check', remindersEnabled: true },
  { id: 'apt-05', queueToken: '#Q-05', patientId: 'usr-patient-5', patientName: 'Sunita Rao', hospitalId: 'hosp-2', hospitalName: 'Fortis Memorial', doctorName: 'Dr. Rohan Mehra', department: 'Cardiology', date: 'Tomorrow', timeSlot: '09:00 AM', dateTime: 'Tomorrow at 09:00 AM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Hypertension titration', remindersEnabled: true },
  { id: 'apt-06', queueToken: '#Q-06', patientId: 'usr-patient-6', patientName: 'Vikram Seth', hospitalId: 'hosp-2', hospitalName: 'Fortis Memorial', doctorName: 'Dr. Sunita Rao', department: 'Emergency & Trauma', date: 'Tomorrow', timeSlot: '10:00 AM', dateTime: 'Tomorrow at 10:00 AM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Abdominal pain follow-up', remindersEnabled: true },
  { id: 'apt-07', queueToken: '#Q-07', patientId: 'usr-patient-7', patientName: 'Ananya Birla', hospitalId: 'hosp-2', hospitalName: 'Fortis Memorial', doctorName: 'Dr. Sanjay Gupta', department: 'Orthopedics', date: 'Tomorrow', timeSlot: '11:30 AM', dateTime: 'Tomorrow at 11:30 AM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Knee ligament MRI review', remindersEnabled: true },
  { id: 'apt-08', queueToken: '#Q-08', patientId: 'usr-patient-8', patientName: 'Deepak Parekh', hospitalId: 'hosp-3', hospitalName: 'AIIMS Apex Trauma', doctorName: 'Dr. Alok Nath', department: 'Apex Trauma', date: 'Tomorrow', timeSlot: '02:00 PM', dateTime: 'Tomorrow at 02:00 PM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Post-fracture rehab evaluation', remindersEnabled: true },
  { id: 'apt-09', queueToken: '#Q-09', patientId: 'usr-patient-9', patientName: 'Kavita Krishnamurthy', hospitalId: 'hosp-3', hospitalName: 'AIIMS Apex Trauma', doctorName: 'Dr. Meenakshi Sundaram', department: 'Critical Care', date: 'In 2 Days', timeSlot: '10:00 AM', dateTime: 'In 2 Days at 10:00 AM', type: 'TELE_CONSULT', status: 'CONFIRMED', reason: 'Post-ICU discharge checkup', remindersEnabled: true },
  { id: 'apt-10', queueToken: '#Q-10', patientId: 'usr-patient-10', patientName: 'Harish Salve', hospitalId: 'hosp-4', hospitalName: 'Manipal Heart Center', doctorName: 'Dr. Girish Pillai', department: 'Cardiology', date: 'In 2 Days', timeSlot: '03:30 PM', dateTime: 'In 2 Days at 03:30 PM', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Holter monitor report review', remindersEnabled: true }
];

// ================================================================
// 6. EMERGENCY HISTORY (20+ Completed Multi-Stage Trauma Incidents)
// ================================================================
export const INITIAL_EMERGENCY_HISTORY: EmergencyEvent[] = [
  {
    id: 'EMG-882109',
    patientId: 'usr-patient-1',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 43210',
    patientAge: 34,
    patientGender: 'Male',
    patientBloodGroup: 'O+',
    location: { lat: 28.5355, lng: 77.2910, address: 'Connaught Place Outer Circle, New Delhi', landmark: 'Near Rajiv Chowk Metro' },
    symptoms: ['Severe Central Chest Pain', 'Diaphoresis', 'Left Arm Radiating Pain'],
    symptomNotes: 'Acute onset while climbing stairs. Patient has history of mild hypertension.',
    vitals: { heartRate: 118, spO2: 92, bloodPressureSys: 165, bloodPressureDia: 102, temperature: 98.6 },
    aiAssessment: {
      severity: 'CRITICAL',
      score: 0.96,
      news2Score: 8,
      primaryDiagnosisIntent: 'Acute Coronary Syndrome (Code STEMI)',
      recommendedSpecialty: 'Cardiology & Cath Lab',
      icuPreAlertRequired: true,
      estimatedWaitTimeMinutes: 5,
      confidenceInterval: [0.93, 0.99]
    },
    status: 'COMPLETED',
    assignedAmbulanceId: 'amb-1',
    assignedHospitalId: 'hosp-1',
    distanceKm: 2.3,
    etaMinutes: 0,
    preparationSteps: { bedAllocated: true, doctorNotified: true, medicinePrepped: true, bloodPrepped: true, roomReady: true },
    timeline: [
      { status: 'REQUESTED', timestamp: '08:30 AM', note: 'One-Tap SOS triggered with OTP verification' },
      { status: 'DISPATCHING', timestamp: '08:31 AM', note: 'AI classified as CRITICAL (96%). Assigned Rescue Alpha-1' },
      { status: 'DRIVER_ACCEPTED', timestamp: '08:32 AM', note: 'Driver Rajesh accepted dispatch. Siren active' },
      { status: 'EN_ROUTE', timestamp: '08:33 AM', note: 'Ambulance speeding toward patient GPS location' },
      { status: 'PICKUP', timestamp: '08:37 AM', note: 'Ambulance arrived at patient location' },
      { status: 'PATIENT_ONBOARD', timestamp: '08:39 AM', note: 'Patient secured. Aspirin 325mg chewable administered' },
      { status: 'HOSPITAL_EN_ROUTE', timestamp: '08:40 AM', note: 'En route to Apollo Indraprastha Cath Lab' },
      { status: 'ARRIVED', timestamp: '08:44 AM', note: 'Ambulance docked at Emergency Bay 1' },
      { status: 'COMPLETED', timestamp: '08:46 AM', note: 'Handoff complete. Direct transfer to Primary Angioplasty' }
    ],
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-08-20T08:46:00Z'
  }
];

// ================================================================
// 7. E-HOSPITAL SUITE RECORDS (Indian Diagnostics & ₹ Invoices)
// ================================================================
export const INITIAL_PRESCRIPTIONS: PrescriptionItem[] = [
  { id: 'rx-991', medicineName: 'Amlodipine 5mg (Amlong)', dosage: '5mg Tablet', frequency: '1-0-0 (Once daily morning)', duration: '90 Days', doctorName: 'Dr. Rajesh Verma', hospitalName: 'Apollo Indraprastha', instructions: 'Take with warm water before breakfast.', prescribedDate: '2026-08-15', refillAvailable: true },
  { id: 'rx-992', medicineName: 'Atorvastatin 20mg (Atorva)', dosage: '20mg Tablet', frequency: '0-0-1 (Once daily at bedtime)', duration: '90 Days', doctorName: 'Dr. Rajesh Verma', hospitalName: 'Apollo Indraprastha', instructions: 'Take post dinner.', prescribedDate: '2026-08-15', refillAvailable: true },
  { id: 'rx-993', medicineName: 'Telmisartan 40mg (Telma)', dosage: '40mg Tablet', frequency: '1-0-0 (Daily morning)', duration: '60 Days', doctorName: 'Dr. Rohan Mehra', hospitalName: 'Fortis Memorial', instructions: 'Check blood pressure weekly.', prescribedDate: '2026-07-22', refillAvailable: true }
];

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-801',
    testName: 'High-Sensitivity Cardiac Troponin I (hs-cTnI)',
    category: 'Biochemistry',
    hospitalName: 'Apollo Indraprastha Clinical Lab',
    doctorName: 'Dr. Shilpa Shetty-Vora (Pathologist)',
    date: '2026-08-20',
    status: 'COMPLETED',
    resultValues: [
      { parameter: 'hs-Troponin I', value: '14.2 ng/L', normalRange: '< 14.0 ng/L', status: 'HIGH' },
      { parameter: 'CK-MB Mass', value: '3.8 ng/mL', normalRange: '0.0 - 5.0 ng/mL', status: 'NORMAL' },
      { parameter: 'Myoglobin', value: '42.0 ng/mL', normalRange: '28.0 - 72.0 ng/mL', status: 'NORMAL' }
    ],
    doctorRemarks: 'Mild hs-Troponin elevation noted on presentation. Consistent with acute coronary syndrome triage.'
  },
  {
    id: 'lab-802',
    testName: 'Comprehensive Metabolic Panel & Lipid Profile',
    category: 'Biochemistry',
    hospitalName: 'Apollo Indraprastha Clinical Lab',
    doctorName: 'Dr. Shilpa Shetty-Vora (Pathologist)',
    date: '2026-08-14',
    status: 'COMPLETED',
    resultValues: [
      { parameter: 'Fasting Blood Glucose', value: '94 mg/dL', normalRange: '70 - 99 mg/dL', status: 'NORMAL' },
      { parameter: 'Total Serum Cholesterol', value: '188 mg/dL', normalRange: '< 200 mg/dL', status: 'NORMAL' },
      { parameter: 'HDL Cholesterol', value: '52 mg/dL', normalRange: '> 40 mg/dL', status: 'NORMAL' },
      { parameter: 'LDL Cholesterol', value: '112 mg/dL', normalRange: '< 100 mg/dL', status: 'HIGH' }
    ],
    doctorRemarks: 'Lipid parameters well-controlled on statin therapy. Continue existing dietary regimen.'
  }
];

export const INITIAL_RADIOLOGY_REPORTS: RadiologyReport[] = [
  {
    id: 'rad-501',
    scanType: '128-Slice Coronary CT Angiography (CCTA)',
    bodyPart: 'Coronary Arteries & Left Ventricle',
    hospitalName: 'Apollo Indraprastha Radiology Suite',
    radiologistName: 'Dr. Aarti Batra, MD (Radio-Diagnosis)',
    date: '2026-08-15',
    findings: 'Dominant right coronary system. Proximal LAD shows mild calcified plaque with <25% luminal stenosis. No significant left main disease.',
    impression: 'Non-obstructive CAD (CAD-RADS 1). Normal resting LV systolic function (LVEF 62%).',
    status: 'COMPLETED'
  }
];

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-2026-01',
    invoiceNumber: 'INV-APOLLO-99201',
    hospitalName: 'Apollo Indraprastha Hospital, New Delhi',
    patientName: 'Rahul Sharma',
    date: '2026-08-20',
    totalCost: 14500.00,
    insuranceCoveredAmount: 13050.00,
    patientPayableAmount: 1450.00,
    paymentStatus: 'PAID',
    paymentMethod: 'Star Health Cashless TPA Settlement',
    items: [
      { description: 'Emergency Trauma Bay Admission & Triage', department: 'Emergency Care', cost: 3500.00 },
      { description: '12-Lead Digital Telemetry ECG + Stat Troponin Panel', department: 'Diagnostics', cost: 4200.00 },
      { description: 'Emergency Physician Level 5 Resuscitation Fee', department: 'Physician Fee', cost: 4500.00 },
      { description: 'Emergency Crash Cart Drug Dispensation (Chewable Aspirin + Heparin)', department: 'Pharmacy', cost: 2300.00 }
    ]
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-01',
    title: 'Outpatient Cardiovascular Risk Assessment',
    category: 'Consultation Note',
    hospitalName: 'Apollo Indraprastha',
    doctorName: 'Dr. Rajesh Verma',
    date: '2026-08-15',
    summary: 'Patient evaluated for baseline cardiac risk factors. BP 124/80 mmHg. Advised continuation of Amlodipine 5mg and healthy cardio nutrition.',
    documentUrl: '#'
  }
];

export const INITIAL_AI_CAPACITY_FORECAST: AICapacityForecast[] = [
  { hour: '18:00', loadPercent: 68, status: 'NORMAL', estimatedArrivals: 4 },
  { hour: '19:00', loadPercent: 74, status: 'NORMAL', estimatedArrivals: 6 },
  { hour: '20:00', loadPercent: 84, status: 'HIGH_DEMAND', estimatedArrivals: 9 },
  { hour: '21:00', loadPercent: 91, status: 'CRITICAL_SURGE', estimatedArrivals: 12 },
  { hour: '22:00', loadPercent: 88, status: 'HIGH_DEMAND', estimatedArrivals: 8 },
  { hour: '23:00', loadPercent: 72, status: 'NORMAL', estimatedArrivals: 5 }
];
