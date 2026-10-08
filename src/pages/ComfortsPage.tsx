import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AmbienceType } from '../types';
import {
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  Mic,
  Waves,
  CloudRain,
  Flame,
  Trees,
  Music2,
  Bird,
  CheckCircle2,
  Circle,
  Wind,
  Coffee,
  RotateCcw,
} from 'lucide-react';

export const ComfortsPage: React.FC = () => {
  const {
    user,
    setActivePage,
    isAmbiencePlaying,
    activeAmbience,
    ambienceVolume,
    isMuted,
    toggleAmbience,
    setAmbienceType,
    setAmbienceVolume,
    toggleMute,
    stopAmbience,
    showToast,
  } = useApp();

  const userName = user?.name || 'Friend';
  const chatbotName = user?.chatbot?.name || 'Lumi';
  const userFavorites = user?.preferences?.selectedTags || [];
  const topFavorite = userFavorites.length > 0 ? userFavorites[0] : null;

  // Voice Speech Synthesis state for reading comforting words
  const [isSpeakingWords, setIsSpeakingWords] = useState(false);
  const [comfortWordsIndex, setComfortWordsIndex] = useState(0);

  const comfortPhrases = [
    `Take a slow, deep breath, ${userName}. You don't have to carry anything heavy right now. Everything can wait while you rest here.`,
    `You are safe, ${userName}. Even if today felt chaotic, this moment belongs entirely to your peace.`,
    `Give yourself permission to pause. You are doing enough, and you are loved just as you are.`,
    `Let your chest soften and your shoulders loosen. You are home in your quiet sanctuary.`,
  ];

  const currentComfortPhrase = comfortPhrases[comfortWordsIndex % comfortPhrases.length];

  // Handle Speech Read Aloud
  const handleSpeakComfortWords = () => {
    if (user?.settings.quietMode) {
      showToast('Quiet Mode is active. Sound is muted.');
      return;
    }
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeakingWords) {
      window.speechSynthesis.cancel();
      setIsSpeakingWords(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentComfortPhrase);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeakingWords(false);
      utterance.onerror = () => setIsSpeakingWords(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeakingWords(true);
    }
  };

  // Calming Breathing Circle state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('Inhale');
      setBreathCount(4);
      return;
    }

    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Switch phase
          setBreathPhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Cozy Self-Care Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    { id: 'shoulders', text: 'Drop your shoulders down & gently unclench your jaw' },
    { id: 'water', text: 'Take a slow, warm sip of tea or water' },
    { id: 'cozy', text: 'Wrap yourself in a blanket or settle into a comfortable seat' },
    { id: 'eyes', text: 'Rest your eyes away from bright screens for 30 seconds' },
  ];

  // Soundscape Options
  const soundscapes: { type: AmbienceType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { type: 'ocean', label: 'Ocean Waves', desc: 'Rhythmic tides gently kissing the shore', icon: <Waves className="w-5 h-5 text-cyan-400" />, color: 'hover:border-cyan-500/50' },
    { type: 'instrumental', label: 'Peaceful Chimes', desc: 'Soft acoustic bells floating in air', icon: <Music2 className="w-5 h-5 text-indigo-400" />, color: 'hover:border-indigo-500/50' },
    { type: 'fireplace', label: 'Warm Fireplace', desc: 'Gentle crackle of glowing hearth embers', icon: <Flame className="w-5 h-5 text-amber-400" />, color: 'hover:border-amber-500/50' },
    { type: 'forest', label: 'Pine Forest', desc: 'Pine breeze rustling through silent woods', icon: <Trees className="w-5 h-5 text-emerald-400" />, color: 'hover:border-emerald-500/50' },
    { type: 'rain', label: 'Soft Rain', desc: 'Gentle raindrops tapping on windowpanes', icon: <CloudRain className="w-5 h-5 text-sky-400" />, color: 'hover:border-sky-500/50' },
    { type: 'birds', label: 'Morning Songbirds', desc: 'Peaceful chirping in dawn light', icon: <Bird className="w-5 h-5 text-teal-400" />, color: 'hover:border-teal-500/50' },
  ];

  const handleSelectSound = (type: AmbienceType) => {
    if (activeAmbience === type && isAmbiencePlaying) {
      toggleAmbience(); // pause
    } else {
      setAmbienceType(type);
      if (!isAmbiencePlaying) {
        toggleAmbience(); // play
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('my-world')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-xl p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('hear-me')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Voice / Hear Me</span>
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <Heart className="w-4 h-4 fill-indigo-400/20 text-indigo-400" />
          <span>SIMPLE & CALM SANCTUARY</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Comforts for Body & Mind
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Everything here is designed to be gentle, simple, and clear. Relax your senses with calming sounds, hear comforting words, and take a soft breath.
        </p>

        {topFavorite && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-950/50 border border-indigo-900/50 text-[11px] text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Personalized for your love of <strong className="capitalize">{topFavorite}</strong></span>
          </div>
        )}
      </div>

      {/* SECTION 1: VOICE & HEAR COMFORT WORDS (Explicitly answers user request!) */}
      <div className="rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Voice & Hear Sanctuary
              </h2>
              <p className="text-xs text-slate-400">
                Hear soothing words read aloud, or open Voice Me to speak your mind freely.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('hear-me')}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Open Voice / Hear Sanctuary</span>
          </button>
        </div>

        {/* Live Comfort Phrase Card with 1-Click "Hear" Read Aloud */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>A note from {chatbotName}:</span>
            </span>
            <button
              onClick={() => {
                if (isSpeakingWords) window.speechSynthesis?.cancel();
                setIsSpeakingWords(false);
                setComfortWordsIndex((prev) => prev + 1);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New note</span>
            </button>
          </div>

          <p className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed">
            "{currentComfortPhrase}"
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button
              onClick={handleSpeakComfortWords}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSpeakingWords
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200'
              }`}
            >
              {isSpeakingWords ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              <span>{isSpeakingWords ? 'Stop voice reading' : 'Hear words out loud (Voice)'}</span>
            </button>

            <span className="text-[10px] text-slate-500">
              Spoken with calming speech
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: CALMING SOUNDS TO HEAR (Crystal clear, 1-click audio) */}
      <div className="rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Calming Sounds to Hear</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap any sound to listen immediately. No setup needed.
          </p>
        </div>

        {/* 6 Clear Sound Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {soundscapes.map((s) => {
            const isThisPlaying = activeAmbience === s.type && isAmbiencePlaying;
            return (
              <button
                key={s.type}
                onClick={() => handleSelectSound(s.type)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${s.color} ${
                  isThisPlaying
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800/90 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {s.icon}
                  </div>
                  {isThisPlaying && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Playing
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-white">{s.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Sound Player Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAmbience}
              className={`p-2.5 rounded-xl transition-colors ${
                isAmbiencePlaying
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              aria-label={isAmbiencePlaying ? 'Pause sound' : 'Play sound'}
            >
              {isAmbiencePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div>
              <p className="text-xs font-semibold text-slate-200 capitalize flex items-center gap-1.5">
                <span>{activeAmbience} Sound</span>
                {isAmbiencePlaying && !isMuted && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </p>
              <p className="text-[10px] text-slate-400">
                {isAmbiencePlaying ? (isMuted ? 'Muted' : 'Playing softly') : 'Paused'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || ambienceVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-amber-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : ambienceVolume}
                onChange={(e) => setAmbienceVolume(parseFloat(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {isAmbiencePlaying && (
              <button
                onClick={stopAmbience}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: 2-COLUMN LAYOUT FOR GENTLE BREATH & COZY CHECKLIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Simple 3-Breath Calming Circle */}
        <div className="rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col items-center justify-between text-center gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center justify-center gap-2">
              <Wind className="w-4 h-4 text-indigo-400" />
              <span>Simple Breathing Calm</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Slow down your heart rate in 1 minute.
            </p>
          </div>

          {/* Visual Circle */}
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <div
              className={`absolute rounded-full bg-gradient-to-tr from-indigo-600/30 to-violet-500/30 border border-indigo-500/40 transition-all duration-1000 ${
                isBreathingActive && breathPhase === 'Inhale'
                  ? 'w-36 h-36 scale-110 shadow-lg shadow-indigo-500/20'
                  : isBreathingActive && breathPhase === 'Hold'
                  ? 'w-36 h-36 scale-110 ring-2 ring-indigo-400/50'
                  : isBreathingActive && breathPhase === 'Exhale'
                  ? 'w-24 h-24 scale-90 opacity-70'
                  : 'w-28 h-28'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-sm font-semibold text-white">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="text-xs text-indigo-300 mt-0.5">
                {isBreathingActive ? `${breathCount}s` : 'Tap start'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all"
          >
            {isBreathingActive ? 'Pause Breathing' : 'Start 3 Soft Breaths'}
          </button>
        </div>

        {/* Cozy Self-Care Little Checklist */}
        <div className="rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Cozy Comfort Steps</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Zero pressure. Tap as you take care of yourself.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {checklist.map((item) => {
              const isChecked = checkedItems[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-slate-300 line-through opacity-80'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className="text-xs leading-relaxed">{item.text}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActivePage('play')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Try Stress-Relief Mini Games</span>
          </button>
        </div>
      </div>
    </div>
  );
};
