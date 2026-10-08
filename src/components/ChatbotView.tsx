import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookmarkPlus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Settings,
  Smile,
  ShieldAlert,
} from 'lucide-react';
import { ChatbotPersonality } from '../types';

interface ChatbotViewProps {
  onBack?: () => void;
  isInline?: boolean;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ onBack, isInline = false }) => {
  const {
    user,
    currentNeed,
    chatMessages,
    sendMessage,
    clearChat,
    isChatLoading,
    updateChatbot,
    addMoment,
    showToast,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isQuiet = user?.settings.quietMode;
  const chatbotName = user?.chatbot?.name || 'Lumi';
  const chatbotPersonality = user?.chatbot?.personality || 'Gentle friend';

  const personalities: ChatbotPersonality[] = [
    'Gentle friend',
    'Cozy companion',
    'Playful friend',
    'Quiet listener',
    'Encouraging companion',
    'Custom personality',
  ];

  // Quick reply suggestions tailored to current need
  const quickRepliesByNeed: Record<string, string[]> = {
    'I want to calm down': [
      'Can you help me take a slow breath?',
      'My heart feels a little restless.',
      'Just sitting quietly here.',
    ],
    'I just want to feel heard': [
      'I had a really heavy day today.',
      'I felt a bit overwhelmed earlier.',
      'Just needed to say this out loud.',
    ],
    'I want something relaxing': [
      'Tell me something gentle.',
      'What’s a cozy thought for tonight?',
      'Let’s listen to the sounds together.',
    ],
    'I’m exhausted': [
      'I’m really tired today.',
      'Everything felt like too much today.',
      'Just resting my eyes for a bit.',
    ],
    'I feel lonely': [
      'Sometimes solitude feels a bit quiet.',
      'I’m glad you’re here with me.',
      'Can we just chat about simple things?',
    ],
    'I’m having a bad day': [
      'Today didn’t go the way I hoped.',
      'I need a soft place to land.',
      'Could use a little warmth right now.',
    ],
    'I just want to feel better': [
      'Taking it one tiny step at a time.',
      'What’s a small thing that brings peace?',
      'Glad to be in my little sanctuary.',
    ],
    'Distract me gently': [
      'Tell me a fun gentle fact.',
      'What games or stories do you like?',
      'Let’s talk about something lighthearted.',
    ],
    'I just want to be left alone': [
      'Just sitting in silence.',
      'No words needed right now.',
    ],
  };

  const currentQuickReplies =
    quickRepliesByNeed[currentNeed] || ['I’m glad to be here.', 'Just checking in.'];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Speech Recognition Setup
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
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
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
      showToast('Voice input is disabled in Quiet Mode.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser. You can type freely.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech Output
  const handleSpeak = (text: string, msgId: string) => {
    if (isQuiet) {
      showToast('Voice output is disabled in Quiet Mode.');
      return;
    }
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = user?.settings.voiceSpeed || 0.95;
      utterance.pitch = user?.settings.voicePitch || 1.0;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageId(msgId);
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend ?? inputVal;
    if (!text.trim() || isChatLoading) return;
    setInputVal('');
    await sendMessage(text);
  };

  const handleSaveAsMoment = (text: string) => {
    addMoment(text, `${chatbotName}’s gentle message`, 'chat');
  };

  return (
    <div className={`w-full flex flex-col ${isInline ? 'h-[500px]' : 'min-h-[620px] max-w-3xl mx-auto px-4 py-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-t-3xl bg-slate-900/90 border border-slate-800 border-b-slate-800/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-600/30 shrink-0">
            {chatbotName.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{chatbotName}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {chatbotPersonality}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personal Digital Companion · {currentNeed}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {speakingMessageId && (
            <button
              onClick={handleStopSpeaking}
              title="Stop speaking"
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1 animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Voice</span>
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Companion settings"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={clearChat}
            title="Clear chat"
            aria-label="Clear chat"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Companion Personality & Name Drawer */}
      {showSettings && (
        <div className="p-4 bg-slate-950/90 border-x border-b border-slate-800 text-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Companion Name:</span>
            <input
              type="text"
              value={chatbotName}
              onChange={(e) => updateChatbot({ name: e.target.value })}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs w-36"
              placeholder="e.g. Lumi"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-slate-300">Personality Tone:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {personalities.map((tone) => (
                <button
                  key={tone}
                  onClick={() => updateChatbot({ personality: tone })}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] transition-colors ${
                    chatbotPersonality === tone
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950/80 border-x border-slate-800 flex flex-col gap-3.5">
        {chatMessages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 text-indigo-400/70 mb-2" />
            <p className="text-sm font-medium text-slate-200">
              Hello {user?.name || 'Friend'}. I’m {chatbotName}.
            </p>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Whenever you’d like to share a thought, unburden your heart, or just sit quietly, I’m right here beside you.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div
                  className={`group relative p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Actions for assistant messages */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="flex items-center gap-2">
                        {!isQuiet && (
                          <button
                            onClick={() => handleSpeak(msg.text, msg.id)}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                              speakingMessageId === msg.id
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                            }`}
                            title={speakingMessageId === msg.id ? 'Stop voice reading' : 'Hear voice out loud'}
                          >
                            {speakingMessageId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                            )}
                            <span>{speakingMessageId === msg.id ? 'Stop Voice' : 'Hear Voice'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleSaveAsMoment(msg.text)}
                          className="hover:text-indigo-300 transition-colors flex items-center gap-1"
                          title="Save to Moments"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isChatLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>{chatbotName} is listening with care...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies */}
      <div className="px-4 py-2 bg-slate-950 border-x border-slate-800 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {currentQuickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleSend(reply)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 hover:border-indigo-500/40 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-900/90 rounded-b-3xl border border-slate-800 border-t-slate-800/60 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Talk softly with ${chatbotName}...`}
              aria-label={`Message to ${chatbotName}`}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10"
            />

            {/* Mic trigger */}
            {!isQuiet && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={isListening ? 'Stop recording voice' : 'Record voice message'}
                title={isListening ? 'Stop recording voice' : 'Speak with Voice (Microphone)'}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
                }`}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim() || isChatLoading}
            aria-label="Send message"
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {isListening && (
          <div className="mt-2 text-center text-xs text-rose-400 animate-pulse flex items-center justify-center gap-2">
            <span>Listening to your voice... Tap the mic again to stop.</span>
          </div>
        )}
      </div>
    </div>
  );
};
