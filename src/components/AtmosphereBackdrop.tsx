import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, CloudRain, Disc3, Sparkles, Coffee } from 'lucide-react';

export const AtmosphereBackdrop: React.FC = () => {
  const { worldConfig, user } = useApp();
  const { environment, animationIntensity } = worldConfig;
  const isQuiet = user?.settings.quietMode;
  const disableMotion = animationIntensity === 'none' || isQuiet;
  const currentTheme = user?.settings?.themeOverride || 'night';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background glow and gradient */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: environment.backdropStyle,
        }}
      />

      {/* Weather / Sky Visual effects tailored to theme */}
      {(environment.skyVisual === 'warm_sunset' || currentTheme === 'sunset') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-rose-600/15 via-amber-500/10 to-transparent" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-rose-500/20 blur-3xl" />
          <div className="absolute top-20 right-[15%] w-[400px] h-[300px] rounded-full bg-amber-500/15 blur-3xl" />
        </div>
      )}

      {(environment.skyVisual === 'canopy_leaves' || currentTheme === 'nature') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-emerald-600/15 via-teal-500/10 to-transparent" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute top-24 left-[10%] w-[350px] h-[300px] rounded-full bg-teal-500/15 blur-3xl" />
        </div>
      )}

      {(environment.skyVisual === 'fireplace_glow' || currentTheme === 'warm') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-amber-600/15 via-orange-500/10 to-transparent" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute top-24 left-[20%] w-[380px] h-[300px] rounded-full bg-orange-500/15 blur-3xl" />
        </div>
      )}

      {(environment.skyVisual === 'starlit_sky' || currentTheme === 'night') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-600/15 via-violet-500/10 to-transparent" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-indigo-500/20 blur-3xl" />
          {!disableMotion && (
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-[8%] left-[18%] w-1.5 h-1.5 rounded-full bg-indigo-200 animate-ping duration-1000" />
              <div className="absolute top-[22%] left-[78%] w-1.5 h-1.5 rounded-full bg-violet-200 animate-pulse duration-700" />
              <div className="absolute top-[48%] left-[12%] w-1 h-1 rounded-full bg-slate-200 animate-pulse duration-1000" />
              <div className="absolute top-[65%] left-[82%] w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse duration-500" />
            </div>
          )}
        </div>
      )}

      {(environment.skyVisual === 'soft_clouds' || currentTheme === 'soft') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-sky-600/15 via-cyan-500/10 to-transparent" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-sky-500/20 blur-3xl" />
        </div>
      )}

      {currentTheme === 'rain' && !disableMotion && (
        <div className="absolute inset-0 opacity-25 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-600/15 via-slate-600/10 to-transparent" />
          <div className="absolute top-0 left-[15%] w-0.5 h-32 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse duration-700" />
          <div className="absolute top-12 left-[35%] w-0.5 h-24 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse duration-1000 delay-150" />
          <div className="absolute top-6 left-[65%] w-0.5 h-36 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse duration-900 delay-300" />
          <div className="absolute top-24 left-[85%] w-0.5 h-28 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse duration-800 delay-500" />
        </div>
      )}
    </div>
  );
};
