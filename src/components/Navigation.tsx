import React from 'react';
import { useApp } from '../context/AppContext';
import { ActivePage } from '../types';
import {
  Compass,
  Heart,
  Sparkles,
  Bookmark,
  User,
  MessageSquare,
  Moon,
  Mic,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activePage, setActivePage, user, toggleQuietMode, currentNeed } = useApp();
  const chatbotName = user?.chatbot?.name || 'Lumi';

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'my-world', label: 'My World', icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'comforts', label: 'Comforts', icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'hear-me', label: 'Voice / Hear', icon: <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> },
    { id: 'play', label: 'Games', icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> },
    { id: 'chat', label: chatbotName, icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'moments', label: 'Moments', icon: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <>
      {/* Desktop Header Navigation */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/60 border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & World Name */}
          <button
            onClick={() => setActivePage('my-world')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              L
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">
                LUMORA
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {user?.name ? `${user.name}’s World` : 'Digital Sanctuary'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('onboarding')}
              title="Personalize My Favorite Things"
              aria-label="Open favorites questionnaire"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                activePage === 'onboarding'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-indigo-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">My Favorites</span>
            </button>

            <button
              onClick={toggleQuietMode}
              title={user?.settings.quietMode ? 'Disable Quiet Mode' : 'Enable Quiet Mode'}
              aria-label="Toggle quiet mode"
              className={`p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                user?.settings.quietMode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl bg-slate-950/95 border-t border-slate-800/80 py-1.5 px-1 shadow-2xl overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center justify-between min-w-full px-1 gap-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[44px] flex-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="text-[9px] mt-0.5 truncate max-w-[46px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
