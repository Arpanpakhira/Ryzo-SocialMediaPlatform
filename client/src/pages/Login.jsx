import React from 'react';
import { assets } from '../assets/assets';
import { Star, Sparkles, ArrowRight, Key } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';

class SignInWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Clerk SignIn component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-white text-center max-w-sm">
          <Key className="size-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold mb-1">Clerk Authentication Notice</h3>
          <p className="text-xs text-white/70 mb-4">
            Clerk API key needs verification or is initializing. You can explore the full app instantly in Demo Mode!
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Login = () => {
  const { setIsDemoAuthenticated } = useApp();

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-slate-900">
      {/* Background Image */}
      <img
        src={assets.bgImage}
        alt="Background"
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover opacity-90"
      />

      {/* Left side: Branding */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-12 lg:pl-32 z-10">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={assets.logo} alt="Logo" className="h-12 object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">Ryzo</span>
        </div>

        <div className="my-8">
          <div className="flex items-center gap-3 mb-6 max-md:mt-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white/10">
            <img src={assets.group_users} alt="Users" className="h-8 md:h-10" />
            <div>
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 md:size-4 text-transparent fill-amber-400"
                    />
                  ))}
              </div>
              <p className="text-xs font-semibold text-white/90">Joined by 20k+ creators & developers</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-4">
            More than just friends,{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
              truly connect
            </span>
          </h1>

          <p className="text-lg md:text-xl text-indigo-100/80 max-w-md font-medium leading-relaxed">
            Experience the upgraded social feed, interactive stories, real-time messaging, and explore grid on Ryzo.
          </p>
        </div>

        {/* Demo Quick Access Callout */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="size-4" />
              Instant Demo Access
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              No Auth Required
            </span>
          </div>
          <p className="text-xs text-white/80 mb-3">
            Explore the complete app interface directly!
          </p>
          <button
            onClick={() => setIsDemoAuthenticated(true)}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Explore App in Demo Mode</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Right side: Clerk Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          <SignInWrapper>
            <SignIn />
          </SignInWrapper>
        </div>
      </div>
    </div>
  );
};

export default Login;
