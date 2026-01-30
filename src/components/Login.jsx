import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

/**
 * MSME Compliance Navigator - Login Page
 * 
 * Split-screen design with AI-themed visuals on left and login form on right.
 * Google OAuth only - no email/password.
 * 
 * SETUP:
 * - Google Client ID is configured in src/main.jsx
 * - On successful login, redirects to /home (dashboard)
 * - Auth state is passed up via onLoginSuccess callback
 */

const Login = ({ onLoginSuccess, isAuthenticated }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Fade-in animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Google OAuth login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔐 Google OAuth success, fetching user info...');
        
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user information');
        }
        
        const userInfo = await userInfoResponse.json();
        console.log('✅ User info received:', userInfo.email);
        
        const userData = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          googleId: userInfo.sub,
        };
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('msme_auth', JSON.stringify(userData));
        console.log('💾 Auth saved to localStorage');
        
        // Call parent callback - App.jsx handles navigation
        onLoginSuccess(userData);
        
      } catch (err) {
        console.error('Login error:', err);
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 flex">
      
      {/* ==================== LEFT SECTION - Visual / Illustration ==================== */}
      <div 
        className={`hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 transition-all duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/8 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 xl:p-20">
          
          {/* AI Node Network Illustration */}
          <div className={`relative mb-12 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <svg 
              className="w-80 h-80 xl:w-96 xl:h-96" 
              viewBox="0 0 400 400" 
              fill="none"
            >
              {/* Central Hub */}
              <circle cx="200" cy="200" r="40" className="fill-blue-500/20 stroke-blue-400" strokeWidth="2">
                <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="200" r="25" className="fill-blue-500/40" />
              
              {/* Shield Icon in Center */}
              <path 
                d="M200 175 L200 175 C190 178 182 180 175 180 C175 195 178 210 200 225 C222 210 225 195 225 180 C218 180 210 178 200 175Z" 
                className="fill-blue-400 stroke-blue-300" 
                strokeWidth="1.5"
              />
              <path d="M195 198 L200 203 L210 193" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Outer Nodes */}
              {/* Top Node - Documents */}
              <circle cx="200" cy="80" r="28" className="fill-slate-800/80 stroke-cyan-400/60" strokeWidth="1.5">
                <animate attributeName="cy" values="80;75;80" dur="4s" repeatCount="indefinite" />
              </circle>
              <rect x="188" y="70" width="24" height="20" rx="2" className="fill-none stroke-cyan-400/80" strokeWidth="1.5" />
              <line x1="192" y1="76" x2="208" y2="76" className="stroke-cyan-400/60" strokeWidth="1" />
              <line x1="192" y1="80" x2="204" y2="80" className="stroke-cyan-400/60" strokeWidth="1" />
              <line x1="192" y1="84" x2="206" y2="84" className="stroke-cyan-400/60" strokeWidth="1" />
              
              {/* Right Node - Analytics */}
              <circle cx="320" cy="200" r="28" className="fill-slate-800/80 stroke-indigo-400/60" strokeWidth="1.5">
                <animate attributeName="cx" values="320;325;320" dur="4.5s" repeatCount="indefinite" />
              </circle>
              <rect x="305" y="190" width="30" height="20" rx="2" className="fill-none stroke-indigo-400/80" strokeWidth="1.5" />
              <rect x="308" y="200" width="5" height="8" className="fill-indigo-400/60" />
              <rect x="315" y="195" width="5" height="13" className="fill-indigo-400/80" />
              <rect x="322" y="198" width="5" height="10" className="fill-indigo-400/60" />
              
              {/* Bottom Node - Checklist */}
              <circle cx="200" cy="320" r="28" className="fill-slate-800/80 stroke-emerald-400/60" strokeWidth="1.5">
                <animate attributeName="cy" values="320;325;320" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <rect x="186" y="308" width="28" height="24" rx="2" className="fill-none stroke-emerald-400/80" strokeWidth="1.5" />
              <circle cx="193" cy="315" r="2" className="fill-emerald-400" />
              <line x1="198" y1="315" x2="208" y2="315" className="stroke-emerald-400/60" strokeWidth="1.5" />
              <circle cx="193" cy="322" r="2" className="fill-emerald-400" />
              <line x1="198" y1="322" x2="206" y2="322" className="stroke-emerald-400/60" strokeWidth="1.5" />
              <path d="M191 328 L193 330 L197 326" className="stroke-emerald-400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="200" y1="329" x2="208" y2="329" className="stroke-emerald-400/60" strokeWidth="1.5" />
              
              {/* Left Node - Calendar */}
              <circle cx="80" cy="200" r="28" className="fill-slate-800/80 stroke-violet-400/60" strokeWidth="1.5">
                <animate attributeName="cx" values="80;75;80" dur="5s" repeatCount="indefinite" />
              </circle>
              <rect x="65" y="190" width="30" height="24" rx="2" className="fill-none stroke-violet-400/80" strokeWidth="1.5" />
              <line x1="65" y1="198" x2="95" y2="198" className="stroke-violet-400/60" strokeWidth="1" />
              <circle cx="72" cy="204" r="2" className="fill-violet-400/60" />
              <circle cx="80" cy="204" r="2" className="fill-violet-400" />
              <circle cx="88" cy="204" r="2" className="fill-violet-400/60" />
              <circle cx="72" cy="210" r="2" className="fill-violet-400/60" />
              <circle cx="80" cy="210" r="2" className="fill-violet-400/60" />
              
              {/* Connection Lines */}
              <line x1="200" y1="160" x2="200" y2="108" className="stroke-cyan-400/30" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
              </line>
              <line x1="240" y1="200" x2="292" y2="200" className="stroke-indigo-400/30" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
              </line>
              <line x1="200" y1="240" x2="200" y2="292" className="stroke-emerald-400/30" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2.2s" repeatCount="indefinite" />
              </line>
              <line x1="160" y1="200" x2="108" y2="200" className="stroke-violet-400/30" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="2.8s" repeatCount="indefinite" />
              </line>

              {/* Data Flow Particles */}
              <circle r="3" className="fill-cyan-400">
                <animateMotion dur="3s" repeatCount="indefinite" path="M200,160 L200,108" />
              </circle>
              <circle r="3" className="fill-indigo-400">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M240,200 L292,200" />
              </circle>
              <circle r="3" className="fill-emerald-400">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M200,240 L200,292" />
              </circle>
              <circle r="3" className="fill-violet-400">
                <animateMotion dur="3.8s" repeatCount="indefinite" path="M160,200 L108,200" />
              </circle>

              {/* Outer Ring */}
              <circle cx="200" cy="200" r="140" className="fill-none stroke-slate-700/30" strokeWidth="1" strokeDasharray="8 8">
                <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="60s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Headline */}
          <div className={`text-center max-w-md transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              Smart Compliance.
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Powered by AI.
              </span>
            </h2>
            <p className="text-slate-400 text-base xl:text-lg leading-relaxed">
              Automated compliance tracking, intelligent reminders, and real-time regulatory updates for your MSME business.
            </p>
          </div>

          {/* Feature Pills */}
          <div className={`flex flex-wrap justify-center gap-3 mt-10 transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {[
              { icon: '📋', text: 'GST Tracking' },
              { icon: '🔔', text: 'Auto Reminders' },
              { icon: '🤖', text: 'AI Guidance' },
              { icon: '📊', text: 'Smart Dashboard' }
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm"
              >
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== RIGHT SECTION - Login Form ==================== */}
      <div 
        className={`w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-16 transition-all duration-1000 delay-200 ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
      >
        <div className="w-full max-w-md">
          
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 shadow-lg shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">MSME Compliance Navigator</h1>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Log in
              </h1>
              <p className="text-slate-400">
                Access your MSME Compliance Dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={() => googleLogin()}
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-white hover:bg-slate-50 text-slate-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="relative">Continue with Google</span>
                </>
              )}
            </button>

            {/* Helper Text */}
            <p className="text-center text-slate-500 text-sm mt-4">
              Secure sign-in using your Google account
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">Why Google Sign-in?</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400">Secure</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400">Instant</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400">Private</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-600 text-xs mt-8">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
