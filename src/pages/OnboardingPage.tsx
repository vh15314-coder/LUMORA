import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CompanionId,
  ChatbotPersonality,
  Preferences,
  User,
} from '../types';
import { CompanionAvatar } from '../components/CompanionAvatar';
import { buildPersonalizedWorld } from '../lib/personalization';
import { storage } from '../lib/storage';
import {
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Plus,
  Compass,
  MessageSquare,
  Music,
  Tv,
  BookOpen,
  Coffee,
  Palette,
  Heart,
  Gamepad2,
  Trees,
  Smile,
  Eye,
  Search,
  User as UserIcon,
} from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

// Curated options for all 18 categories
const MUSIC_GENRES = [
  'lo-fi beats',
  'k-pop',
  'classical piano',
  'ambient',
  'indie folk',
  'jazz',
  'acoustic guitar',
  'r&b',
  'synthwave',
  'bossa nova',
  'nature sounds',
  'city pop',
  'orchestral',
];

const MUSIC_ARTISTS = [
  'IU',
  'BTS',
  'Chopin',
  'Debussy',
  'Taylor Swift',
  'Laufey',
  'Nujabes',
  'Studio Ghibli OST',
  'Joe Hisaishi',
  'Yiruma',
  'Billie Eilish',
  'Coldplay',
];

const KDRAMAS = [
  'Crash Landing on You',
  'Goblin',
  'Twenty-Five Twenty-One',
  'Hometown Cha-Cha-Cha',
  'Reply 1988',
  'Business Proposal',
  'Weightlifting Fairy',
  'Extraordinary Attorney Woo',
  'Hotel Del Luna',
  'Our Beloved Summer',
];

const CDRAMAS = [
  'Hidden Love',
  'Love Between Fairy and Devil',
  'Meet Yourself',
  'Nirvana in Fire',
  'Falling Into Your Smile',
  'Till the End of the Moon',
  'The Untamed',
  'You Are My Glory',
];

const ANIME = [
  'Studio Ghibli',
  'Spirited Away',
  'Frieren: Beyond Journey’s End',
  'My Neighbor Totoro',
  'Jujutsu Kaisen',
  'Haikyuu!!',
  'Violet Evergarden',
  'Demon Slayer',
  'Spy x Family',
  'Your Name',
  'Howl’s Moving Castle',
  'A Silent Voice',
];

const MOVIES = [
  'Cozy fantasy films',
  'Slice of life films',
  'Wes Anderson films',
  'Romantic comedies',
  'Sci-fi & space',
  'Comforting classics',
  'Mystery & detective',
  'Healing anime films',
];

const ANIMALS = [
  'cats',
  'dogs',
  'bunnies',
  'giant pandas',
  'red pandas',
  'foxes',
  'capybaras',
  'otters',
  'deer',
  'hedgehogs',
  'dolphins',
  'golden retrievers',
  'calico cats',
];

const BIRDS = [
  'songbirds',
  'owls',
  'penguins',
  'hummingbirds',
  'swans',
  'sparrows',
  'robins',
  'bluebirds',
];

const BOOKS = [
  'novels & fiction',
  'cozy fantasy',
  'poetry',
  'literary classics',
  'manga',
  'webtoons',
  'philosophy',
  'mystery novels',
  'memoirs',
  'science fiction',
  'essays & reflections',
  'Haruki Murakami',
  'Jane Austen',
  'The Little Prince',
  'Before the Coffee Gets Cold',
];

const GAMES = [
  'Animal Crossing',
  'Stardew Valley',
  'Genshin Impact',
  'Zelda: Breath of the Wild',
  'Minecraft',
  'cozy puzzle games',
  'Pokémon',
  'visual novels',
  'Hollow Knight',
  'Mario Kart',
  'cozy board games',
];

const SPORTS_MOVEMENT = [
  'quiet walking',
  'gentle yoga',
  'cycling',
  'swimming',
  'badminton',
  'hiking in nature',
  'stretching & pilates',
  'dancing to music',
  'ice skating',
];

const DRINKS = [
  'warm matcha latte',
  'chamomile tea',
  'pour-over coffee',
  'hot chocolate',
  'iced peach tea',
  'jasmine green tea',
  'chai latte',
  'boba milk tea',
  'honey ginger tea',
];

const FOODS = [
  'warm bakery pastries',
  'fresh croissants',
  'comforting ramen',
  'sushi',
  'warm vegetable soup',
  'steamed dumplings',
  'chocolate chip cookies',
  'pasta with basil',
  'strawberry mochi',
  'sourdough toast',
];

