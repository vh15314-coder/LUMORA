import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ambienceSynth } from '../lib/audioSynth';
import { buildPersonalizedWorld } from '../lib/personalization';
import {
  DEFAULT_CHATBOT,
  DEFAULT_PLANT_PROGRESS,
  DEFAULT_PREFERENCES,
  DEFAULT_SETTINGS,
  DEMO_USER,
  storage,
} from '../lib/storage';
import {
  ActivePage,
  AmbienceType,
  ChatMessage,
  ChatbotProfile,
  CompanionId,
  CompanionState,
  CurrentNeed,
  PlantProgress,
  Preferences,
  SavedMoment,
  Settings,
  User,
  WorldConfig,
} from '../types';

interface AppContextType {
  user: User | null;
  currentNeed: CurrentNeed;
  setCurrentNeed: (need: CurrentNeed) => void;
  worldConfig: WorldConfig;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Ambience Controls
  isAmbiencePlaying: boolean;
  activeAmbience: AmbienceType;
  ambienceVolume: number;
  isMuted: boolean;
  toggleAmbience: () => void;
  setAmbienceType: (type: AmbienceType) => void;
  setAmbienceVolume: (vol: number) => void;
  toggleMute: () => void;
  stopAmbience: () => void;

  // Chatbot Companion
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => Promise<string>;
  clearChat: () => void;
  isChatLoading: boolean;
  updateChatbot: (profile: Partial<ChatbotProfile>) => void;

  // Moments
  moments: SavedMoment[];
  addMoment: (text: string, authorNote?: string, type?: 'quote' | 'chat' | 'note' | 'scene', sceneData?: any) => void;
  deleteMoment: (id: string) => void;
  clearAllMoments: () => void;

  // Plant Activity
  plantProgress: PlantProgress;
  waterPlant: () => void;
  sunPlant: () => void;
  harvestAndReplant: () => void;

  // Settings & Preferences
  updateSettings: (newSettings: Partial<Settings>) => void;
  updatePreferences: (prefs: Preferences) => void;
  updateCompanion: (companion: CompanionId) => void;
  updateUserName: (name: string) => void;
  toggleQuietMode: () => void;

  // Auth & Flow
  loginDemoUser: () => void;
  loginUser: (user: User) => void;
  logout: () => void;
  resetPersonalization: () => void;

  // Companion Interactive Reaction
  temporaryCompanionReaction: CompanionState | null;
  petCompanion: (action?: 'pet' | 'treat' | 'brush' | 'play') => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [currentNeed, setCurrentNeedState] = useState<CurrentNeed>(() => storage.getCurrentNeed());
  const [activePage, setActivePage] = useState<ActivePage>('my-world');

  // Ambience state
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState<boolean>(false);
  const [activeAmbience, setActiveAmbience] = useState<AmbienceType>('instrumental');
  const [ambienceVolume, setAmbienceVolumeState] = useState<number>(() => user?.settings.volume ?? 0.5);
  const [isMuted, setIsMuted] = useState<boolean>(() => user?.settings.isMuted ?? false);

