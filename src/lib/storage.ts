import {
  CompanionId,
  CurrentNeed,
  PlantProgress,
  Preferences,
  SavedMoment,
  Settings,
  ThemeId,
  User,
  ChatMessage,
  ChatbotProfile,
} from '../types';

const STORAGE_KEYS = {
  USER: 'lumora_user_v2',
  IS_LOGGED_IN: 'lumora_logged_in_v2',
  HAS_ONBOARDED: 'lumora_has_onboarded_v2',
  PREFERENCES: 'lumora_preferences_v2',
  SETTINGS: 'lumora_settings_v2',
  COMPANION: 'lumora_companion_v2',
  SAVED_MOMENTS: 'lumora_moments_v2',
  PLANT_PROGRESS: 'lumora_plant_v2',
  CURRENT_NEED: 'lumora_need_v2',
  CHAT_HISTORY: 'lumora_chat_history_v2',
  PEACEFUL_SCENE: 'lumora_scene_v2',
};

export const DEFAULT_CHATBOT: ChatbotProfile = {
  name: 'Lumi',
  personality: 'Gentle friend',
};

export const DEFAULT_PREFERENCES: Preferences = {
  categories: {
    animals: ['cats'],
    music: ['k-pop', 'lo-fi'],
    environments: ['rain', 'night'],
    books: ['books', 'reading'],
    hobbies: ['drawing'],
    style: ['aesthetic'],
    games: ['cozy games'],
    food: ['tea'],
    movies: [],
    kdramas: ['k-drama'],
    cdramas: [],
    anime: [],
    sports: [],
    colours: ['midnight blue', 'lavender'],
    places: ['quiet library', 'rainy cafe'],
    creativeActivities: ['drawing', 'reading'],
    happyActivities: ['listening to music', 'curling up with a book'],
    soundscapes: ['rain', 'night'],
  },
  selectedTags: ['cats', 'k-pop', 'rain', 'books', 'night', 'k-drama', 'lo-fi'],
};

export const DEFAULT_SETTINGS: Settings = {
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
};

export const DEMO_USER: User = {
  id: 'demo_luna_1',
  name: 'Luna',
  email: 'luna@lumora.world',
  isDemo: true,
  companion: 'cat',
  chatbot: {
    name: 'Lumi',
    personality: 'Gentle friend',
  },
  preferences: {
    categories: {
      animals: ['cats'],
      music: ['k-pop', 'lo-fi'],
      environments: ['rain', 'night'],
      books: ['books', 'reading'],
      hobbies: ['reading'],
      style: ['aesthetic'],
      games: [],
      food: ['tea'],
      movies: [],
      kdramas: ['k-drama'],
      cdramas: [],
      anime: [],
      sports: [],
      colours: ['indigo', 'lavender'],
      places: ['rainy window nook'],
      creativeActivities: ['reading'],
      happyActivities: ['listening to rain with tea'],
      soundscapes: ['rain'],
    },
    selectedTags: ['cats', 'k-pop', 'rain', 'books', 'night', 'k-drama'],
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
  hasCompletedOnboarding: true,
};

export const DEFAULT_PLANT_PROGRESS: PlantProgress = {
  stage: 'sprout',
  waterCount: 2,
  sunCount: 1,
  flowersHarvested: 0,
  lastTendedAt: new Date().toISOString(),
  plantName: 'Little Moonflower',
};

export const INITIAL_MOMENTS: SavedMoment[] = [
  {
    id: 'moment_seed_1',
    text: 'A quiet rainy evening wrapped in blankets, listening to water droplets tap against the glass.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    needTag: 'I want to calm down',
    authorNote: 'Rainy Night Sanctuary',
    type: 'note',
  },
  {
    id: 'moment_seed_2',
    text: 'Reminding myself that rest is not a reward to be won, but a natural rhythm of living.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    needTag: 'I’m exhausted',
    authorNote: 'Luna’s Note',
    type: 'note',
  },
];

export const storage = {
  getUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        const parsed = JSON.parse(data);
        if (!parsed.chatbot) {
          parsed.chatbot = DEFAULT_CHATBOT;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  setUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
      }
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  isLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    } catch {
      return false;
    }
  },

  hasCompletedOnboarding(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED) === 'true';
    } catch {
      return false;
    }
  },

  setCompletedOnboarding(completed: boolean) {
    try {
      if (completed) {
        localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.HAS_ONBOARDED);
      }
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getSavedMoments(): SavedMoment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_MOMENTS);
      return data ? JSON.parse(data) : INITIAL_MOMENTS;
    } catch {
      return INITIAL_MOMENTS;
    }
  },

  setSavedMoments(moments: SavedMoment[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_MOMENTS, JSON.stringify(moments));
    } catch (e) {
      console.warn('Failed to save moments:', e);
    }
  },

  getPlantProgress(): PlantProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANT_PROGRESS);
      return data ? JSON.parse(data) : DEFAULT_PLANT_PROGRESS;
    } catch {
      return DEFAULT_PLANT_PROGRESS;
    }
  },

  setPlantProgress(progress: PlantProgress) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANT_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save plant progress:', e);
    }
  },

  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setChatHistory(messages: ChatMessage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  },

  getCurrentNeed(): CurrentNeed {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_NEED);
      const validNeeds: CurrentNeed[] = [
        'I want to calm down',
        'I just want to feel heard',
        'I want something relaxing',
        'I’m exhausted',
        'I feel lonely',
        'I’m having a bad day',
        'I just want to feel better',
        'Distract me gently',
        'I just want to be left alone',
      ];
      // Map old formats if present
      if (raw === 'CALM ME') return 'I want to calm down';
      if (raw === 'HEAR ME') return 'I just want to feel heard';
      if (raw === 'SOMETHING RELAXING') return 'I want something relaxing';
      if (raw === 'I FEEL LONELY') return 'I feel lonely';
      if (raw === 'BAD DAY') return 'I’m having a bad day';
      if (raw === 'DISTRACT ME') return 'Distract me gently';
      if (raw === 'JUST LET ME BE') return 'I just want to be left alone';
      return validNeeds.includes(raw as CurrentNeed) ? (raw as CurrentNeed) : 'I want to calm down';
    } catch {
      return 'I want to calm down';
    }
  },

  setCurrentNeed(need: CurrentNeed) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_NEED, need);
    } catch (e) {
      console.warn('Failed to save current need:', e);
    }
  },

  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  },
};
