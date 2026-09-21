import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Star, Key, UserPlus, LogIn, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';

class ClerkAuthWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Clerk component notice:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-slate-200 text-center max-w-sm">
          <Key className="size-8 text-amber-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold mb-1">Clerk Provider Notice</h4>
          <p className="text-xs text-slate-400 mb-3">
            Please fill in the Sign In or Register form below to log in.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Login = () => {
  const { setIsDemoAuthenticated, setCurrentUser, currentUser } = useApp();

  // Auth mode state: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  // Provider method state: 'direct' | 'clerk'
  const [authMethod, setAuthMethod] = useState('direct');

  // Form input states for Direct Auth
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('Creator');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Direct Login submission
  const handleDirectLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both email/username and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Authenticate user & sync to context
      if (setCurrentUser) {
        setCurrentUser((prev) => ({
          ...prev,
          username: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier,
          email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@ryzo.app`,
        }));
      }
      setIsDemoAuthenticated(true);
      setLoading(false);
    }, 600);
  };

  // Handle Direct Register submission
  const handleDirectRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerName.trim() || !registerUsername.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setErrorMessage('Please fill in all required fields to register.');
      return;
    }

    if (registerPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const cleanUsername = registerUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const newUserProfile = {
        ...(currentUser || {}),
        full_name: registerName,
        username: cleanUsername || 'user',
        email: registerEmail,
        bio: `${registerRole} on Ryzo Social Platform ✨`,
        profile_picture: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400`,
      };

      if (setCurrentUser) {
        setCurrentUser(newUserProfile);
      }
      setSuccessMessage('Account created successfully! Logging in...');
      setTimeout(() => {
        setIsDemoAuthenticated(true);
        setLoading(false);
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Dynamic Background */}
      <img
        src={assets.bgImage}
        alt="Background"
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover opacity-80 filter brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/40 -z-10" />

      {/* Left Column: Platform Branding & Highlights */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-12 lg:pl-20 z-10">
        <div className="flex items-center gap-3">
          <img src={assets.logo} alt="Ryzo Logo" className="h-11 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent uppercase">
              Ryzo
            </span>
            <span className="text-[10px] text-amber-400/80 tracking-widest uppercase font-semibold -mt-1">
              Social Platform
            </span>
          </div>
        </div>

        <div className="my-8 md:my-12 max-w-lg">
          <div className="flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/15 shadow-lg">
            <img src={assets.group_users} alt="Users" className="h-8" />
            <div>
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 text-transparent fill-amber-400"
                    />
                  ))}
              </div>
              <p className="text-xs font-semibold text-white/90">Joined by 20k+ creators & developers</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white mb-5 tracking-tight">
            More than just friends,{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
              truly connect
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-md font-medium leading-relaxed">
            Experience the upgraded social feed, interactive stories, real-time messaging, and explore grid on Ryzo.
          </p>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center gap-2 text-xs text-slate-400/90 font-medium bg-slate-900/60 backdrop-blur-md border border-slate-800/80 px-4 py-2.5 rounded-2xl">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span>Secure Authentication • Data Protected</span>
        </div>
      </div>

      {/* Right Column: Authentication Card (Login / Register) */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 md:p-12 z-10">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 p-6 sm:p-8 rounded-3xl shadow-2xl relative">

          {/* Main Auth Tabs: LOGIN vs REGISTER */}
          <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-6">
            <button
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${authMode === 'login'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <LogIn className="size-4" />
              <span>Login</span>
            </button>

            <button
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${authMode === 'register'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <UserPlus className="size-4" />
              <span>Register</span>
            </button>
          </div>

          {/* Sub-tabs for Direct Auth vs Clerk SSO */}
          <div className="flex items-center justify-between mb-5 px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {authMode === 'login' ? 'Sign In to Your Account' : 'Create a New Account'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthMethod('direct')}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${authMethod === 'direct'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('clerk')}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${authMethod === 'clerk'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                Clerk SSO
              </button>
            </div>
          </div>

          {/* Alert notifications */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="size-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Content */}
          {authMethod === 'clerk' ? (
            <div className="flex flex-col items-center justify-center py-2">
              <ClerkAuthWrapper>
                {authMode === 'login' ? <SignIn /> : <SignUp />}
              </ClerkAuthWrapper>
            </div>
          ) : (
            <div>
              {authMode === 'login' ? (
                /* DIRECT LOGIN FORM */
                <form onSubmit={handleDirectLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="you@example.com or username"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-400"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 mt-1"
                  >
                    {loading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <LogIn className="size-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* DIRECT REGISTER FORM */
                <form onSubmit={handleDirectRegister} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        placeholder="alex_ryzo"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Role / Industry
                      </label>
                      <select
                        value={registerRole}
                        onChange={(e) => setRegisterRole(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-amber-400 transition-colors"
                      >
                        <option value="Creator">Creator</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Enthusiast">Enthusiast</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="At least 4 characters"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 mt-1"
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <UserPlus className="size-4" />
                        <span>Create Account & Start</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Bottom Switch Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-bold text-amber-400 hover:underline ml-1"
                >
                  Register now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-bold text-amber-400 hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
