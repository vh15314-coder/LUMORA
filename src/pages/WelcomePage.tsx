import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Eye, EyeOff, ShieldCheck, Heart } from 'lucide-react';

interface WelcomePageProps {
  onStartOnboarding: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStartOnboarding }) => {
  const { loginDemoUser, loginUser } = useApp();
  const [authMode, setAuthMode] = useState<'welcome' | 'signup' | 'signin'>('welcome');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    loginUser({
      id: `user_${Date.now()}`,
      name: email.split('@')[0] || 'Friend',
      email,
      isDemo: false,
      companion: 'cat',
      chatbot: {
        name: 'Lumi',
        personality: 'Gentle friend',
      },
      preferences: {
        categories: {
          animals: ['cats'],
          music: ['lo-fi'],
          environments: ['rain'],
          books: ['books'],
          hobbies: [],
          style: ['minimal'],
          games: [],
          food: [],
          movies: [],
          kdramas: [],
          cdramas: [],
          anime: [],
          sports: [],
          colours: [],
          places: [],
          creativeActivities: [],
          happyActivities: [],
          soundscapes: ['rain'],
        },
        selectedTags: ['cats', 'rain', 'books'],
      },
      settings: {
        soundEnabled: true,
        volume: 0.5,
        isMuted: false,
        voiceInputEnabled: true,
        voiceOutputEnabled: true,
        voiceSpeed: 1.0,
        voicePitch: 1.0,
        animationIntensity: 'normal',
        uiDensity: 'normal',
        quietMode: false,
        highContrast: false,
        themeOverride: 'night',
      },
      createdAt: new Date().toISOString(),
    });
  };

  const handleStartPersonalization = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Friend';
    setErrorMessage('');

    loginUser({
      id: `user_${Date.now()}`,
      name: finalName,
      email: email.trim() || `${finalName.toLowerCase()}@lumora.world`,
      isDemo: false,
      companion: 'cat',
      chatbot: {
        name: 'Lumi',
        personality: 'Gentle friend',
      },
      preferences: {
        categories: {
          animals: [],
          music: [],
          environments: [],
          books: [],
          hobbies: [],
          style: [],
          games: [],
          food: [],
          movies: [],
          kdramas: [],
          cdramas: [],
          anime: [],
          sports: [],
          colours: [],
          places: [],
          creativeActivities: [],
          happyActivities: [],
          soundscapes: [],
        },
        selectedTags: [],
      },
      settings: {
        soundEnabled: true,
        volume: 0.5,
        isMuted: false,
        voiceInputEnabled: true,
        voiceOutputEnabled: true,
        voiceSpeed: 1.0,
        voicePitch: 1.0,
        animationIntensity: 'normal',
        uiDensity: 'normal',
        quietMode: false,
        highContrast: false,
      },
      createdAt: new Date().toISOString(),
    });
    onStartOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 text-slate-100">
      <div className="w-full max-w-md mx-auto rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl text-slate-100">
        {/* Brand Kicker */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
            LUMORA
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">Personalized Digital Wellbeing</span>
        </div>

        {authMode === 'welcome' && (
          <div className="flex flex-col items-center text-center">
            {/* Friendly sanctuary preview emblem */}
            <div className="my-4 w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Welcome to your world.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              A private digital sanctuary crafted entirely around your favorite things, music, and quiet comforts.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={onStartOnboarding}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-lg shadow-indigo-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span>Create My World & Choose Favorites</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={loginDemoUser}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 font-medium text-sm text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Try Demo (Luna’s World)</span>
              </button>

              <button
                onClick={() => setAuthMode('signin')}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Already have a world? <span className="text-indigo-400 underline">Sign In</span>
              </button>
            </div>
          </div>
        )}

        {authMode === 'signup' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Create Your World</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Tell us what to call you. Next, we will ask you about your favorite music, movies, books, animals, and cozy places.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleStartPersonalization} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name (or Nickname)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Luna or Maya"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-md shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>Choose My Favorite Things</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setAuthMode('welcome')}
              className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-200"
            >
              Back
            </button>
          </div>
        )}

        {authMode === 'signin' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-xs text-slate-400 mb-6">Enter your email to re-enter your sanctuary.</p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-md shadow-indigo-600/30 transition-colors"
              >
                Sign In to My World
              </button>
            </form>

            <button
              onClick={() => setAuthMode('welcome')}
              className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-200"
            >
              Back
            </button>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Private, client-first, safe sanctuary</span>
        </div>
      </div>
    </div>
  );
};
