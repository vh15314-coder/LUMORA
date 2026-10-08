import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanionAvatar } from '../CompanionAvatar';
import { Heart, Sparkles, Coffee, Moon, Smile, RotateCcw } from 'lucide-react';
import { CompanionState } from '../../types';

export const PetCareActivity: React.FC = () => {
  const { user, petCompanion, showToast } = useApp();
  const companion = user?.companion || 'cat';

  const [petState, setPetState] = useState<CompanionState>('idle');
  const [careAction, setCareAction] = useState<string>('resting quietly');
  const [affectionPoints, setAffectionPoints] = useState<number>(0);

  const handleAction = (action: 'pet' | 'treat' | 'brush' | 'cuddle' | 'rest') => {
    petCompanion();
    setAffectionPoints((p) => p + 1);

    switch (action) {
      case 'pet':
        setPetState('playful');
        setCareAction(`Gently patted your ${companion}. Happy purrs and wiggles!`);
        showToast(`Your ${companion} leaned softly into your hand.`);
        break;
      case 'treat':
        setPetState('greeting');
        setCareAction(`Offered a sweet gentle treat to your ${companion}.`);
        showToast(`Your ${companion} nibbled peacefully.`);
        break;
      case 'brush':
        setPetState('blink');
        setCareAction(`Gently groomed your ${companion} with a soft brush.`);
        showToast(`Your ${companion} closed its eyes in deep comfort.`);
        break;
      case 'cuddle':
        setPetState('greeting');
        setCareAction(`Warm cuddle with your ${companion}.`);
        showToast(`Warm and comforting presence.`);
        break;
      case 'rest':
        setPetState('sleep');
        setCareAction(`Tucked your ${companion} into a plush velvet bed.`);
        showToast(`Your ${companion} curled up for a peaceful nap.`);
        break;
    }

    setTimeout(() => {
      if (action !== 'rest') {
        setPetState('idle');
      }
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl mx-auto rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Cozy {companion.charAt(0).toUpperCase() + companion.slice(1)} Nook
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Spend unhurried, gentle time with your companion. No goals, just care.
          </p>
        </div>

        <span className="text-xs text-indigo-400 font-medium">
          Gentle moments: {affectionPoints}
        </span>
      </div>

      {/* Companion Sanctuary Rug Area */}
      <div className="relative w-full py-8 my-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center overflow-hidden">
        {/* Soft glowing mat */}
        <div className="absolute w-44 h-16 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

        <CompanionAvatar
          companion={companion}
          state={petState}
          onPet={() => handleAction('pet')}
          size="lg"
        />

        <p className="text-xs text-slate-300 mt-3 text-center max-w-xs font-serif italic">
          "{careAction}"
        </p>
      </div>

      {/* Gentle Care Interactions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-3">
        <button
          onClick={() => handleAction('pet')}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gentle Pet</span>
        </button>

        <button
          onClick={() => handleAction('treat')}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Coffee className="w-4 h-4 text-emerald-400" />
          <span>Give Treat</span>
        </button>

        <button
          onClick={() => handleAction('brush')}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Smile className="w-4 h-4 text-sky-400" />
          <span>Soft Brush</span>
        </button>

        <button
          onClick={() => handleAction('rest')}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Moon className="w-4 h-4 text-indigo-400" />
          <span>Rest Nook</span>
        </button>
      </div>
    </div>
  );
};
