import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, BookmarkPlus, Check, CloudRain, Moon, Sun, Trees, Flame, Compass, RefreshCw } from 'lucide-react';

interface SceneItem {
  id: string;
  type: string;
  label: string;
  icon: string;
  x: number; // percentage
  y: number; // percentage
}

export const PeacefulSceneActivity: React.FC = () => {
  const { addMoment, updateSettings, showToast } = useApp();

  const [backdrop, setBackdrop] = useState<'rain' | 'stars' | 'sunset' | 'forest' | 'fireplace'>('rain');
  const [items, setItems] = useState<SceneItem[]>([
    { id: '1', type: 'moon', label: 'Crescent Moon', icon: '🌙', x: 20, y: 20 },
    { id: '2', type: 'rain', label: 'Rain Drops', icon: '🌧️', x: 50, y: 30 },
    { id: '3', type: 'books', label: 'Cozy Books', icon: '📚', x: 75, y: 70 },
  ]);

  const backdropConfigs = {
    rain: {
      label: 'Rainy Night',
      style: 'radial-gradient(circle at 50% 20%, #1e1b4b, #090a14)',
      overlay: 'rain',
    },
    stars: {
      label: 'Starlit Den',
      style: 'radial-gradient(circle at 60% 30%, #2e1065, #0a0b12)',
      overlay: 'stars',
    },
    sunset: {
      label: 'Golden Sunset',
      style: 'radial-gradient(circle at 50% 20%, #451a03, #180d07)',
      overlay: 'sunset',
    },
    forest: {
      label: 'Whispering Forest',
      style: 'radial-gradient(circle at 40% 30%, #064e3b, #08140f)',
      overlay: 'forest',
    },
    fireplace: {
      label: 'Warm Fireplace',
      style: 'radial-gradient(circle at 50% 50%, #431407, #130a07)',
      overlay: 'hearth',
    },
  };

  const availableItems = [
    { type: 'moon', label: 'Moon', icon: '🌙' },
    { type: 'stars', label: 'Star', icon: '⭐' },
    { type: 'rain', label: 'Rain', icon: '🌧️' },
    { type: 'fireflies', label: 'Firefly', icon: '✨' },
    { type: 'clouds', label: 'Cloud', icon: '☁️' },
    { type: 'plant', label: 'Plant', icon: '🌿' },
    { type: 'books', label: 'Books', icon: '📚' },
    { type: 'tea', label: 'Warm Tea', icon: '🍵' },
    { type: 'cat', label: 'Sleeping Pet', icon: '🐱' },
  ];

  const addItemToScene = (itemDef: { type: string; label: string; icon: string }) => {
    if (items.length >= 10) {
      showToast('Scene is delightfully full and peaceful.');
      return;
    }
    const newItem: SceneItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type: itemDef.type,
      label: itemDef.label,
      icon: itemDef.icon,
      x: 15 + Math.floor(Math.random() * 70),
      y: 20 + Math.floor(Math.random() * 60),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveMoment = () => {
    const summary = `Created a peaceful ${backdropConfigs[backdrop].label} scene with ${items.map((i) => i.label).join(', ')}.`;
    addMoment(summary, 'My Peaceful Scene', 'scene');
  };

  const handleSetAsBackground = () => {
    updateSettings({
      backgroundOverride: backdropConfigs[backdrop].style,
    });
    showToast(`Set "${backdropConfigs[backdrop].label}" as your home sanctuary background.`);
  };

  const handleResetScene = () => {
    setItems([]);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl mx-auto rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Create a Peaceful Scene
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Combine calm elements to compose your personal stillness.
          </p>
        </div>

        <button
          onClick={handleResetScene}
          title="Reset scene"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Backdrop picker */}
      <div className="flex items-center gap-1.5 w-full overflow-x-auto pb-2 no-scrollbar">
        {(Object.keys(backdropConfigs) as (keyof typeof backdropConfigs)[]).map((key) => (
          <button
            key={key}
            onClick={() => setBackdrop(key)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              backdrop === key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {backdropConfigs[key].label}
          </button>
        ))}
      </div>

      {/* Interactive Scene Canvas */}
      <div
        style={{ background: backdropConfigs[backdrop].style }}
        className="relative w-full h-[280px] rounded-2xl border border-slate-800 overflow-hidden shadow-inner my-2 select-none"
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => removeItem(item.id)}
            title={`Tap to remove ${item.label}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl cursor-pointer hover:scale-125 transition-transform duration-200 drop-shadow-md p-1"
          >
            {item.icon}
          </div>
        ))}

        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400/80 pointer-events-none">
            Tap objects below to add them to your calm scene
          </div>
        )}
      </div>

      {/* Available Object Badges to Add */}
      <div className="w-full mt-2">
        <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
          Tap items to add:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {availableItems.map((itemDef) => (
            <button
              key={itemDef.type}
              onClick={() => addItemToScene(itemDef)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span>{itemDef.icon}</span>
              <span>{itemDef.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save & Set Actions */}
      <div className="flex items-center justify-between w-full gap-2 mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={handleSetAsBackground}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Set as Sanctuary BG</span>
        </button>

        <button
          onClick={handleSaveMoment}
          className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>Save as Moment</span>
        </button>
      </div>
    </div>
  );
};
