import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompanionId, ThemeId, ChatbotPersonality, AmbienceType } from '../types';
import { CompanionAvatar } from '../components/CompanionAvatar';
import {
  Volume2,
  VolumeX,
  Mic,
  Moon,
  Sparkles,
  Sliders,
  Palette,
  Shield,
  RotateCcw,
  LogOut,
  Trash2,
  ArrowLeft,
  Check,
  Eye,
  AlertTriangle,
  MessageSquare,
  Compass,
  Plus,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { storage } from '../lib/storage';

export const ProfileSettingsPage: React.FC = () => {
  const {
    user,
    updateUserName,
    updateCompanion,
    updateChatbot,
    updateSettings,
    updatePreferences,
    toggleQuietMode,
    resetPersonalization,
    clearAllMoments,
    logout,
    setActivePage,
    showToast,
  } = useApp();

  const [nameInput, setNameInput] = useState(user?.name || 'Luna');
  const [botNameInput, setBotNameInput] = useState(user?.chatbot?.name || 'Lumi');
  const [botPersonality, setBotPersonality] = useState<ChatbotPersonality>(
    user?.chatbot?.personality || 'Gentle friend'
  );
  const [customColor, setCustomColor] = useState(user?.settings.customAccentColor || '#818cf8');
  const [newFavoriteTag, setNewFavoriteTag] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
  const [confirmClearMomentsOpen, setConfirmClearMomentsOpen] = useState(false);

  const currentFavoriteTags = user?.preferences?.selectedTags || [];

  const handleAddFavorite = (tagToAdd: string) => {
    if (!tagToAdd.trim() || !user) return;
    const clean = tagToAdd.trim().toLowerCase();
    if (!currentFavoriteTags.includes(clean)) {
      const updated = [...currentFavoriteTags, clean];
      updatePreferences({
        ...user.preferences,
        selectedTags: updated,
      });
      setNewFavoriteTag('');
    }
  };

  const handleRemoveFavorite = (tagToRemove: string) => {
    if (!user) return;
    const updated = currentFavoriteTags.filter((t) => t !== tagToRemove);
    updatePreferences({
      ...user.preferences,
      selectedTags: updated,
    });
  };

  const commonCategories = [
    {
      name: 'Music & Artists',
      items: ['lo-fi', 'k-pop', 'classical', 'ambient', 'jazz', 'piano', 'IU', 'BTS', 'Chopin', 'Laufey'],
    },
    {
      name: 'K-Dramas & C-Dramas',
      items: ['Crash Landing on You', 'Goblin', 'Twenty-Five Twenty-One', 'Hometown Cha-Cha-Cha', 'Hidden Love', 'Meet Yourself', 'Reply 1988'],
    },
    {
      name: 'Anime & Movies',
      items: ['Studio Ghibli', 'Spirited Away', 'Frieren', 'Jujutsu Kaisen', 'Spy x Family', 'Your Name', 'cozy fantasy films'],
    },
    {
      name: 'Animals & Birds',
      items: ['cats', 'dogs', 'bunnies', 'giant pandas', 'red pandas', 'foxes', 'songbirds', 'owls', 'capybaras', 'otters'],
    },
    {
      name: 'Books & Novels',
      items: ['books', 'reading', 'novels', 'cozy fantasy', 'poetry', 'manga', 'Haruki Murakami', 'The Little Prince'],
    },
    {
      name: 'Games & Gentle Movement',
      items: ['Animal Crossing', 'Stardew Valley', 'Genshin Impact', 'Zelda', 'Minecraft', 'quiet walking', 'yoga', 'cycling'],
    },
    {
      name: 'Comfort Food & Drinks',
      items: ['warm matcha latte', 'chamomile tea', 'pour-over coffee', 'hot chocolate', 'ramen', 'fresh croissants', 'sushi', 'steamed dumplings'],
    },
    {
      name: 'Environments & Places',
      items: ['rain', 'night', 'sunset beach', 'forest', 'mountains', 'snow', 'fireplace', 'quiet library', 'corner cafe'],
    },
    {
      name: 'Visual Aesthetics & Colours',
      items: ['minimalist', 'cozy dark', 'soft pastel', 'cottagecore', 'midnight blue', 'lavender', 'sage green', 'warm amber', 'dusty rose'],
    },
    {
      name: 'Hobbies & Moments of Joy',
      items: ['drawing', 'watercolor painting', 'bullet journaling', 'baking', 'film photography', 'listening to rain', 'curling up in blanket'],
    },
  ];

  const companions: { id: CompanionId; label: string }[] = [
    { id: 'cat', label: 'Cat' },
    { id: 'dog', label: 'Dog' },
    { id: 'bunny', label: 'Bunny' },
    { id: 'panda', label: 'Panda' },
  ];

  const themes: { id: ThemeId; label: string; desc: string; previewColor: string }[] = [
    { id: 'night', label: 'Night', desc: 'Deep indigo & starlit blue', previewColor: '#818cf8' },
    { id: 'soft', label: 'Soft', desc: 'Gentle slate & sky mist', previewColor: '#38bdf8' },
    { id: 'nature', label: 'Nature', desc: 'Earthy sage & moss greens', previewColor: '#34d399' },
    { id: 'warm', label: 'Warm', desc: 'Sunset amber & peach light', previewColor: '#f97316' },
    { id: 'custom', label: 'Custom', desc: 'Personal accent override', previewColor: customColor },
    { id: 'auto', label: 'Auto', desc: 'Harmonizes with time of day', previewColor: '#94a3b8' },
  ];

  const personalities: ChatbotPersonality[] = [
    'Gentle friend',
    'Cozy companion',
    'Playful friend',
    'Quiet listener',
    'Encouraging companion',
    'Custom personality',
  ];

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
    }
  };

  const handleBotSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateChatbot({
      name: botNameInput.trim() || 'Lumi',
      personality: botPersonality,
    });
  };

  const currentTheme = user?.settings.themeOverride || 'auto';

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6 relative z-10 text-slate-100">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('my-world')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <span className="text-xs text-indigo-400 font-medium">Sanctuary Configuration</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Profile & Environment Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Everything is fully editable and stays saved locally in your browser.
        </p>
      </div>

      {/* Quiet Mode Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Quiet Mode</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Silences audio, turns off speech synthesis, suppresses non-essential motes, and calms visual motion.
          </p>
        </div>

        <button
          onClick={toggleQuietMode}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            user?.settings.quietMode
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {user?.settings.quietMode ? 'Active (Quiet)' : 'Enable Quiet'}
        </button>
      </div>

      {/* User & Companion Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your Name
          </h3>
          <form onSubmit={handleNameSave} className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
            >
              Update
            </button>
          </form>
        </div>

        {/* Chatbot Companion */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Companion Presence
          </h3>
          <form onSubmit={handleBotSave} className="flex flex-col gap-2.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={botNameInput}
                onChange={(e) => setBotNameInput(e.target.value)}
                placeholder="Companion name"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
              >
                Save
              </button>
            </div>
            <select
              value={botPersonality}
              onChange={(e) => {
                const p = e.target.value as ChatbotPersonality;
                setBotPersonality(p);
                updateChatbot({ personality: p });
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
            >
              {personalities.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>

      {/* Companion Animal Selection */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Chosen Animal Companion
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {companions.map((comp) => {
            const isSelected = user?.companion === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => updateCompanion(comp.id)}
                className={`p-3 rounded-2xl border flex flex-col items-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <CompanionAvatar companion={comp.id} state="idle" size="sm" />
                <span className="text-xs font-semibold text-slate-200 mt-2">{comp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Favorite Things & Comforts Management */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Favorite Things ({currentFavoriteTags.length} active)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These dictate what sounds, decorations, environment, and comforts greet you in My World.
            </p>
          </div>

          <button
            onClick={() => setActivePage('onboarding')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-medium text-indigo-200 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Retake Questionnaire</span>
          </button>
        </div>

        {/* Current Active Tags */}
        <div className="flex flex-wrap gap-2">
          {currentFavoriteTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-xs font-medium text-indigo-200 capitalize shadow-xs"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveFavorite(tag)}
                className="p-0.5 rounded-full hover:bg-indigo-500/40 text-indigo-400 hover:text-white transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Categories to explore and add */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-3">
          <span className="text-[11px] font-medium text-slate-400">
            Tap any tag to toggle your favorite things:
          </span>

          {commonCategories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                {cat.name}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => {
                  const isSelected = currentFavoriteTags.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => (isSelected ? handleRemoveFavorite(item) : handleAddFavorite(item))}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add custom favorite input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddFavorite(newFavoriteTag);
            }}
            className="flex gap-2 max-w-sm mt-1"
          >
            <input
              type="text"
              value={newFavoriteTag}
              onChange={(e) => setNewFavoriteTag(e.target.value)}
              placeholder="+ Add any favorite thing..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newFavoriteTag.trim()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 transition-colors"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Theme Override & Manual Accent Color */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sanctuary Theme & Colors
          </h3>
          <span className="text-[11px] text-slate-400">Manual choice overrides auto</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {themes.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => updateSettings({ themeOverride: t.id })}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{t.label}</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: t.previewColor }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">{t.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Accent Color Picker */}
        <div className="mt-2 flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                const c = e.target.value;
                setCustomColor(c);
                updateSettings({
                  customAccentColor: c,
                  themeOverride: 'custom',
                });
              }}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              aria-label="Pick custom accent color"
            />
            <div>
              <span className="text-xs text-slate-200 font-medium">Custom Accent Color</span>
              <p className="text-[11px] text-slate-400">Instantly changes button and glow tones</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-400">{customColor}</span>
        </div>
      </div>

      {/* Sound & Voice Synthesis Settings */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Sound & Voice Options
        </h3>

        {/* Voice synthesis toggle & speed */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-200">Voice Synthesis (Read responses aloud)</span>
            <p className="text-[11px] text-slate-400">Natural browser speech synthesis</p>
          </div>
          <button
            onClick={() => updateSettings({ voiceOutputEnabled: !user?.settings.voiceOutputEnabled })}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              user?.settings.voiceOutputEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {user?.settings.voiceOutputEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Voice Input */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-200">Microphone Input</span>
            <p className="text-[11px] text-slate-400">Speak softly to your companion</p>
          </div>
          <button
            onClick={() => updateSettings({ voiceInputEnabled: !user?.settings.voiceInputEnabled })}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              user?.settings.voiceInputEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {user?.settings.voiceInputEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Animation Motion */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-200">Animation Motion</span>
            <p className="text-[11px] text-slate-400">Breathing particles and visual pacing</p>
          </div>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['normal', 'subtle', 'none'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSettings({ animationIntensity: mode })}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize ${
                  user?.settings.animationIntensity === mode
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* High contrast mode */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-200">High Contrast Mode</span>
            <p className="text-[11px] text-slate-400">Maximal legibility with deep pure contrast</p>
          </div>
          <button
            onClick={() => updateSettings({ highContrast: !user?.settings.highContrast })}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              user?.settings.highContrast ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {user?.settings.highContrast ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Account & Sanctuary Data */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400/80">
          Account & Local Sanctuary State
        </h3>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Personalization</span>
          </button>

          <button
            onClick={() => setConfirmClearMomentsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Moments</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => setConfirmDeleteAllOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-medium text-rose-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Local Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
            <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-base font-bold text-white">Reset personalization?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              This resets your tags, companion, chatbot name, and theme to peaceful defaults.
            </p>
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetPersonalization();
                  setConfirmResetOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmClearMomentsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
            <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-base font-bold text-white">Clear all saved moments?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              This removes all notes and saved messages from this browser.
            </p>
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => setConfirmClearMomentsOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllMoments();
                  setConfirmClearMomentsOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-semibold text-white"
              >
                Clear Moments
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
            <Trash2 className="w-6 h-6 text-rose-400 mb-2" />
            <h3 className="text-base font-bold text-white">Delete all local data?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              This completely wipes all user preferences, moments, and chat history.
            </p>
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => setConfirmDeleteAllOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  storage.clearAllData();
                  logout();
                  setConfirmDeleteAllOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-semibold text-white"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