const ENVIRONMENTS = [
  'rainy day window',
  'starlit night sky',
  'sunset beach',
  'whispering pine forest',
  'misty mountains',
  'gentle snow cabin',
  'crackling fireplace',
  'quiet cloudy afternoon',
  'spring blossoms',
  'late night balcony',
];

const PLACES = [
  'quiet library nook',
  'corner coffee shop',
  'botanical greenhouse',
  'ocean pier at twilight',
  'mountain cabin',
  'cozy bedroom nook',
  'peaceful park bench',
];

const STYLES = [
  'minimalist aesthetic',
  'cozy dark theme',
  'soft pastel',
  'cottagecore vintage',
  'ethereal dreamy',
  'midnight blue mood',
  'earth tones & sage',
  'warm amber glow',
];

const COLOURS = [
  'midnight blue',
  'soft lavender',
  'sage green',
  'warm amber',
  'dusty rose',
  'deep indigo',
  'forest emerald',
  'warm peach',
  'terracotta',
  'cloud white',
  'lilac mist',
];

const HOBBIES = [
  'drawing & sketching',
  'watercolor painting',
  'bullet journaling',
  'baking treats',
  'film photography',
  'crafting & knitting',
  'playing an instrument',
  'gardening & indoor plants',
  'calligraphy',
];

const HAPPY_ACTIVITIES = [
  'listening to music with headphones',
  'curling up under a heavy blanket',
  'watching rain tap on windows',
  'taking evening walks',
  'sipping hot tea in silence',
  'curling up with a pet',
  'watching sunsets',
  'stargazing',
];

