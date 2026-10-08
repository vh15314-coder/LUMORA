import React from 'react';
import { useApp } from '../context/AppContext';
import { CurrentNeed } from '../types';
import {
  HeartHandshake,
  MessageSquare,
  Coffee,
  Moon,
  Sparkles,
  CloudLightning,
  Heart,
  Smile,
  ShieldMinus,
} from 'lucide-react';

export const CurrentNeedSelector: React.FC = () => {
  const { currentNeed, setCurrentNeed } = useApp();

  const needsList: { need: CurrentNeed; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      need: 'I want to calm down',
      label: 'I want to calm down',
      icon: <HeartHandshake className="w-4 h-4" />,
      desc: 'Gentle breath & soothing rhythm',
    },
    {
      need: 'I just want to feel heard',
      label: 'I just want to feel heard',
      icon: <MessageSquare className="w-4 h-4" />,
      desc: 'Safe listening, no unsolicited advice',
    },
    {
      need: 'I want something relaxing',
      label: 'I want something relaxing',
      icon: <Coffee className="w-4 h-4" />,
      desc: 'Soundscapes & gentle ambience',
    },
    {
      need: 'I’m exhausted',
      label: 'I’m exhausted',
      icon: <Moon className="w-4 h-4" />,
      desc: 'Zero pressure, quiet rest',
    },
    {
      need: 'I feel lonely',
      label: 'I feel lonely',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Warm comforting presence',
    },
    {
      need: 'I’m having a bad day',
      label: 'I’m having a bad day',
      icon: <CloudLightning className="w-4 h-4" />,
      desc: 'Tender low-effort comfort',
    },
    {
      need: 'I just want to feel better',
      label: 'I just want to feel better',
      icon: <Heart className="w-4 h-4" />,
      desc: 'Soothing blend of care & quiet',
    },
    {
      need: 'Distract me gently',
      label: 'Distract me gently',
      icon: <Smile className="w-4 h-4" />,
      desc: 'Low-pressure games & play',
    },
    {
      need: 'I just want to be left alone',
      label: 'I just want to be left alone',
      icon: <ShieldMinus className="w-4 h-4" />,
      desc: 'Silent stillness & privacy',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          What do you need right now?
        </h3>
        <span className="text-xs text-indigo-400 font-medium truncate max-w-[220px]">
          Current: {currentNeed}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
        {needsList.map((item) => {
          const isActive = currentNeed === item.need;
          return (
            <button
              key={item.need}
              onClick={() => setCurrentNeed(item.need)}
              aria-pressed={isActive}
              className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 min-h-[64px] ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500/80 text-white shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/70 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium tracking-tight truncate leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
