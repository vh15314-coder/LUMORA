export type CurrentNeed =
  | 'I want to calm down'
  | 'I just want to feel heard'
  | 'I want something relaxing'
  | 'I’m exhausted'
  | 'I feel lonely'
  | 'I’m having a bad day'
  | 'I just want to feel better'
  | 'Distract me gently'
  | 'I just want to be left alone';

export type CompanionId = 'cat' | 'dog' | 'bunny' | 'panda';

export type CompanionState = 'idle' | 'blink' | 'sleep' | 'greeting' | 'playful';

export type ThemeId = 'soft' | 'night' | 'nature' | 'warm' | 'rain' | 'sunset' | 'custom' | 'auto';

export type AmbienceType =
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'fireplace'
  | 'night'
  | 'instrumental'
  | 'birds';

export type TimeOfDay = 'morning' | 'afternoon' | 'golden_hour' | 'evening' | 'deep_night';

export type ChatbotPersonality =
  | 'Gentle friend'
  | 'Cozy companion'
  | 'Playful friend'
  | 'Quiet listener'
  | 'Encouraging companion'
  | 'Custom personality';

export interface ChatbotProfile {
  name: string; // e.g., "Lumi"
  personality: ChatbotPersonality;
  customPrompt?: string;
}

export interface Preferences {
  categories: {
    music: string[];
    movies: string[];
    kdramas: string[];
    cdramas: string[];
    anime: string[];
    animals: string[];
    books: string[];
    games: string[];
    sports: string[];
    food: string[];
    environments: string[];
    style: string[];
    colours: string[];
    places: string[];
    hobbies: string[];
    creativeActivities: string[];
    happyActivities: string[];
    soundscapes: string[];
  };
  selectedTags: string[]; // flattened tags: ['cats', 'books', 'rain', 'k-pop', etc.]
  primaryEnvironmentPreference?: string;
}

export interface Settings {
  soundEnabled: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  voiceInputEnabled: boolean;
  voiceOutputEnabled: boolean;
  voiceSpeed: number; // 0.8 to 1.2
  voicePitch: number; // 0.8 to 1.2
  animationIntensity: 'normal' | 'subtle' | 'none';
  uiDensity: 'compact' | 'normal' | 'minimal' | 'zen';
  quietMode: boolean;
  highContrast: boolean;
  customAccentColor?: string;
  themeOverride?: ThemeId;
  backgroundOverride?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  companion: CompanionId;
  chatbot: ChatbotProfile;
  preferences: Preferences;
  settings: Settings;
  createdAt: string;
  hasCompletedOnboarding?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  needContext?: CurrentNeed;
}

export interface SavedMoment {
  id: string;
  text: string;
  createdAt: string;
  needTag?: CurrentNeed;
  authorNote?: string;
  type?: 'quote' | 'chat' | 'note' | 'scene';
  sceneData?: any;
}

export interface PlantProgress {
  stage: 'seed' | 'sprout' | 'plant' | 'flower';
  waterCount: number;
  sunCount: number;
  flowersHarvested: number;
  lastTendedAt: string;
  plantName: string;
}

export interface DecorativeElement {
  id: string;
  label: string;
  icon: string;
  description: string;
  category: 'books' | 'nature' | 'cozy' | 'music' | 'gaming' | 'drinks' | 'art';
}

export interface ComfortItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  actionLabel: string;
  icon: string;
  type: 'ambience' | 'breathing' | 'companion' | 'activity' | 'reflection' | 'chat';
  targetPayload?: string;
}

export interface ActivityConfig {
  id: 'bubble_pop' | 'grow_plant' | 'breathing' | 'pet_care' | 'colouring' | 'peaceful_scene' | 'journal';
  title: string;
  subtitle: string;
  iconName: string;
}

export interface WorldConfig {
  worldTheme: ThemeId;
  environment: {
    id: string;
    name: string;
    backdropStyle: string;
    backdropGradient: string;
    skyVisual: 'rainy_window' | 'starlit_sky' | 'warm_sunset' | 'canopy_leaves' | 'zen_mist' | 'soft_clouds' | 'snowfall' | 'fireplace_glow';
    atmosphereDesc: string;
  };
  colorPalette: {
    bg: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    border: string;
    atmosphereGlow: string;
    themeClass: string;
  };
  backgroundAtmosphere: string;
  decorativeElements: DecorativeElement[]; // max 3
  companionState: CompanionState;
  chatbotGreeting: string;
  chatbotTone: string;
  suggestedAmbience: AmbienceType;
  animationIntensity: 'none' | 'subtle' | 'normal';
  uiDensity: 'compact' | 'normal' | 'minimal' | 'zen';
  greetingMessage: string;
  comfortQuote?: string;
  primaryActivity: ActivityConfig;
  secondaryActivity?: ActivityConfig;
  recommendedComfortContent: ComfortItem[];
  voiceResponseStyle: string;
}

export interface PeacefulSceneElement {
  id: string;
  type: 'rain' | 'stars' | 'clouds' | 'plants' | 'ocean' | 'fireflies' | 'books' | 'lantern' | 'tea' | 'pet' | 'moon';
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
}

export interface SoundscapeState {
  isPlaying: boolean;
  type: AmbienceType;
  volume: number;
  isMuted: boolean;
}

export type ActivePage =
  | 'my-world'
  | 'comforts'
  | 'play'
  | 'moments'
  | 'profile'
  | 'chat'
  | 'hear-me'
  | 'onboarding'
  | 'activity-plant'
  | 'activity-bubbles'
  | 'activity-breathe'
  | 'activity-pet'
  | 'activity-colouring'
  | 'activity-scene';
