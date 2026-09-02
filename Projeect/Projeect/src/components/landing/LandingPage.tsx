import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  Building2, 
  Truck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  Lock, 
  Layers, 
  TrendingUp, 
  Radio, 
  Pill, 
  Heart,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  Award,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterApp?: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole, getDashboardPath } = useAuth();

  const handleLaunchRole = (role: UserRole) => {
    if (isAuthenticated && currentRole === role) {
      navigate(getDashboardPath(role));
    } else {
      navigate(`/login?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#040A1D] text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#040A1D]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition">
              <Activity className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#040A1D] animate-ping" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                Life<span className="text-cyan-400">Link</span>
              </span>
              <span className="text-[10px] text-cyan-300 font-mono block -mt-1 tracking-widest uppercase">
                Intelligent Healthcare OS
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
            <a href="#four-panels" className="hover:text-cyan-400 transition">4 Connected Panels</a>
            <a href="#ai-intelligence" className="hover:text-cyan-400 transition">AI Intelligence</a>
            <a href="#security" className="hover:text-cyan-400 transition">Security & HIPAA</a>
          </div>

          {/* Login & Sign Up Dual Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(getDashboardPath(currentRole))}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center space-x-2 cursor-pointer"
              >
                <span>Go to Dashboard ({currentRole?.replace('_', ' ')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-700 hover:border-cyan-400/60 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs transition duration-200 flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/login?tab=signup"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition duration-200 flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glowing Mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-cyan-400/40 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/10 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>AI-POWERED EMERGENCY RESPONSE & SMART HOSPITAL OS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-heading tracking-tight max-w-4xl mx-auto leading-tight">
            Emergency care, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              intelligently connected.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            AI-powered emergency response, smart hospital discovery, and real-time e-hospital coordination in one connected platform.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-black text-sm shadow-xl shadow-cyan-500/30 transition flex items-center justify-center space-x-3 cursor-pointer group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition duration-200" />
            </Link>
            <a
              href="#four-panels"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition flex items-center justify-center space-x-2"
            >
              <span>Explore 4 Connected Panels</span>
            </a>
          </div>

          {/* Instant Role Launch Selector Cards */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            {[
              {
                role: 'PATIENT' as UserRole,
                title: 'User / Patient Panel',
                desc: 'One-Tap SOS, 10s OTP, Smart Hospital Ranker & E-Hospital Rx',
                color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
                icon: ShieldAlert
              },
              {
                role: 'HOSPITAL_ADMIN' as UserRole,
                title: 'Hospital Command Center',
                desc: '8 Animated KPI Cards, Bed Matrix, Pharmacy Stock & Doctor Roster',
                color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
                icon: Building2
              },
              {
                role: 'AMBULANCE_DRIVER' as UserRole,
                title: 'Driver Cockpit (Mobile)',
                desc: '3s Live GPS, 9-Stage Trip Progression & Hospital Navigation',
                color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
                icon: Truck
              },
              {
                role: 'SUPER_ADMIN' as UserRole,
                title: 'City EMS Super Admin',
                desc: 'City Radar, 6-Hour AI Capacity Forecast & Peak Heatmap',
                color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
                icon: Cpu
              }
            ].map(p => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  onClick={() => handleLaunchRole(p.role)}
                  className={`p-5 rounded-3xl glass-card border ${p.color} hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 group shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white">
                        Enter Panel →
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm font-heading">{p.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 flex items-center space-x-1">
                    <span>1-Click Launch</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: 4 CONNECTED PANELS */}
      <section id="four-panels" className="py-24 border-t border-slate-800/80 bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-cyan-400 tracking-widest uppercase font-mono">
              UNIFIED HEALTHCARE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              Four Panels. One Synchronized Platform.
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              No disconnected silos. Any action triggered in the Patient SOS immediately broadcasts to the Driver, updates the Hospital Pre-Alert queue, and logs on the Admin radar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl glass-card border border-blue-500/30 bg-[#0E1B38]/60 space-y-4">
              <div className="p-3 w-fit rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white font-heading">1. Patient / User Ecosystem</h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>One-Tap SOS button with 10-second cancel countdown & OTP verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Smart Hospital Ranker scoring beds, wait times, distance, and specialists</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>E-Hospital Suite: Prescriptions, lab reports, radiology imaging & INR receipts</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl glass-card border border-blue-500/30 bg-[#0E1B38]/60 space-y-4">
              <div className="p-3 w-fit rounded-2xl bg-blue-950 border border-blue-500/40 text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white font-heading">2. Hospital Emergency Command</h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>8 live cards with animated counters & Level 1 Trauma telemetry</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>7 Ward Categories & 5 Bed Statuses with 1-click status cycling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Emergency Preparation Protocol (Room, Doctor, Meds, Blood, ICU)</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl glass-card border border-blue-500/30 bg-[#0E1B38]/60 space-y-4">
              <div className="p-3 w-fit rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white font-heading">3. Ambulance Driver Mobile Cockpit</h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mobile-first paramedic HUD with ONLINE / OFFLINE shift toggles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>9-stage seamless trip flow from dispatch to hospital triage handoff</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3-second live GPS movement simulation and traffic-aware ETA countdown</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl glass-card border border-blue-500/30 bg-[#0E1B38]/60 space-y-4">
              <div className="p-3 w-fit rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white font-heading">4. City EMS Super Admin Command</h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>City-wide multi-vehicle radar map and fleet telematics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI 6-Hour Hospital Capacity & Surge Forecast with LSTM model</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24-Hour Peak Demand Heatmap & Clinical Override audit logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: AI INTELLIGENCE */}
      <section id="ai-intelligence" className="py-24 border-t border-slate-800/80 bg-[#040A1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-cyan-400 tracking-widest uppercase font-mono">
              CLINICAL AI & MACHINE LEARNING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              Powered by Clinical NLP & Predictive Models
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold font-heading">
                <Sparkles className="w-5 h-5" />
                <span>BERT Clinical Intent Extraction</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Processes unstructured patient voice & text transcripts to instantly extract emergency intents: Code STEMI, Code Blue, Code Stroke, or Polytrauma.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold font-heading">
                <Activity className="w-5 h-5" />
                <span>XGBoost NEWS2 Severity Engine</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates National Early Warning Score 2 (NEWS2) from heart rate, SpO2, systolic BP, and age to classify triage into STABLE, URGENT, or CRITICAL.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-blue-500/20 bg-slate-950/80 space-y-3">
              <div className="flex items-center space-x-2 text-purple-400 font-bold font-heading">
                <Clock className="w-5 h-5" />
                <span>LSTM Queue & Wait-Time Forecast</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Analyzes multi-variate ER admission sequences and traffic congestion to forecast emergency arrival loads across 6-hour projection horizons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SECURITY & HIPAA */}
      <section id="security" className="py-24 border-t border-slate-800/80 bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-black text-emerald-400 tracking-widest uppercase font-mono">
              ENTERPRISE HEALTHCARE COMPLIANCE
            </span>
            <h2 className="text-3xl font-black text-white font-heading">
              HIPAA, HL7 & Zero-Trust Security Built In
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              LifeLink guarantees strict role-based access control (RBAC), end-to-end encryption for patient medical baselines, immutable audit logging for clinical overrides, and granular consent toggles.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>JWT & RBAC Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Consent-Based Sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audit Trail Logging</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Rate Limited API Gateway</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-emerald-500/30 bg-[#0E1B38]/80 text-center space-y-4 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/30">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-white text-base font-heading">Encrypted Health Vault</h3>
            <p className="text-xs text-slate-400">
              Patient health records are only accessible to authorized attending medical personnel during verified active emergency windows.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 border-t border-cyan-500/20 bg-gradient-to-b from-[#070B14] to-[#040A1D] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading">
            Experience the Future of Emergency Healthcare
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Try the interactive 4-panel live demonstration with Indian hospitals, GPS tracking, and complete E-Hospital records.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-black text-sm shadow-2xl shadow-cyan-500/40 transition cursor-pointer"
          >
            <span>Get Started with LifeLink →</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#040A1D] py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300 font-heading">LifeLink Intelligent Healthcare OS</span>
          </div>
          <div>
            © 2026 LifeLink Technologies. Production-style healthcare prototype.
          </div>
        </div>
      </footer>
    </div>
  );
};