  // Moments & Plant & Chat
  const [moments, setMoments] = useState<SavedMoment[]>(() => storage.getSavedMoments());
  const [plantProgress, setPlantProgress] = useState<PlantProgress>(() => storage.getPlantProgress());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => storage.getChatHistory());
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Companion interactive pet state
  const [temporaryCompanionReaction, setTemporaryCompanionReaction] = useState<CompanionState | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-quiet mode restore settings
  const [preQuietSettings, setPreQuietSettings] = useState<{ sound: boolean; volume: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
  };

  const setCurrentNeed = (need: CurrentNeed) => {
    setCurrentNeedState(need);
    storage.setCurrentNeed(need);
  };

  // Build Personalized World
  const worldConfig = useMemo(() => {
    const prefs = user?.preferences || DEFAULT_PREFERENCES;
    const settings = user?.settings || DEFAULT_SETTINGS;
    const companion = user?.companion || 'cat';
    const chatbot = user?.chatbot || DEFAULT_CHATBOT;
    return buildPersonalizedWorld(prefs, currentNeed, settings, undefined, companion, chatbot);
  }, [user, currentNeed]);

  // Sync ambient soundscape recommendation
  useEffect(() => {
    if (worldConfig.suggestedAmbience && !isAmbiencePlaying) {
      setActiveAmbience(worldConfig.suggestedAmbience);
    }
  }, [worldConfig.suggestedAmbience]);

  // Apply CSS variables and data-theme to root based on theme and worldConfig
  useEffect(() => {
    const root = document.documentElement;
    const { colorPalette } = worldConfig;
    const activeTheme = user?.settings?.themeOverride || 'night';
    root.setAttribute('data-theme', activeTheme);
    root.style.setProperty('--color-lumora-bg', colorPalette.bg);
    root.style.setProperty('--color-lumora-surface', colorPalette.surface);
    root.style.setProperty('--color-lumora-surface-muted', colorPalette.surfaceMuted);
    root.style.setProperty('--color-lumora-text', colorPalette.text);
    root.style.setProperty('--color-lumora-text-muted', colorPalette.textMuted);
    root.style.setProperty('--color-lumora-accent', colorPalette.accent);
    root.style.setProperty('--color-lumora-accent-hover', colorPalette.accentHover);
    root.style.setProperty('--color-lumora-border', colorPalette.border);
    root.style.setProperty('--color-lumora-glow', colorPalette.atmosphereGlow);
    document.body.style.backgroundColor = colorPalette.bg;
    document.body.style.color = colorPalette.text;
  }, [worldConfig, user?.settings?.themeOverride]);

  // Ambience audio controls
  const toggleAmbience = () => {
    if (user?.settings.quietMode) {
      showToast('Quiet Mode is currently active.');
      return;
    }

    if (isAmbiencePlaying) {
      ambienceSynth.stop();
      setIsAmbiencePlaying(false);
    } else {
      ambienceSynth.play(activeAmbience, isMuted ? 0 : ambienceVolume);
      setIsAmbiencePlaying(true);
    }
  };

  const setAmbienceType = (type: AmbienceType) => {
    setActiveAmbience(type);
    if (isAmbiencePlaying && !user?.settings.quietMode) {
      ambienceSynth.play(type, isMuted ? 0 : ambienceVolume);
    }
  };

  const setAmbienceVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setAmbienceVolumeState(clamped);
    ambienceSynth.setVolume(isMuted ? 0 : clamped);
    if (user) {
      updateSettings({ volume: clamped });
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    ambienceSynth.setMuted(nextMuted);
    if (user) {
      updateSettings({ isMuted: nextMuted });
    }
  };

  const stopAmbience = () => {
    ambienceSynth.stop();
    setIsAmbiencePlaying(false);
  };

  // Turn off audio when Quiet Mode is active
  useEffect(() => {
    if (user?.settings.quietMode) {
      if (isAmbiencePlaying) {
        ambienceSynth.stop();
        setIsAmbiencePlaying(false);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [user?.settings.quietMode]);

  const toggleQuietMode = () => {
    if (!user) return;
    const willBeQuiet = !user.settings.quietMode;

    if (willBeQuiet) {
      setPreQuietSettings({
        sound: user.settings.soundEnabled,
        volume: ambienceVolume,
      });
      ambienceSynth.stop();
      setIsAmbiencePlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const updatedUser: User = {
        ...user,
        settings: {
          ...user.settings,
          quietMode: true,
          soundEnabled: false,
          animationIntensity: 'none',
          voiceInputEnabled: false,
          voiceOutputEnabled: false,
        },
      };
      setUser(updatedUser);
      storage.setUser(updatedUser);
      showToast('Everything can be quiet for a while.');
    } else {
      const restoredUser: User = {
        ...user,
        settings: {
          ...user.settings,
          quietMode: false,
          soundEnabled: preQuietSettings?.sound ?? true,
          animationIntensity: 'normal',
          voiceInputEnabled: true,
          voiceOutputEnabled: true,
        },
      };
      setUser(restoredUser);
      storage.setUser(restoredUser);
      showToast('Quiet mode disabled.');
    }
  };

  const petCompanion = (action: 'pet' | 'treat' | 'brush' | 'play' = 'pet') => {
    if (user?.settings.quietMode) return;
    setTemporaryCompanionReaction('playful');
    if (action === 'treat') {
      showToast(`${user?.companion || 'Your companion'} happily accepted a gentle treat.`);
    } else if (action === 'brush') {
      showToast(`Softly brushed your ${user?.companion || 'companion'}.`);
    }
    setTimeout(() => {
      setTemporaryCompanionReaction(null);
    }, 3200);
  };

  // Chatbot conversation logic
  const sendMessage = async (text: string): Promise<string> => {
    if (!text.trim()) return '';

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      needContext: currentNeed,
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    storage.setChatHistory(newHistory);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotName: user?.chatbot?.name || 'Lumi',
          userName: user?.name || 'Friend',
          currentNeed,
          userMessage: text.trim(),
          chatHistory: chatMessages.slice(-6),
          preferences: user?.preferences?.selectedTags || [],
          companion: user?.companion || 'cat',
          quietMode: user?.settings?.quietMode || false,
          personality: user?.chatbot?.personality || 'Gentle friend',
        }),
      });

      let reply = 'I am right here with you. Take all the time you need.';
      if (res.ok) {
        const data = await res.json();
        reply = data.response || reply;
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toISOString(),
        needContext: currentNeed,
      };

      const finalHistory = [...newHistory, botMsg];
      setChatMessages(finalHistory);
      storage.setChatHistory(finalHistory);
      return reply;
    } catch {
      const uName = user?.name || 'Friend';
      const cName = user?.chatbot?.name || 'Lumi';
      const favList = user?.preferences?.selectedTags || [];
      const fav = favList.length > 0 ? favList[Math.floor(Math.random() * favList.length)] : null;
      const lower = text.toLowerCase();

      let fallbackReply = `Hey ${uName}, I hear you completely. In our little sanctuary, you never have to carry any stress alone. Take a gentle, easy breath with me—what feels like the most comforting thing we could do right now?`;

      if (lower.includes('tired') || lower.includes('sleep') || lower.includes('exhausted')) {
        fallbackReply = `Hey ${uName}, I can tell how drained you feel right now. You did so much today, and you don't have to prove anything more. ${fav ? `Let's unwind with thoughts of ${fav} and` : 'Let’s'} give your mind permission to totally rest.`;
      } else if (lower.includes('stress') || lower.includes('anxious') || lower.includes('overwhelm') || lower.includes('panic')) {
        fallbackReply = `I’m right here beside you, ${uName}. Inhale slowly... hold for a moment... and exhale softly. Whatever made today feel overwhelming cannot hurt you here in this peaceful room. Take things one small second at a time.`;
      } else if (lower.includes('sad') || lower.includes('bad') || lower.includes('hurt') || lower.includes('cry')) {
        fallbackReply = `I'm so sorry things felt heavy today, ${uName}. It's completely okay to feel sad or upset—you don't need to put on a brave face with me. ${fav ? `Maybe we can wrap up warm and think of ${fav} for a little peace.` : 'I’m right here listening.'}`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        fallbackReply = `Hey ${uName}! It's so wonderful to see you here in your sanctuary. How has your day been treating you?`;
      } else if (lower.includes('?') || lower.startsWith('what') || lower.startsWith('why') || lower.startsWith('how')) {
        fallbackReply = `That's such a thoughtful thing to bring up, ${uName}. Looking at it calmly: sometimes stepping back into our quiet space gives us the clearest answers. What is your heart leaning towards?`;
      } else if (fav) {
        fallbackReply = `I really appreciate you telling me that, ${uName}. It means a lot to chat like real friends. Moments like this where we can step away and focus on what brings us peace—like ${fav}—are so healing. How does your body feel right now?`;
      }
      
      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toISOString(),
        needContext: currentNeed,
      };
      const finalHistory = [...newHistory, botMsg];
      setChatMessages(finalHistory);
      storage.setChatHistory(finalHistory);
      return fallbackReply;
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    storage.setChatHistory([]);
    showToast('Conversation cleared.');
  };

  const updateChatbot = (profile: Partial<ChatbotProfile>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      chatbot: {
        ...user.chatbot,
        ...profile,
      },
    };
    setUser(updated);
    storage.setUser(updated);
    showToast(`Updated ${updated.chatbot.name}’s settings.`);
  };

  // Moments handling
  const addMoment = (
    text: string,
    authorNote?: string,
    type: 'quote' | 'chat' | 'note' | 'scene' = 'note',
    sceneData?: any
  ) => {
    const newMoment: SavedMoment = {
      id: `moment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      needTag: currentNeed,
      authorNote: authorNote || `${user?.name || 'My'} Sanctuary`,
      type,
      sceneData,
    };
    const updated = [newMoment, ...moments];
    setMoments(updated);
    storage.setSavedMoments(updated);
    showToast('Saved to your Moments.');
  };

  const deleteMoment = (id: string) => {
    const updated = moments.filter((m) => m.id !== id);
    setMoments(updated);
    storage.setSavedMoments(updated);
    showToast('Moment removed.');
  };

  const clearAllMoments = () => {
    setMoments([]);
    storage.setSavedMoments([]);
    showToast('All moments cleared.');
  };

  // Plant Activity logic
  const waterPlant = () => {
    setPlantProgress((prev) => {
      const newWater = prev.waterCount + 1;
      let newStage = prev.stage;
      if (prev.stage === 'seed' && newWater >= 3 && prev.sunCount >= 2) {
        newStage = 'sprout';
      } else if (prev.stage === 'sprout' && newWater >= 6 && prev.sunCount >= 5) {
        newStage = 'plant';
      } else if (prev.stage === 'plant' && newWater >= 10 && prev.sunCount >= 8) {
        newStage = 'flower';
      }
      const updated: PlantProgress = {
        ...prev,
        waterCount: newWater,
        stage: newStage,
        lastTendedAt: new Date().toISOString(),
      };
      storage.setPlantProgress(updated);
      return updated;
    });
  };

  const sunPlant = () => {
    setPlantProgress((prev) => {
      const newSun = prev.sunCount + 1;
      let newStage = prev.stage;
      if (prev.stage === 'seed' && prev.waterCount >= 3 && newSun >= 2) {
        newStage = 'sprout';
      } else if (prev.stage === 'sprout' && prev.waterCount >= 6 && newSun >= 5) {
        newStage = 'plant';
      } else if (prev.stage === 'plant' && prev.waterCount >= 10 && newSun >= 8) {
        newStage = 'flower';
      }
      const updated: PlantProgress = {
        ...prev,
        sunCount: newSun,
        stage: newStage,
        lastTendedAt: new Date().toISOString(),
      };
      storage.setPlantProgress(updated);
      return updated;
    });
  };

  const harvestAndReplant = () => {
    setPlantProgress((prev) => {
      const updated: PlantProgress = {
        stage: 'seed',
        waterCount: 0,
        sunCount: 0,
        flowersHarvested: prev.flowersHarvested + 1,
        lastTendedAt: new Date().toISOString(),
        plantName: `Star Bloom #${prev.flowersHarvested + 2}`,
      };
      storage.setPlantProgress(updated);
      return updated;
    });
    showToast('Planted a new gentle seed.');
  };

  // Settings & Preferences update
  const updateSettings = (partial: Partial<Settings>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      settings: { ...user.settings, ...partial },
    };
    setUser(updated);
    storage.setUser(updated);
  };

  const updatePreferences = (prefs: Preferences) => {
    if (!user) return;
    const updated: User = {
      ...user,
      preferences: prefs,
    };
    setUser(updated);
    storage.setUser(updated);
    showToast('Personalization preferences updated.');
  };

  const updateCompanion = (companion: CompanionId) => {
    if (!user) return;
    const updated: User = {
      ...user,
      companion,
    };
    setUser(updated);
    storage.setUser(updated);
    showToast(`Companion changed to ${companion.toUpperCase()}.`);
  };

  const updateUserName = (name: string) => {
    if (!user) return;
    const updated: User = {
      ...user,
      name,
    };
    setUser(updated);
    storage.setUser(updated);
    showToast('Name updated.');
  };

  const resetPersonalization = () => {
    if (!user) return;
    const updated: User = {
      ...user,
      companion: 'cat',
      chatbot: DEFAULT_CHATBOT,
      preferences: DEFAULT_PREFERENCES,
      settings: DEFAULT_SETTINGS,
    };
    setUser(updated);
    storage.setUser(updated);
    setCurrentNeed('I want to calm down');
    showToast('Personalization reset to peaceful defaults.');
  };

  // Auth
  const loginDemoUser = () => {
    setUser(DEMO_USER);
    storage.setUser(DEMO_USER);
    setCurrentNeed('I want to calm down');
    setActivePage('my-world');
    showToast('Welcome to your world, Luna.');
  };

  const loginUser = (newUser: User) => {
    setUser(newUser);
    storage.setUser(newUser);
    setActivePage('my-world');
  };

  const logout = () => {
    ambienceSynth.stop();
    setIsAmbiencePlaying(false);
    storage.setUser(null);
    setUser(null);
    setActivePage('my-world');
    showToast('Signed out peacefully.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentNeed,
        setCurrentNeed,
        worldConfig,
        activePage,
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
        chatMessages,
        sendMessage,
        clearChat,
        isChatLoading,
        updateChatbot,
        moments,
        addMoment,
        deleteMoment,
        clearAllMoments,
        plantProgress,
        waterPlant,
        sunPlant,
        harvestAndReplant,
        updateSettings,
        updatePreferences,
        updateCompanion,
        updateUserName,
        toggleQuietMode,
        loginDemoUser,
        loginUser,
        logout,
        resetPersonalization,
        temporaryCompanionReaction,
        petCompanion,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
