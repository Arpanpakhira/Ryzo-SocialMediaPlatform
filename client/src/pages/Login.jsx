import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Star, Key, ShieldCheck } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';

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
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl text-slate-200 text-center max-w-sm shadow-xl">
          <Key className="size-10 text-amber-400 mx-auto mb-3" />
          <h4 className="text-base font-bold mb-2 text-white">Clerk Authentication Notice</h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Please check your VITE_CLERK_PUBLISHABLE_KEY environment variables to complete authentication.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Login = () => {
  // Auth mode state: 'login' | 'register'
  const [authMode] = useState('login');

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Dynamic Background */}
      <img
        src={assets.bgImage}
        alt="Background"
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover opacity-80 filter brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/40 -z-10" />

      {/* Left Column: Platform Branding & Value Props */}
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
          <span>Secured by Clerk SSO • Encrypted Authentication</span>
        </div>
      </div>

      {/* Right Column: Clerk SSO Authentication */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 md:p-12 z-10">
        <div className="w-full max-w-md flex flex-col items-center justify-center">
          <ClerkAuthWrapper>
            {authMode === 'login' ? (
              <SignIn />
            ) : (
              <SignUp />
            )}
          </ClerkAuthWrapper>
        </div>
      </div>
    </div>
  );
};

export default Login;
