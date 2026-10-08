import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrentNeedSelector } from '../components/CurrentNeedSelector';
import { ThemeId } from '../types';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Quote,
  Palette,
  MessageSquare,
  Plus,
  X,
  SlidersHorizontal,
  Moon,
  CloudRain,
  Sunset,
  Trees,
  Coffee,
  Sun,
  Gamepad2,
  Layers,
  Waves,
  Mic,
} from 'lucide-react';

export const MyWorldPage: React.FC = () => {
  const {
    user,
    currentNeed,
    worldConfig,
    setActivePage,
    temporaryCompanionReaction,
    petCompanion,
    moments,
    updatePreferences,
    updateSettings,
    updateCompanion,
    showToast,
  } = useApp();

  const [newFavoriteInput, setNewFavoriteInput] = useState('');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const {
    environment,
    greetingMessage,
    comfortQuote,
    companionState,
    primaryActivity,
  } = worldConfig;

  const isExhausted = currentNeed === 'I’m exhausted';
  const isLetMeBe = currentNeed === 'I just want to be left alone';
  const effectiveCompanionState = temporaryCompanionReaction || companionState;
  const chatbotName = user?.chatbot?.name || 'Lumi';
  const currentFavoriteTags = user?.preferences?.selectedTags || [];

  // Active theme
  const currentTheme = user?.settings?.themeOverride || 'night';

  const themes: { id: ThemeId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'night', label: 'Deep Night', icon: <Moon className="w-3.5 h-3.5" />, color: 'from-indigo-900 to-slate-950' },
    { id: 'rain', label: 'Rainy Mist', icon: <CloudRain className="w-3.5 h-3.5" />, color: 'from-sky-950 to-slate-950' },
    { id: 'sunset', label: 'Sunset Glow', icon: <Sunset className="w-3.5 h-3.5" />, color: 'from-rose-950 to-amber-950' },
    { id: 'nature', label: 'Pine Forest', icon: <Trees className="w-3.5 h-3.5" />, color: 'from-emerald-950 to-slate-950' },
    { id: 'warm', label: 'Cozy Hearth', icon: <Coffee className="w-3.5 h-3.5" />, color: 'from-amber-950 to-stone-950' },
    { id: 'soft', label: 'Clear Sky', icon: <Sun className="w-3.5 h-3.5" />, color: 'from-cyan-950 to-slate-950' },
  ];

  const handleAddFavorite = (tagToAdd: string) => {
    if (!tagToAdd.trim() || !user) return;
    const clean = tagToAdd.trim().toLowerCase();
    if (!currentFavoriteTags.includes(clean)) {
      const updated = [...currentFavoriteTags, clean];
      updatePreferences({
        ...user.preferences,
        selectedTags: updated,
      });
      setNewFavoriteInput('');
      showToast(`Added "${clean}" to your favorites!`);
    }
  };

  const handleRemoveFavorite = (tagToRemove: string) => {
    if (!user) return;
    const updated = currentFavoriteTags.filter((t) => t !== tagToRemove);
    updatePreferences({
      ...user.preferences,
      selectedTags: updated,
    });
    showToast(`Removed "${tagToRemove}"`);
  };

  const popularSuggestions = [
    'lo-fi beats',
    'IU',
    'Crash Landing on You',
    'Studio Ghibli',
    'warm tea',
    'stargazing',
    'cats',
    'cozy novels',
  ];

  // Pick a comforting favorite highlight for the greeting bubble
  const highlightedFavorite = currentFavoriteTags.length > 0
    ? currentFavoriteTags[Math.floor(Math.random() * currentFavoriteTags.length)]
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
      {/* Top Header: Greeting & Quick Theme Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-400">
              {environment.name}
            </span>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors underline decoration-dotted"
            >
              <Palette className="w-3 h-3 text-indigo-400" />
              <span>Change Theme ({themes.find((t) => t.id === currentTheme)?.label || 'Deep Night'})</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            {user?.name ? `Welcome home, ${user.name}.` : 'Welcome home.'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-md">
            {environment.atmosphereDesc}
          </p>
        </div>

        {/* Quick Shortcut to Games */}
        <button
          onClick={() => setActivePage('play')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-emerald-400 font-medium transition-colors"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Stress-Relief Games</span>
        </button>
      </div>

      {/* Instant 1-Click Theme Switcher Bar */}
      {showThemePicker && (
        <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Choose Sanctuary Theme</span>
            </span>
            <button
              onClick={() => setShowThemePicker(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {themes.map((th) => {
              const isActive = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    updateSettings({ themeOverride: th.id });
                    showToast(`Theme changed to ${th.label}`);
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {th.icon}
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* "What do you need right now?" Emotional Selector */}
      <div className="rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 shadow-lg">
        <CurrentNeedSelector />
      </div>

      {/* Focal Sanctuary Hearth: Friendly Friend Message & Quick Actions (Clean, Calm, No Clutter) */}
      <div className="relative rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: environment.backdropStyle }}
        />

        {/* Calm Sanctuary Emblem */}
        <div className="relative z-10 w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Friendly Companion Message from Chatbot Friend */}
        <div className="relative z-10 mt-3 px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 max-w-lg text-xs sm:text-sm text-slate-200 leading-relaxed shadow-lg">
          {isExhausted ? (
            <span>"You’re home now, {user?.name || 'friend'}. Just let your shoulders drop and rest."</span>
          ) : isLetMeBe ? (
            <span className="italic text-slate-400">"Keeping the room perfectly quiet and still for you..."</span>
          ) : highlightedFavorite ? (
            <span>
              "Hey {user?.name || 'friend'}! I’m right here with you. Maybe we can enjoy some <strong className="text-indigo-300 font-semibold">{highlightedFavorite}</strong> and take a deep, slow breath together?"
            </span>
          ) : (
            <span>
              "Welcome home, {user?.name || 'friend'}. Take all the time you need here in your quiet corner."
            </span>
          )}
        </div>

        {/* Comfort quote if available */}
        {comfortQuote && !isLetMeBe && (
          <div className="relative z-10 mt-3 max-w-md flex items-center justify-center gap-2 text-xs italic text-indigo-200/80">
            <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{comfortQuote}</span>
          </div>
        )}

        {/* Three Clear Primary Actions (Talk with Friend Chatbot, Voice / Hear Me, & Stress-Relief Games) */}
        {!isLetMeBe && (
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-lg">
            <button
              onClick={() => setActivePage('chat')}
              className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Talk with {chatbotName}</span>
            </button>

            <button
              onClick={() => setActivePage('hear-me')}
              className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-indigo-300 hover:text-white border border-slate-700/80 font-semibold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Mic className="w-4 h-4 text-indigo-400" />
              <span>Voice / Hear Me</span>
            </button>

            <button
              onClick={() => setActivePage('play')}
              className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-emerald-300 hover:text-white border border-slate-700/80 font-semibold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Stress Games</span>
            </button>
          </div>
        )}
      </div>

      {/* Stress-Relief Mini-Game Showcase Bar */}
      {!isLetMeBe && (
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Relieve Stress & Unwind</h3>
            </div>
            <button
              onClick={() => setActivePage('play')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View all games</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActivePage('play')}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/90 hover:border-emerald-500/50 text-left transition-all flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white group-hover:text-emerald-300">Stone Stacking</p>
                <p className="text-[11px] text-slate-400 truncate">Balance smooth river pebbles</p>
              </div>
            </button>

            <button
              onClick={() => setActivePage('play')}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/90 hover:border-amber-500/50 text-left transition-all flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                <Waves className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white group-hover:text-amber-300">Zen Sand Garden</p>
                <p className="text-[11px] text-slate-400 truncate">Rake serene wave patterns</p>
              </div>
            </button>

            <button
              onClick={() => setActivePage('play')}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/90 hover:border-indigo-500/50 text-left transition-all flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300">Bubble Wrap Pop</p>
                <p className="text-[11px] text-slate-400 truncate">Sensory tactile bubble popping</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Your Favorite Things Sanctuary Card */}
      {!isLetMeBe && (
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Your Favorite Things</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/20">
                  {currentFavoriteTags.length} active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {chatbotName} and your sanctuary weave these into your conversations and relaxing atmosphere.
              </p>
            </div>

            <button
              onClick={() => setActivePage('onboarding')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-medium text-indigo-200 transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Full Questionnaire</span>
            </button>
          </div>

          {/* Active Favorite Badges */}
          {currentFavoriteTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentFavoriteTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-xs font-medium text-indigo-200 capitalize shadow-xs"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveFavorite(tag)}
                    aria-label={`Remove ${tag}`}
                    className="p-0.5 rounded-full hover:bg-indigo-500/40 text-indigo-400 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 italic">
              No favorites saved yet. Add a few below or take the questionnaire to make {chatbotName} know your world!
            </div>
          )}

          {/* Quick Suggestions & Inline Custom Add */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2.5">
            <span className="text-[11px] font-medium text-slate-400">
              Quick tap to add comforts:
            </span>

            <div className="flex flex-wrap gap-1.5">
              {popularSuggestions.map((sug) => {
                const isAlreadySelected = currentFavoriteTags.includes(sug);
                return (
                  <button
                    key={sug}
                    onClick={() => (isAlreadySelected ? handleRemoveFavorite(sug) : handleAddFavorite(sug))}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      isAlreadySelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {isAlreadySelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{sug}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddFavorite(newFavoriteInput);
              }}
              className="flex gap-2 max-w-sm mt-1"
            >
              <input
                type="text"
                value={newFavoriteInput}
                onChange={(e) => setNewFavoriteInput(e.target.value)}
                placeholder="+ Type any favorite thing (e.g. coffee, anime, k-pop)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newFavoriteInput.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Special State: "I'M EXHAUSTED" */}
      {isExhausted && (
        <div className="rounded-3xl bg-slate-950/70 border border-slate-800/80 p-8 text-center max-w-xl mx-auto flex flex-col items-center gap-3">
          <Moon className="w-8 h-8 text-indigo-400 animate-pulse" />
          <h2 className="text-lg font-semibold text-slate-200">
            You don’t have to do anything right now.
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Close your eyes, let the soft sounds gently hold the room, and take as long as you need. Everything else can wait.
          </p>
        </div>
      )}

      {/* Special State: "JUST LET ME BE" */}
      {isLetMeBe && (
        <div className="rounded-3xl bg-slate-950/40 border border-slate-800/60 p-8 text-center max-w-md mx-auto">
          <p className="text-xs text-slate-400 italic">
            This space is completely still for you. No activities, advice, or demands.
          </p>
        </div>
      )}
    </div>
  );
};
