import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BubblePop } from '../components/activities/BubblePop';
import { GrowPlant } from '../components/activities/GrowPlant';
import { BreathingGuide } from '../components/activities/BreathingGuide';
import { PetCareActivity } from '../components/activities/PetCareActivity';
import { ColouringActivity } from '../components/activities/ColouringActivity';
import { ZenStoneStacking } from '../components/activities/ZenStoneStacking';
import { ZenSandGarden } from '../components/activities/ZenSandGarden';
import { Sparkles, Flower2, Wind, Heart, Palette, ArrowLeft, Layers, Waves } from 'lucide-react';

export const PlayPage: React.FC = () => {
  const { setActivePage } = useApp();
  const [activeTab, setActiveTab] = useState<
    'stones' | 'sand' | 'bubbles' | 'plant' | 'breathe' | 'pet' | 'colouring'
  >('stones');

  const tabs: {
    id: 'stones' | 'sand' | 'bubbles' | 'plant' | 'breathe' | 'pet' | 'colouring';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'stones', label: 'Zen Stone Stacking', icon: <Layers className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'sand', label: 'Sand Garden', icon: <Waves className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'bubbles', label: 'Bubble Pop', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'breathe', label: 'Centering Breath', icon: <Wind className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'plant', label: 'Grow a Plant', icon: <Flower2 className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'pet', label: 'Pet Care', icon: <Heart className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'colouring', label: 'Colouring', icon: <Palette className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('my-world')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <span className="text-xs text-indigo-400 font-medium">Stress-Relief Games</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gentle Ways to Relieve Stress</h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero time limits, zero failure states, no competition. Just soothing, tactile calm.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        {activeTab === 'stones' && <ZenStoneStacking />}
        {activeTab === 'sand' && <ZenSandGarden />}
        {activeTab === 'bubbles' && <BubblePop />}
        {activeTab === 'breathe' && <BreathingGuide />}
        {activeTab === 'plant' && <GrowPlant />}
        {activeTab === 'pet' && <PetCareActivity />}
        {activeTab === 'colouring' && <ColouringActivity />}
      </div>
    </div>
  );
};
