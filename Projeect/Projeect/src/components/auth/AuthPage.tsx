import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  Building2, 
  Truck, 
  Cpu, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ArrowLeft,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, signup, isAuthenticated, getDashboardPath, currentRole } = useAuth();

  // Determine initial tab from query param or prop
  const initialTab = searchParams.get('tab') === 'signup' || location.pathname === '/signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

  // Pre-selected role from URL (e.g., from Landing Page 4 cards)
  const initialRoleParam = searchParams.get('role');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign up form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>(
    (initialRoleParam as UserRole) || 'PATIENT'
  );
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // If already authenticated and visiting /login or /signup, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && currentRole) {
      const from = (location.state as any)?.from?.pathname;
      navigate(from || getDashboardPath(currentRole), { replace: true });
    }
  }, [isAuthenticated, currentRole, navigate, getDashboardPath, location.state]);

  // Handle URL tab changes
  useEffect(() => {
    if (searchParams.get('tab') === 'signup' || location.pathname === '/signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [searchParams, location.pathname]);

  // Handle pre-fill if role was passed
  useEffect(() => {
    if (initialRoleParam) {
      if (initialRoleParam === 'PATIENT') {
        setLoginIdentifier('patient');
        setLoginPassword('patient123');
      } else if (initialRoleParam === 'HOSPITAL_ADMIN') {
        setLoginIdentifier('hospital');
        setLoginPassword('hospital123');
      } else if (initialRoleParam === 'AMBULANCE_DRIVER') {
        setLoginIdentifier('ambulance');
        setLoginPassword('ambulance123');
      } else if (initialRoleParam === 'SUPER_ADMIN') {
        setLoginIdentifier('admin');
        setLoginPassword('admin123');
      }
    }
  }, [initialRoleParam]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    setTimeout(() => {
      const res = login(loginIdentifier, loginPassword, rememberMe);
      setLoginLoading(false);

      if (res.success && res.role) {
        const from = (location.state as any)?.from?.pathname;
        const targetPath = from || getDashboardPath(res.role);
        navigate(targetPath, { replace: true });
      } else {
        setLoginError(res.error || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = (roleKey: string, passKey: string) => {
    setLoginIdentifier(roleKey);
    setLoginPassword(passKey);
    setLoginError(null);
    setLoginLoading(true);

    setTimeout(() => {
      const res = login(roleKey, passKey, true);
      setLoginLoading(false);
      if (res.success && res.role) {
        const from = (location.state as any)?.from?.pathname;
        navigate(from || getDashboardPath(res.role), { replace: true });
      }
    }, 300);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      return;
    }

    setSignupLoading(true);

    setTimeout(() => {
      const res = signup({
        fullName: signupFullName,
        username: signupUsername,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        role: signupRole
      });

      setSignupLoading(false);

      if (res.success) {
        setSignupSuccess('Account created successfully! Redirecting to login...');
        setLoginIdentifier(signupUsername);
        setLoginPassword(signupPassword);
        setTimeout(() => {
          setActiveTab('login');
          setSignupSuccess(null);
        }, 1200);
      } else {
        setSignupError(res.error || 'Failed to create account.');
      }
    }, 500);
  };

  const demoCards = [
    {
      roleName: 'Patient / User',
      username: 'patient',
      pass: 'patient123',
      role: 'PATIENT' as UserRole,
      route: '/user',
      icon: ShieldAlert,
      color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400',
      desc: 'One-Tap SOS, 10s OTP, Smart Hospital Ranker'
    },
    {
      roleName: 'Hospital Command',
      username: 'hospital',
      pass: 'hospital123',
      role: 'HOSPITAL_ADMIN' as UserRole,
      route: '/hospital',
      icon: Building2,
      color: 'border-blue-500/40 bg-blue-950/30 text-blue-400',
      desc: 'Bed Matrix, Doctor Roster & Pre-Alerts'
    },
    {
      roleName: 'Ambulance Driver',
      username: 'ambulance',
      pass: 'ambulance123',
      role: 'AMBULANCE_DRIVER' as UserRole,
      route: '/ambulance',
      icon: Truck,
      color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400',
      desc: 'Live GPS HUD, 9-Stage Trip Progression'
    },
    {
      roleName: 'City Super Admin',
      username: 'admin',
      pass: 'admin123',
      role: 'SUPER_ADMIN' as UserRole,
      route: '/admin',
      icon: Cpu,
      color: 'border-purple-500/40 bg-purple-950/30 text-purple-400',
      desc: 'City Radar, AI Capacity Forecast & Fleet'
    }
  ];

  return (
    <div className="min-h-screen bg-[#040A1D] text-slate-100 selection:bg-cyan-500 selection:text-black flex flex-col justify-between relative overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-cyan-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 border-b border-cyan-500/20 bg-[#040A1D]/80 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition">
            <Activity className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#040A1D] animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-white font-heading">
                Life<span className="text-cyan-400">Link</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold font-mono">
                SECURE AUTH
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block -mt-0.5 tracking-wider uppercase">
              Intelligent Healthcare OS
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-xl w-full space-y-6">
          
          {/* Main Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 bg-[#0A1024]/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Header / Subtitle */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>ROBUST ROLE-BASED ACCESS CONTROL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                Welcome to LifeLink
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                AI-powered emergency care, intelligently connected.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setLoginError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setSignupError(null);
                  setSignupSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Username / Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Username / Email
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. patient, hospital, or your email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: SIGN UP */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {signupError && (
                  <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}
                {signupSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{signupSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupFullName}
                        onChange={e => setSignupFullName(e.target.value)}
                        placeholder="Dr. John Doe / Jane Smith"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={signupUsername}
                      onChange={e => setSignupUsername(e.target.value)}
                      placeholder="e.g. jdoe2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        placeholder="name@healthcare.org"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={e => setSignupPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Select Role
                  </label>
                  <select
                    value={signupRole}
                    onChange={e => setSignupRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-cyan-300 text-xs font-semibold focus:outline-none focus:border-cyan-400 transition cursor-pointer"
                  >
                    <option value="PATIENT" className="bg-[#0A1024] text-white">
                      Patient / User (One-Tap SOS, E-Hospital & Appointments)
                    </option>
                    <option value="AMBULANCE_DRIVER" className="bg-[#0A1024] text-white">
                      Ambulance Driver (Paramedic Cockpit & Live GPS)
                    </option>
                    <option value="HOSPITAL_ADMIN" className="bg-[#0A1024] text-white">
                      Hospital (Emergency Command, Beds & Pre-Alerts)
                    </option>
                    <option value="SUPER_ADMIN" className="bg-[#0A1024] text-white">
                      Admin (City EMS Super Admin Command)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Confirm Password
                    </label>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupConfirmPassword}
                      onChange={e => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {signupLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 1-Click Demo Accounts Section */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 tracking-wide flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DEMO ACCOUNTS (1-CLICK TEST LOGIN)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Click any role below
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {demoCards.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.username}
                      type="button"
                      onClick={() => handleQuickDemoLogin(item.username, item.pass)}
                      className={`p-3 rounded-2xl border ${item.color} hover:scale-105 transition duration-200 text-left flex flex-col justify-between cursor-pointer group shadow-md`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-mono font-bold uppercase opacity-80 group-hover:opacity-100">
                          {item.route}
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white font-heading truncate">
                          {item.roleName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.username} / {item.pass}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl glass-card border border-cyan-500/40 bg-[#0A1024] shadow-2xl relative space-y-4">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotSuccess(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-cyan-400">
              <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-heading">Reset Password</h3>
                <p className="text-xs text-slate-400">LifeLink Emergency Authentication</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset Link Sent!</span>
                </div>
                <p className="text-slate-300">
                  Demo mode: You can immediately log in using any demo account credentials (e.g. <span className="font-mono text-cyan-300">patient / patient123</span>).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-2 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your email address and we'll transmit a secure one-time verification link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs hover:brightness-110 transition"
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Bar */}
      <footer className="border-t border-slate-800/80 bg-[#040A1D] py-4 text-center text-xs text-slate-500">
        © 2026 LifeLink Technologies • Intelligent Healthcare OS
      </footer>
    </div>
  );
};
