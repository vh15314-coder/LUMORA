import {
  AmbienceType,
  ComfortItem,
  CompanionId,
  CompanionState,
  CurrentNeed,
  DecorativeElement,
  Preferences,
  Settings,
  TimeOfDay,
  WorldConfig,
  ChatbotProfile,
} from '../types';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'golden_hour';
  if (hour >= 20 && hour < 23) return 'evening';
  return 'deep_night';
}

export function buildPersonalizedWorld(
  preferences: Preferences,
  currentNeed: CurrentNeed,
  settings: Settings,
  timeOfDay: TimeOfDay = getTimeOfDay(),
  companion: CompanionId = 'cat',
  chatbot?: ChatbotProfile
): WorldConfig {
  const tags = (preferences?.selectedTags || []).map((t) => t.toLowerCase());

  const hasRain = tags.includes('rain') || tags.includes('rainy');
  const hasBooks = tags.includes('books') || tags.includes('reading') || tags.includes('novels');
  const hasMusic =
    tags.includes('music') ||
    tags.includes('lo-fi') ||
    tags.includes('k-pop') ||
    tags.includes('classical') ||
    tags.includes('ambient');
  const hasBeach = tags.includes('beach') || tags.includes('ocean') || tags.includes('sunset beach');
  const hasForest = tags.includes('forest') || tags.includes('nature') || tags.includes('mountains');
  const hasNight = tags.includes('night') || tags.includes('dark') || tags.includes('stargazing');
  const hasGaming = tags.includes('gaming') || tags.includes('games');
  const hasSnow = tags.includes('snow') || tags.includes('winter');
  const hasFireplace = tags.includes('fireplace') || tags.includes('warm');
  const hasCute = tags.includes('cute') || tags.includes('cats') || tags.includes('bunnies');

  // 1. Determine Effective Theme
  // Priority 1: User's manual override
  let activeTheme = settings.themeOverride || 'auto';
  if (activeTheme === 'auto') {
    // Priority 2: Current emotional need
    if (currentNeed === 'I’m exhausted' || currentNeed === 'I just want to be left alone') {
      activeTheme = 'night';
    } else if (currentNeed === 'I feel lonely' || currentNeed === 'I’m having a bad day') {
      activeTheme = 'warm';
    } else if (currentNeed === 'I want something relaxing' && hasForest) {
      activeTheme = 'nature';
    } else if (hasNight) {
      activeTheme = 'night';
    } else if (hasBeach || hasFireplace) {
      activeTheme = 'warm';
    } else if (hasForest) {
      activeTheme = 'nature';
    } else if (timeOfDay === 'deep_night' || timeOfDay === 'evening') {
      activeTheme = 'night';
    } else if (timeOfDay === 'golden_hour') {
      activeTheme = 'warm';
    } else {
      activeTheme = 'soft';
    }
  }

  // 2. Color Palette Configuration
  let palette: WorldConfig['colorPalette'];
  switch (activeTheme) {
    case 'sunset':
      palette = {
        bg: '#1c1017',
        surface: '#2b1823',
        surfaceMuted: '#3d2232',
        text: '#fff1f2',
        textMuted: '#fecdd3',
        accent: '#fb7185', // Sunset rose / coral
        accentHover: '#f43f5e',
        border: '#4c263c',
        atmosphereGlow: 'rgba(251, 113, 133, 0.25)',
        themeClass: 'theme-sunset',
      };
      break;
    case 'nature':
      palette = {
        bg: '#0c1813',
        surface: '#14271f',
        surfaceMuted: '#1d382d',
        text: '#f0fdf4',
        textMuted: '#bbf7d0',
        accent: '#34d399', // Emerald/Sage
        accentHover: '#10b981',
        border: '#244839',
        atmosphereGlow: 'rgba(52, 211, 153, 0.25)',
        themeClass: 'theme-nature',
      };
      break;
    case 'warm':
      palette = {
        bg: '#1c120a',
        surface: '#2a1a0f',
        surfaceMuted: '#3d2516',
        text: '#fffbeb',
        textMuted: '#fde68a',
        accent: '#f59e0b', // Warm amber
        accentHover: '#d97706',
        border: '#4d301b',
        atmosphereGlow: 'rgba(245, 158, 11, 0.25)',
        themeClass: 'theme-warm',
      };
      break;
    case 'rain':
      palette = {
        bg: '#0b1319',
        surface: '#121f28',
        surfaceMuted: '#1a2b38',
        text: '#f1f5f9',
        textMuted: '#94a3b8',
        accent: '#38bdf8', // Rain cerulean
        accentHover: '#0284c7',
        border: '#23394a',
        atmosphereGlow: 'rgba(56, 189, 248, 0.25)',
        themeClass: 'theme-rain',
      };
      break;
    case 'soft':
      palette = {
        bg: '#0c1622',
        surface: '#132234',
        surfaceMuted: '#1a2f47',
        text: '#f0f9ff',
        textMuted: '#bae6fd',
        accent: '#38bdf8', // Soft Sky
        accentHover: '#0ea5e9',
        border: '#244161',
        atmosphereGlow: 'rgba(56, 189, 248, 0.25)',
        themeClass: 'theme-soft',
      };
      break;
    case 'custom':
      const customAcc = settings.customAccentColor || '#c084fc';
      palette = {
        bg: '#121217',
        surface: '#1d1d26',
        surfaceMuted: '#292936',
        text: '#f5f5f7',
        textMuted: '#a3a3b2',
        accent: customAcc,
        accentHover: customAcc,
        border: '#343444',
        atmosphereGlow: `${customAcc}25`,
        themeClass: 'theme-custom',
      };
      break;
    case 'night':
    default:
      palette = {
        bg: '#0a0d18',
        surface: '#12182b',
        surfaceMuted: '#1a233e',
        text: '#f1f5f9',
        textMuted: '#c7d2fe',
        accent: '#818cf8', // Indigo/Lavender
        accentHover: '#6366f1',
        border: '#253258',
        atmosphereGlow: 'rgba(129, 140, 248, 0.25)',
        themeClass: 'theme-night',
      };
      break;
  }

  // High contrast override
  if (settings.highContrast) {
    palette.bg = '#000000';
    palette.surface = '#121212';
    palette.surfaceMuted = '#222222';
    palette.text = '#ffffff';
    palette.textMuted = '#d0d0d0';
    palette.border = '#4a4a4a';
  }

  // 3. Environment & Atmosphere (Align with selected theme)
  let environment: WorldConfig['environment'];
  let suggestedAmbience: AmbienceType = 'instrumental';

  if (activeTheme === 'sunset') {
    environment = {
      id: 'sunset_twilight',
      name: 'Sunset Twilight Sanctuary',
      backdropStyle: 'radial-gradient(circle at 50% 15%, rgba(244, 63, 94, 0.35), rgba(251, 146, 60, 0.2), transparent 75%)',
      backdropGradient: 'from-rose-950/80 via-amber-950/50 to-slate-950',
      skyVisual: 'warm_sunset',
      atmosphereDesc: 'A glowing golden-hour haven bathed in warm coral twilight.',
    };
    suggestedAmbience = 'ocean';
  } else if (activeTheme === 'nature') {
    environment = {
      id: 'forest_haven',
      name: 'Pine & Moss Forest Sanctuary',
      backdropStyle: 'radial-gradient(circle at 40% 15%, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.15), transparent 75%)',
      backdropGradient: 'from-emerald-950/80 via-teal-950/50 to-slate-950',
      skyVisual: 'canopy_leaves',
      atmosphereDesc: 'Tranquil emerald pine canopies and fresh moss calm.',
    };
    suggestedAmbience = 'forest';
  } else if (activeTheme === 'warm') {
    environment = {
      id: 'warm_hearth',
      name: 'Cozy Fireside Hearth',
      backdropStyle: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.3), rgba(234, 88, 12, 0.15), transparent 75%)',
      backdropGradient: 'from-amber-950/80 via-orange-950/50 to-stone-950',
      skyVisual: 'fireplace_glow',
      atmosphereDesc: 'Warm fireside radiance, comforting blankets, and honeyed light.',
    };
    suggestedAmbience = 'fireplace';
  } else if (activeTheme === 'rain') {
    environment = {
      id: 'misty_rain',
      name: 'Misty Overcast Sanctuary',
      backdropStyle: 'radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.25), rgba(148, 163, 184, 0.15), transparent 75%)',
      backdropGradient: 'from-slate-900/80 via-cyan-950/40 to-slate-950',
      skyVisual: 'rainy_window',
      atmosphereDesc: 'Cool misty droplets against quiet window panes.',
    };
    suggestedAmbience = 'rain';
  } else if (activeTheme === 'soft') {
    environment = {
      id: 'clear_sky',
      name: 'Serene Daylight Sanctuary',
      backdropStyle: 'radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.25), rgba(14, 165, 233, 0.15), transparent 75%)',
      backdropGradient: 'from-sky-950/80 via-slate-900/50 to-slate-950',
      skyVisual: 'soft_clouds',
      atmosphereDesc: 'A calm, unhurried space tailored for gentle relaxation.',
    };
    suggestedAmbience = 'instrumental';
  } else {
    // Default 'night' or custom
    environment = {
      id: 'starlit_den',
      name: 'Deep Starlit Night',
      backdropStyle: 'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.15), transparent 75%)',
      backdropGradient: 'from-indigo-950/80 via-slate-950/50 to-slate-950',
      skyVisual: 'starlit_sky',
      atmosphereDesc: 'A quiet celestial sanctuary wrapped in gentle midnight stars.',
    };
    suggestedAmbience = 'instrumental';
  }

  // 4. Companion State (Idle, Blink, Sleep, Greeting, Playful)
  let companionState: CompanionState = 'idle';
  switch (currentNeed) {
    case 'I’m exhausted':
      companionState = 'sleep';
      break;
    case 'Distract me gently':
      companionState = 'playful';
      break;
    case 'I feel lonely':
    case 'I’m having a bad day':
    case 'I just want to feel better':
      companionState = 'greeting';
      break;
    case 'I want to calm down':
    case 'I want something relaxing':
    case 'I just want to be left alone':
      companionState = 'idle';
      break;
    case 'I just want to feel heard':
      companionState = 'blink';
      break;
    default:
      companionState = 'idle';
  }

  // 5. Decorative Elements (Max 3, tailored to preferences)
  const decorativeElements: DecorativeElement[] = [];

  if (hasBooks) {
    decorativeElements.push({
      id: 'stacked_books',
      label: 'Warm Leatherbound Books',
      icon: 'BookOpen',
      description: 'A comforting stack of quiet stories waiting on the table.',
      category: 'books',
    });
  }

  if (hasRain || environment.skyVisual === 'rainy_window') {
    decorativeElements.push({
      id: 'rain_droplets',
      label: 'Misty Window Pane',
      icon: 'CloudRain',
      description: 'Gentle raindrops tapping a steady, rhythmic cadence.',
      category: 'nature',
    });
  }

  if (hasMusic) {
    decorativeElements.push({
      id: 'vinyl_player',
      label: 'Lo-Fi Turntable',
      icon: 'Disc3',
      description: 'Spinning softly with warm acoustic crackle.',
      category: 'music',
    });
  }

  if (decorativeElements.length < 3 && hasCute) {
    decorativeElements.push({
      id: 'cushion_bed',
      label: 'Plush Velvet Cushion',
      icon: 'Sparkles',
      description: 'A soft resting spot beside you.',
      category: 'cozy',
    });
  }

  if (decorativeElements.length < 3) {
    decorativeElements.push({
      id: 'herbal_tea',
      label: 'Steaming Chamomile Cup',
      icon: 'Coffee',
      description: 'A gentle ribbon of steam carrying lavender and honey.',
      category: 'drinks',
    });
  }

  const finalDecor = decorativeElements.slice(0, 3);

  // 6. UI Density & Animation Intensity
  let uiDensity: WorldConfig['uiDensity'] = 'normal';
  let animationIntensity: WorldConfig['animationIntensity'] = settings.animationIntensity;

  if (settings.quietMode) {
    uiDensity = 'minimal';
    animationIntensity = 'none';
  } else if (currentNeed === 'I’m exhausted') {
    uiDensity = 'minimal';
    animationIntensity = 'subtle';
  } else if (currentNeed === 'I just want to be left alone') {
    uiDensity = 'zen';
    animationIntensity = 'subtle';
  } else if (currentNeed === 'Distract me gently') {
    uiDensity = 'normal';
  }

  // 7. Greetings & Mood Cues
  let greetingMessage = 'Welcome to your world.';
  let comfortQuote: string | undefined = undefined;
  let chatbotGreeting = `I’m here whenever you’d like to share. No rush.`;
  let chatbotTone = chatbot?.personality || 'Gentle friend';

  switch (currentNeed) {
    case 'I want to calm down':
      greetingMessage = 'Breathe in slowly. You are completely safe here.';
      comfortQuote = 'Inhale peace, exhale everything you do not need right now.';
      chatbotGreeting = `Let’s take a quiet pause together. Take a gentle breath.`;
      break;
    case 'I just want to feel heard':
      greetingMessage = 'I am right here with you. Take all the time you need.';
      comfortQuote = 'Your thoughts don’t need to be polished or neat to be heard.';
      chatbotGreeting = `I’m listening with an open heart. Say as much or as little as you like.`;
      break;
    case 'I’m exhausted':
      greetingMessage = 'You don’t have to do anything right now.';
      comfortQuote = 'Rest is not something you have to earn. Put down every weight.';
      chatbotGreeting = `You’ve carried so much today. Just rest your eyes.`;
      break;
    case 'I feel lonely':
      greetingMessage = 'You are held and welcome in this room. You are never alone here.';
      comfortQuote = 'Even in quiet spaces, warmth finds a way to reach you.';
      chatbotGreeting = `I’m so glad you’re here with me. I’m right by your side.`;
      break;
    case 'I’m having a bad day':
      greetingMessage = 'Some days are hard. You made it here, and that is enough.';
      comfortQuote = 'Today has already passed the heavy part. Let tonight be tender.';
      chatbotGreeting = `I’m sorry today felt rough. This room is your soft sanctuary.`;
      break;
    case 'I want something relaxing':
      greetingMessage = 'Let the atmosphere soften around you.';
      comfortQuote = 'Gentle moments add up like quiet drops of morning dew.';
      chatbotGreeting = `Settle in comfortably. Let’s find a little pocket of peace.`;
      break;
    case 'I just want to feel better':
      greetingMessage = 'A gentle space to recharge your heart.';
      comfortQuote = 'Small soft moments bring quiet healing.';
      chatbotGreeting = `We’ll take it one tiny step at a time. What would feel kindest right now?`;
      break;
    case 'Distract me gently':
      greetingMessage = 'Let’s play with something gentle and light.';
      comfortQuote = 'No clocks, no scoring, just simple soothing delight.';
      chatbotGreeting = `Ready for a lighthearted little break? Let’s wander peacefully.`;
      break;
    case 'I just want to be left alone':
      greetingMessage = 'A quiet space for you. Simply exist.';
      comfortQuote = 'Silence is a gentle companion here.';
      chatbotGreeting = `...`;
      break;
  }

  // 8. Primary & Secondary Activities
  let primaryActivity: WorldConfig['primaryActivity'] = {
    id: 'breathing',
    title: '4-7-8 Centering Breath',
    subtitle: 'Synchronized visual rhythm to regulate the nervous system',
    iconName: 'Wind',
  };

  let secondaryActivity: WorldConfig['secondaryActivity'] = {
    id: 'bubble_pop',
    title: 'Mindful Bubble Pop',
    subtitle: 'Low-pressure tactile popping with zero scoring or timers',
    iconName: 'Sparkles',
  };

  if (currentNeed === 'Distract me gently') {
    primaryActivity = {
      id: 'bubble_pop',
      title: 'Mindful Bubble Pop',
      subtitle: 'Gentle popping without scoreboards or timers',
      iconName: 'Sparkles',
    };
    secondaryActivity = {
      id: 'grow_plant',
      title: 'Grow a Gentle Seed',
      subtitle: 'Water and warm your seedling into flower',
      iconName: 'Flower2',
    };
  } else if (currentNeed === 'I just want to feel heard') {
    primaryActivity = {
      id: 'journal',
      title: 'Open Reflection Space',
      subtitle: 'Express what feels heavy, receive a quiet caring response',
      iconName: 'MessageSquareHeart',
    };
    secondaryActivity = {
      id: 'breathing',
      title: 'Gentle Calming Breath',
      subtitle: 'Pause whenever the words feel like enough',
      iconName: 'Wind',
    };
  } else if (currentNeed === 'I want something relaxing') {
    primaryActivity = {
      id: 'grow_plant',
      title: 'Care for a Seedling',
      subtitle: 'A steady quiet companion growing one petal at a time',
      iconName: 'Flower2',
    };
    secondaryActivity = {
      id: 'peaceful_scene',
      title: 'Create a Peaceful Scene',
      subtitle: 'Arrange cozy items, rain, and starlight',
      iconName: 'Sparkles',
    };
  } else if (currentNeed === 'I’m exhausted' || currentNeed === 'I just want to be left alone') {
    primaryActivity = {
      id: 'breathing',
      title: 'Soft Resting Presence',
      subtitle: 'Follow the slow pulse or close your eyes',
      iconName: 'Moon',
    };
    secondaryActivity = undefined;
  } else if (currentNeed === 'I just want to feel better' || currentNeed === 'I’m having a bad day') {
    primaryActivity = {
      id: 'pet_care',
      title: 'Cozy Pet Care',
      subtitle: `Brush and share gentle love with your ${companion}`,
      iconName: 'Heart',
    };
    secondaryActivity = {
      id: 'colouring',
      title: 'Ambient Colouring',
      subtitle: 'Soft meditative colors with zero pressure',
      iconName: 'Palette',
    };
  }

  // 9. Recommended Comfort Content
  const recommendedComfortContent: ComfortItem[] = [
    {
      id: 'comfort_ambience',
      title: `${suggestedAmbience.charAt(0).toUpperCase() + suggestedAmbience.slice(1)} Soundscape`,
      category: 'Soundscape',
      summary: `Organic synthesized ${suggestedAmbience} ambience designed to mask harsh external noise.`,
      actionLabel: 'Listen in silence',
      icon: 'Headphones',
      type: 'ambience',
      targetPayload: suggestedAmbience,
    },
    {
      id: 'comfort_companion',
      title: `Quiet Time with ${companion.charAt(0).toUpperCase() + companion.slice(1)}`,
      category: 'Companionship',
      summary: `Your ${companion} rests gently alongside you, responding to your presence.`,
      actionLabel: 'Gentle touch',
      icon: 'Heart',
      type: 'companion',
    },
  ];

  if (hasBooks) {
    recommendedComfortContent.push({
      id: 'comfort_reading',
      title: 'Comfort Reading Corner',
      category: 'Reading',
      summary: 'A warm tea and a quiet passage from a cherished story.',
      actionLabel: 'Settle in',
      icon: 'BookOpen',
      type: 'reflection',
    });
  }

  if (hasMusic) {
    recommendedComfortContent.push({
      id: 'comfort_audio',
      title: 'Lo-Fi Acoustic Resonance',
      category: 'Acoustics',
      summary: 'Soft instrumental chords with gentle harmonic warmth.',
      actionLabel: 'Immerse',
      icon: 'Disc3',
      type: 'ambience',
      targetPayload: 'instrumental',
    });
  }

  return {
    worldTheme: activeTheme,
    environment,
    colorPalette: palette,
    backgroundAtmosphere: environment.atmosphereDesc,
    decorativeElements: settings.quietMode ? [] : finalDecor,
    companionState,
    chatbotGreeting,
    chatbotTone,
    suggestedAmbience,
    animationIntensity,
    uiDensity,
    greetingMessage,
    comfortQuote,
    primaryActivity,
    secondaryActivity,
    recommendedComfortContent,
    voiceResponseStyle: 'warm, gentle, and unhurried',
  };
}

// Alias for backwards compatibility
export const buildWorldConfig = (
  preferences: Preferences,
  currentNeed: CurrentNeed,
  settings: Settings,
  timeOfDay?: TimeOfDay,
  companion?: CompanionId
) => buildPersonalizedWorld(preferences, currentNeed, settings, timeOfDay, companion);
