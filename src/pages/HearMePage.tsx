import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  BookmarkPlus,
  Trash2,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const HearMePage: React.FC = () => {
  const { user, currentNeed, addMoment, setActivePage, showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isCrisisMessage, setIsCrisisMessage] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isQuiet = user?.settings.quietMode;

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && !isQuiet && user?.settings.voiceInputEnabled) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [isQuiet, user?.settings.voiceInputEnabled]);

  const toggleListening = () => {
    if (isQuiet) {
      showToast('Voice input is disabled during Quiet Mode.');
      return;
    }
    if (!recognitionRef.current) {
      showToast('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeakResponse = () => {
    if (isQuiet || !response) return;
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);
    setIsCrisisMessage(false);

    try {
      const payload = {
        userName: user?.name || 'Friend',
        currentNeed,
        userMessage: inputText.trim(),
        preferences: user?.preferences?.selectedTags || [],
        companion: user?.companion || 'cat',
        quietMode: isQuiet,
      };

      const res = await fetch('/api/hear-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Network error');
      }

      const data = await res.json();
      setResponse(data.response);
      if (data.isCrisisGuidance) {
        setIsCrisisMessage(true);
      }
    } catch {
      // Local graceful fallback
      setResponse(
        'I am right here with you. Take all the time you need, and know you do not have to carry everything all at once.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMoment = () => {
    if (!response && !inputText) return;
    const textToSave = response ? `"${inputText}" — Response: ${response}` : inputText;
    addMoment(textToSave, 'Hear Me Reflection');
  };

  const handleClear = () => {
    setInputText('');
    setResponse(null);
    setIsCrisisMessage(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActivePage('my-world')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <span className="text-xs text-indigo-400 font-medium">Hear Me Sanctuary</span>
      </div>

      <div className="rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800 p-6 shadow-xl">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Mic className="w-4 h-4" />
            <span>VOICE & HEAR SANCTUARY</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            Speak or Type Whatever is on Your Mind
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Use your voice or keyboard to express how you are feeling. You can also listen to responses read aloud with a calm voice.
          </p>
        </div>

        {/* Quick Voice Bar Action */}
        {!isQuiet && (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-600/30 text-indigo-300'}`}>
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {isListening ? 'Listening to your voice...' : 'Voice Input (Microphone)'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isListening ? 'Speak naturally. Tap button to stop.' : 'Click below to speak instead of typing.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleListening}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Stop Listening' : 'Speak into Microphone'}</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell me how it feels, or click 'Speak into Microphone' to say it out loud..."
              rows={5}
              aria-label="Your thoughts and feelings"
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Thinking warmly...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Share Softly</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Gentle Response Area */}
        {response && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            {isCrisisMessage && (
              <div className="flex items-start gap-2 p-3 mb-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Support is available 24/7. Call or text 988 to connect with free, confidential help.
                </span>
              </div>
            )}

            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-slate-100 text-sm sm:text-base leading-relaxed font-sans">
              <p className="italic">"{response}"</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              {!isQuiet ? (
                <button
                  type="button"
                  onClick={handleSpeakResponse}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse'
                      : 'bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                  <span>{isSpeaking ? 'Stop Voice Reading' : 'Hear Response Out Loud (Voice)'}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleSaveMoment}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-indigo-300 transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save as Moment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