const SOUNDSCAPES = [
  'gentle rain',
  'ocean waves',
  'peaceful forest',
  'crackling fireplace',
  'deep night crickets',
  'soft instrumental piano',
  'morning songbirds',
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const {
    user,
    loginUser,
    updatePreferences,
    updateCompanion,
    updateChatbot,
    updateUserName,
    showToast,
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState<string>(user?.name || '');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>(user?.companion || 'cat');
  const [chatbotName, setChatbotName] = useState<string>(user?.chatbot?.name || 'Lumi');
  const [chatbotPersonality, setChatbotPersonality] = useState<ChatbotPersonality>(
    user?.chatbot?.personality || 'Gentle friend'
  );

  const [selectedTags, setSelectedTags] = useState<string[]>(
    user?.preferences?.selectedTags && user.preferences.selectedTags.length > 0
      ? user.preferences.selectedTags
      : ['cats', 'rain', 'books', 'night', 'lo-fi']
  );

  const [customTagInput, setCustomTagInput] = useState('');
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState<string>('all');

  const companions: { id: CompanionId; label: string; desc: string }[] = [
    { id: 'cat', label: 'Cat', desc: 'Gentle, quiet, loves rain, books and windowsill naps' },
    { id: 'dog', label: 'Dog', desc: 'Loyal, warm, cheerful greetings and faithful company' },
    { id: 'bunny', label: 'Bunny', desc: 'Soft, tender, peaceful listener and calming presence' },
    { id: 'panda', label: 'Panda', desc: 'Calm, grounding, sleepy soul and relaxed pace' },
  ];

  const personalities: ChatbotPersonality[] = [
    'Gentle friend',
    'Cozy companion',
    'Playful friend',
    'Quiet listener',
    'Encouraging companion',
    'Custom personality',
  ];

  // 10 Detailed Curated Steps
  const steps = [
    {
      id: 'sanctuary_identity',
      title: 'Welcome to LUMORA. Who should we welcome?',
      subtitle: 'Tell us what to call you and choose your animal companion for your sanctuary.',
      icon: <UserIcon className="w-5 h-5 text-indigo-400" />,
      isIdentityStep: true,
      options: [] as string[],
    },
    {
      id: 'music_sound',
      title: 'What is your favourite music, artists & soundscapes?',
      subtitle: 'What genres, singers, or ambient sounds bring warmth and peace to your day?',
      icon: <Music className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Genres', items: MUSIC_GENRES },
        { label: 'Artists & Melodies', items: MUSIC_ARTISTS },
        { label: 'Soundscapes', items: SOUNDSCAPES },
      ],
      options: [...MUSIC_GENRES, ...MUSIC_ARTISTS, ...SOUNDSCAPES],
    },
    {
      id: 'shows_anime_dramas',
      title: 'What are your favourite movies, K-dramas, C-dramas & anime?',
      subtitle: 'Stories and visual worlds you love getting lost in for comfort and quiet joy.',
      icon: <Tv className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'K-Dramas', items: KDRAMAS },
        { label: 'C-Dramas', items: CDRAMAS },
        { label: 'Anime', items: ANIME },
        { label: 'Movies & Films', items: MOVIES },
      ],
      options: [...KDRAMAS, ...CDRAMAS, ...ANIME, ...MOVIES],
    },
    {
      id: 'animals_birds',
      title: 'What are your favourite animals & birds?',
      subtitle: 'Creatures whose gentle presence and beauty warm your heart.',
      icon: <Heart className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Animals', items: ANIMALS },
        { label: 'Birds', items: BIRDS },
      ],
      options: [...ANIMALS, ...BIRDS],
    },
    {
      id: 'books_reading',
      title: 'What are your favourite books, novels & reading genres?',
      subtitle: 'Stories, poetry, fiction, or cozy topics you love returning to.',
      icon: <BookOpen className="w-5 h-5 text-indigo-400" />,
      options: BOOKS,
    },
    {
      id: 'games_sports',
      title: 'What are your favourite games, sports & gentle movement?',
      subtitle: 'Cozy low-pressure games or gentle activities that help you unwind.',
      icon: <Gamepad2 className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Games', items: GAMES },
        { label: 'Movement & Sports', items: SPORTS_MOVEMENT },
      ],
      options: [...GAMES, ...SPORTS_MOVEMENT],
    },
    {
      id: 'food_drinks',
      title: 'What are your favourite comfort food, treats & drinks?',
      subtitle: 'Warm teas, comfort dishes, bakery treats, or cozy sips.',
      icon: <Coffee className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Comfort Drinks', items: DRINKS },
        { label: 'Food & Sweets', items: FOODS },
      ],
      options: [...DRINKS, ...FOODS],
    },
    {
      id: 'environments_places',
      title: 'What are your favourite environments & peaceful places?',
      subtitle: 'Weather, landscapes, and cozy spots where you feel most grounded and safe.',
      icon: <Trees className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Weather & Landscapes', items: ENVIRONMENTS },
        { label: 'Peaceful Places', items: PLACES },
      ],
      options: [...ENVIRONMENTS, ...PLACES],
    },
    {
      id: 'style_colours',
      title: 'What are your favourite visual aesthetics & colours?',
      subtitle: 'Palettes and design aesthetics that soothe and relax your eyes.',
      icon: <Palette className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Aesthetics', items: STYLES },
        { label: 'Colours', items: COLOURS },
      ],
      options: [...STYLES, ...COLOURS],
    },
    {
      id: 'hobbies_happiness',
      title: 'What hobbies & small moments make you happiest?',
      subtitle: 'Creative pastimes and quiet little rituals that restore your peace.',
      icon: <Smile className="w-5 h-5 text-indigo-400" />,
      subGroups: [
        { label: 'Creative Hobbies', items: HOBBIES },
        { label: 'Moments of Joy', items: HAPPY_ACTIVITIES },
      ],
      options: [...HOBBIES, ...HAPPY_ACTIVITIES],
    },
  ];

  const currentStepData = steps[currentStep];

  const toggleTag = (rawTag: string) => {
    const tag = rawTag.toLowerCase();
    setSelectedTags((prev) => {
      const exists = prev.some((t) => t.toLowerCase() === tag);
      if (exists) {
        return prev.filter((t) => t.toLowerCase() !== tag);
      } else {
        return [...prev, rawTag];
      }
    });
  };

  const isTagSelected = (rawTag: string) => {
    const tag = rawTag.toLowerCase();
    return selectedTags.some((t) => t.toLowerCase() === tag);
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const cleanTag = customTagInput.trim();
    if (!isTagSelected(cleanTag)) {
      setSelectedTags((prev) => [...prev, cleanTag]);
      showToast(`Added "${cleanTag}" to your favorites!`);
    }
    setCustomTagInput('');
  };

  // Build real-time preview config
  const livePreviewConfig = useMemo(() => {
    const dummyPrefs: Preferences = {
      categories: {
        music: selectedTags.filter((t) => MUSIC_GENRES.some((g) => g.toLowerCase() === t.toLowerCase())),
        movies: selectedTags.filter((t) => MOVIES.some((m) => m.toLowerCase() === t.toLowerCase())),
        kdramas: selectedTags.filter((t) => KDRAMAS.some((k) => k.toLowerCase() === t.toLowerCase())),
        cdramas: selectedTags.filter((t) => CDRAMAS.some((c) => c.toLowerCase() === t.toLowerCase())),
        anime: selectedTags.filter((t) => ANIME.some((a) => a.toLowerCase() === t.toLowerCase())),
        animals: selectedTags.filter((t) => ANIMALS.some((a) => a.toLowerCase() === t.toLowerCase())),
        books: selectedTags.filter((t) => BOOKS.some((b) => b.toLowerCase() === t.toLowerCase())),
        environments: selectedTags.filter((t) => ENVIRONMENTS.some((e) => e.toLowerCase() === t.toLowerCase())),
        games: selectedTags.filter((t) => GAMES.some((g) => g.toLowerCase() === t.toLowerCase())),
        sports: selectedTags.filter((t) => SPORTS_MOVEMENT.some((s) => s.toLowerCase() === t.toLowerCase())),
        food: selectedTags.filter((t) => FOODS.some((f) => f.toLowerCase() === t.toLowerCase()) || DRINKS.some((d) => d.toLowerCase() === t.toLowerCase())),
        style: selectedTags.filter((t) => STYLES.some((s) => s.toLowerCase() === t.toLowerCase())),
        colours: selectedTags.filter((t) => COLOURS.some((c) => c.toLowerCase() === t.toLowerCase())),
        places: selectedTags.filter((t) => PLACES.some((p) => p.toLowerCase() === t.toLowerCase())),
        hobbies: selectedTags.filter((t) => HOBBIES.some((h) => h.toLowerCase() === t.toLowerCase())),
        creativeActivities: selectedTags.filter((t) => HOBBIES.some((h) => h.toLowerCase() === t.toLowerCase())),
        happyActivities: selectedTags.filter((t) => HAPPY_ACTIVITIES.some((ha) => ha.toLowerCase() === t.toLowerCase())),
        soundscapes: selectedTags.filter((t) => SOUNDSCAPES.some((s) => s.toLowerCase() === t.toLowerCase())),
      },
      selectedTags,
    };

    return buildPersonalizedWorld(
      dummyPrefs,
      'I want to calm down',
      user?.settings || {
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
      },
      undefined,
      selectedCompanion,
      { name: chatbotName, personality: chatbotPersonality }
    );
  }, [selectedTags, selectedCompanion, chatbotName, chatbotPersonality, user?.settings]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
    }
  };

  const handleSkipQuestion = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const finalName = userName.trim() || user?.name || 'Friend';

    const categorizedPrefs: Preferences = {
      categories: {
        music: selectedTags.filter((t) => MUSIC_GENRES.some((g) => g.toLowerCase() === t.toLowerCase()) || MUSIC_ARTISTS.some((a) => a.toLowerCase() === t.toLowerCase())),
        movies: selectedTags.filter((t) => MOVIES.some((m) => m.toLowerCase() === t.toLowerCase())),
        kdramas: selectedTags.filter((t) => KDRAMAS.some((k) => k.toLowerCase() === t.toLowerCase())),
        cdramas: selectedTags.filter((t) => CDRAMAS.some((c) => c.toLowerCase() === t.toLowerCase())),
        anime: selectedTags.filter((t) => ANIME.some((a) => a.toLowerCase() === t.toLowerCase())),
        animals: selectedTags.filter((t) => ANIMALS.some((a) => a.toLowerCase() === t.toLowerCase()) || BIRDS.some((b) => b.toLowerCase() === t.toLowerCase())),
        books: selectedTags.filter((t) => BOOKS.some((b) => b.toLowerCase() === t.toLowerCase())),
        environments: selectedTags.filter((t) => ENVIRONMENTS.some((e) => e.toLowerCase() === t.toLowerCase())),
        games: selectedTags.filter((t) => GAMES.some((g) => g.toLowerCase() === t.toLowerCase())),
        sports: selectedTags.filter((t) => SPORTS_MOVEMENT.some((s) => s.toLowerCase() === t.toLowerCase())),
        food: selectedTags.filter((t) => FOODS.some((f) => f.toLowerCase() === t.toLowerCase()) || DRINKS.some((d) => d.toLowerCase() === t.toLowerCase())),
        style: selectedTags.filter((t) => STYLES.some((s) => s.toLowerCase() === t.toLowerCase())),
        colours: selectedTags.filter((t) => COLOURS.some((c) => c.toLowerCase() === t.toLowerCase())),
        places: selectedTags.filter((t) => PLACES.some((p) => p.toLowerCase() === t.toLowerCase())),
        hobbies: selectedTags.filter((t) => HOBBIES.some((h) => h.toLowerCase() === t.toLowerCase())),
        creativeActivities: selectedTags.filter((t) => HOBBIES.some((h) => h.toLowerCase() === t.toLowerCase())),
        happyActivities: selectedTags.filter((t) => HAPPY_ACTIVITIES.some((ha) => ha.toLowerCase() === t.toLowerCase())),
        soundscapes: selectedTags.filter((t) => SOUNDSCAPES.some((s) => s.toLowerCase() === t.toLowerCase())),
      },
      selectedTags,
    };

    if (user) {
      updateUserName(finalName);
      updatePreferences(categorizedPrefs);
      updateCompanion(selectedCompanion);
      updateChatbot({
        name: chatbotName.trim() || 'Lumi',
        personality: chatbotPersonality,
      });
      storage.setCompletedOnboarding(true);
    } else {
      // Create new user with these chosen preferences!
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: finalName,
        email: `${finalName.toLowerCase().replace(/\s+/g, '')}@lumora.world`,
        isDemo: false,
        companion: selectedCompanion,
        chatbot: {
          name: chatbotName.trim() || 'Lumi',
          personality: chatbotPersonality,
        },
        preferences: categorizedPrefs,
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
        },
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: true,
      };
      loginUser(newUser);
      storage.setCompletedOnboarding(true);
    }

    showToast(`Welcome to your personalized world, ${finalName}!`);
    onComplete();
  };

  const handleSkipAll = () => {
    storage.setCompletedOnboarding(true);
    onComplete();
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto flex flex-col gap-6 relative z-10 text-slate-100">
      {/* Top Header and Step Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to previous question"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs uppercase font-semibold tracking-wider text-indigo-400">
            Personalization · Question {currentStep + 1} of {steps.length}
          </span>
        </div>

        <button
          onClick={handleSkipAll}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Skip Onboarding</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main Step Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {currentStepData.icon}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentStepData.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {currentStepData.subtitle} (Select any that apply, or add custom ones)
          </p>
        </div>

        {/* Step 1: Identity & Companion Configuration */}
        {currentStepData.isIdentityStep && (
          <div className="flex flex-col gap-6">
            {/* User Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. What should we call you?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Luna, Alex, Maya, or leave as Friend"
                className="w-full max-w-md px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Choose Companion */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                2. Choose your animal companion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {companions.map((comp) => {
                  const isSelected = selectedCompanion === comp.id;
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setSelectedCompanion(comp.id)}
                      className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <CompanionAvatar companion={comp.id} state="idle" size="sm" />
                      <span className="text-xs font-bold text-slate-200 mt-2">{comp.label}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">{comp.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chatbot Name & Personality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  3. Chatbot Companion Name
                </label>
                <input
                  type="text"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  placeholder="e.g. Lumi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Default is Lumi, but feel free to rename anytime.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  4. Chatbot Personality & Tone
                </label>
                <select
                  value={chatbotPersonality}
                  onChange={(e) => setChatbotPersonality(e.target.value as ChatbotPersonality)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {personalities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Regular Multi-Select Questions */}
        {!currentStepData.isIdentityStep && (
          <div className="flex flex-col gap-5">
            {/* Sub-groups if available */}
            {currentStepData.subGroups ? (
              <div className="flex flex-col gap-5">
                {currentStepData.subGroups.map((group) => (
                  <div key={group.label} className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((option) => {
                        const isSelected = isTagSelected(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleTag(option)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                                : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentStepData.options.map((option) => {
                  const isSelected = isTagSelected(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleTag(option)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                          : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Custom Tag Input */}
            <form onSubmit={handleAddCustomTag} className="flex gap-2 max-w-md mt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="+ Add any favorite not listed here..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!customTagInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        )}

        {/* Selected Counter & Live World Preview Toggle */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">{selectedTags.length} favorites selected</span>
            <span>·</span>
            <span>Atmosphere: {livePreviewConfig.environment.name}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowLivePreviewModal(!showLivePreviewModal)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLivePreviewModal ? 'Hide Sanctuary Preview' : 'Preview My World'}</span>
          </button>
        </div>

        {/* Expanded Live Preview Panel */}
        {showLivePreviewModal && (
          <div
            className="p-5 rounded-2xl border transition-all text-center flex flex-col items-center shadow-inner"
            style={{
              background: livePreviewConfig.colorPalette.surface,
              borderColor: livePreviewConfig.colorPalette.border,
            }}
          >
            <CompanionAvatar companion={selectedCompanion} state="idle" size="md" />
            <h4 className="text-sm font-bold text-white mt-2">{livePreviewConfig.environment.name}</h4>
            <p className="text-xs text-slate-300 max-w-sm mt-0.5">{livePreviewConfig.environment.atmosphereDesc}</p>

            <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-md">
              {selectedTags.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-medium border border-indigo-500/30 capitalize"
                >
                  {tag}
                </span>
              ))}
              {selectedTags.length > 8 && (
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[11px]">
                  +{selectedTags.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleSkipQuestion}
            className="px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Skip this question
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <span>{currentStep === steps.length - 1 ? 'Finish & Create My World' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
