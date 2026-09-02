import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useEmergency } from './context/EmergencyContext';
import { UserRole } from './types';

// Patient Components
import { PatientDashboard } from './components/patient/PatientDashboard';
import { ActiveEmergencyTracker } from './components/patient/ActiveEmergencyTracker';
import { HospitalDirectory } from './components/patient/HospitalDirectory';
import { PatientAppointmentsView } from './components/patient/PatientAppointmentsView';
import { EHospitalView } from './components/patient/EHospitalView';
import { MedicalRecordsView } from './components/patient/MedicalRecordsView';
import { PatientProfileView } from './components/patient/PatientProfileView';

// Hospital Components
import { HospitalDashboard } from './components/hospital/HospitalDashboard';
import { BedManagementView } from './components/hospital/BedManagementView';
import { DoctorRosterView } from './components/hospital/DoctorRosterView';
import { MedicineInventoryView } from './components/hospital/MedicineInventoryView';
import { LaboratoryView } from './components/hospital/LaboratoryView';
import { HospitalAnalyticsView } from './components/hospital/HospitalAnalyticsView';

// Driver Components
import { DriverDashboard } from './components/driver/DriverDashboard';
import { TripHistoryView } from './components/driver/TripHistoryView';

// Admin Components
import { AdminCommandCenter } from './components/admin/AdminCommandCenter';

interface DashboardLayoutProps {
  forcedRole?: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ forcedRole }) => {
  const { currentRole } = useAuth();
  const effectiveRole = currentRole || forcedRole || 'PATIENT';

  // Default active tab per role
  const getDefaultTab = (role: UserRole) => {
    if (role === 'PATIENT') return 'dashboard';
    if (role === 'HOSPITAL_ADMIN' || role === 'DOCTOR' || role === 'NURSE') return 'overview';
    if (role === 'AMBULANCE_DRIVER') return 'dashboard';
    if (role === 'SUPER_ADMIN') return 'command_center';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(() => getDefaultTab(effectiveRole));

  useEffect(() => {
    setActiveTab(getDefaultTab(effectiveRole));
  }, [effectiveRole]);

  const renderActiveView = () => {
    // 1. PATIENT PANEL (/user)
    if (effectiveRole === 'PATIENT') {
      switch (activeTab) {
        case 'dashboard':
          return <PatientDashboard onNavigateTab={setActiveTab} />;
        case 'emergency':
          return <ActiveEmergencyTracker />;
        case 'hospitals':
          return <HospitalDirectory />;
        case 'appointments':
          return <PatientAppointmentsView />;
        case 'ehospital':
          return <EHospitalView />;
        case 'records':
          return <MedicalRecordsView />;
        case 'profile':
          return <PatientProfileView />;
        default:
          return <PatientDashboard onNavigateTab={setActiveTab} />;
      }
    }

    // 2. HOSPITAL PANELS (/hospital)
    if (effectiveRole === 'HOSPITAL_ADMIN' || effectiveRole === 'DOCTOR' || effectiveRole === 'NURSE') {
      switch (activeTab) {
        case 'overview':
        case 'emergency_queue':
          return <HospitalDashboard onNavigateTab={setActiveTab} />;
        case 'beds':
          return <BedManagementView />;
        case 'doctors':
          return <DoctorRosterView />;
        case 'medicines':
          return <MedicineInventoryView />;
        case 'laboratory':
          return <LaboratoryView />;
        case 'appointments':
          return <PatientAppointmentsView />;
        case 'analytics':
          return <HospitalAnalyticsView />;
        default:
          return <HospitalDashboard onNavigateTab={setActiveTab} />;
      }
    }

    // 3. AMBULANCE DRIVER PANEL (/ambulance)
    if (effectiveRole === 'AMBULANCE_DRIVER') {
      switch (activeTab) {
        case 'dashboard':
        case 'current_trip':
        case 'requests':
          return <DriverDashboard onNavigateTab={setActiveTab} />;
        case 'trip_history':
          return <TripHistoryView />;
        default:
          return <DriverDashboard onNavigateTab={setActiveTab} />;
      }
    }

    // 4. SUPER ADMIN COMMAND CENTER (/admin)
    if (effectiveRole === 'SUPER_ADMIN') {
      switch (activeTab) {
        case 'command_center':
        case 'users':
        case 'hospitals':
        case 'fleet':
        case 'ai_monitoring':
        case 'analytics':
          return <AdminCommandCenter />;
        default:
          return <AdminCommandCenter />;
      }
    }

    return <PatientDashboard onNavigateTab={setActiveTab} />;
  };

  return (
    <div className="min-h-screen bg-[#040A1D] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar onNavigateTab={setActiveTab} />

      {/* Main Content Area: Sidebar + Active Dashboard */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Dynamic Role-Based Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Active View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Mobile Tab Navigation Bar */}
          <div className="md:hidden flex items-center space-x-2 overflow-x-auto pb-3 mb-4 text-xs">
            {effectiveRole === 'PATIENT' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'dashboard' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'emergency' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Emergency SOS
                </button>
                <button
                  onClick={() => setActiveTab('ehospital')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'ehospital' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  E-Hospital Rx
                </button>
              </>
            )}
            {(effectiveRole === 'HOSPITAL_ADMIN' || effectiveRole === 'DOCTOR' || effectiveRole === 'NURSE') && (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'overview' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('beds')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'beds' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Beds
                </button>
                <button
                  onClick={() => setActiveTab('medicines')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'medicines' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Pharmacy
                </button>
                <button
                  onClick={() => setActiveTab('laboratory')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'laboratory' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Labs
                </button>
              </>
            )}
            {effectiveRole === 'AMBULANCE_DRIVER' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'dashboard' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Cockpit
                </button>
                <button
                  onClick={() => setActiveTab('trip_history')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'trip_history' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Trip History
                </button>
              </>
            )}
            {effectiveRole === 'SUPER_ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('command_center')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'command_center' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Command Center
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'users' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'hospitals' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Hospitals
                </button>
                <button
                  onClick={() => setActiveTab('fleet')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === 'fleet' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Fleet
                </button>
              </>
            )}
          </div>

          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Authentication Pages */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      {/* 3. Protected Role Dashboards */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <DashboardLayout forcedRole="PATIENT" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE']}>
            <DashboardLayout forcedRole="HOSPITAL_ADMIN" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ambulance"
        element={
          <ProtectedRoute allowedRoles={['AMBULANCE_DRIVER']}>
            <DashboardLayout forcedRole="AMBULANCE_DRIVER" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <DashboardLayout forcedRole="SUPER_ADMIN" />
          </ProtectedRoute>
        }
      />

      {/* 4. Fallback: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
