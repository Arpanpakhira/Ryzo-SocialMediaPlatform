import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const FALLBACK_KEY = 'pk_test_Y2xlcmsucnl6by5kZW1vLmFwcCQ';
const EFFECTIVE_KEY = (PUBLISHABLE_KEY && (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_')))
  ? PUBLISHABLE_KEY
  : FALLBACK_KEY;

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-slate-900/90 border border-amber-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center">
            <div className="size-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="text-xl font-bold text-amber-400 mb-2">Ryzo Social Hub</h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              The application encountered a runtime update state. Click below to refresh into full Demo Mode instantly.
            </p>
            <button
              onClick={() => {
                localStorage.setItem('ryzo_demo_auth', 'true');
                window.location.href = '/';
              }}
              className="px-6 py-3 rounded-2xl ryzo-btn-gold font-bold text-xs shadow-lg hover:scale-105 transition-all"
            >
              Launch Ryzo Hub
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const renderApp = () => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <GlobalErrorBoundary>
      <ClerkProvider publishableKey={EFFECTIVE_KEY}>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </ClerkProvider>
    </GlobalErrorBoundary>
  );
};

renderApp();

