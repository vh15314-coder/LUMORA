import React, { useEffect, useState } from 'react';
import { CompanionId, CompanionState } from '../types';

interface CompanionAvatarProps {
  companion: CompanionId;
  state: CompanionState;
  onPet?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  companion,
  state: externalState,
  onPet,
  className = '',
  size = 'md',
}) => {
  const [internalBlink, setInternalBlink] = useState(false);

  // Automatic gentle natural blinking when in idle or greeting
  useEffect(() => {
    if (externalState === 'sleep') return;
    const interval = setInterval(() => {
      setInternalBlink(true);
      setTimeout(() => setInternalBlink(false), 220);
    }, 4500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [externalState]);

  const effectiveState = externalState === 'sleep' ? 'sleep' : internalBlink ? 'blink' : externalState;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-60 h-60',
  }[size];

  // Colors per companion
  const colors = {
    cat: {
      body: '#cbd5e1',
      belly: '#f8fafc',
      innerEar: '#f472b6',
      cheeks: '#fb7185',
      nose: '#f43f5e',
      eyes: '#1e293b',
      collar: '#818cf8',
    },
    dog: {
      body: '#e2d3bd',
      belly: '#faf5ee',
      innerEar: '#c8b498',
      cheeks: '#fb923c',
      nose: '#3e2e28',
      eyes: '#27201d',
      collar: '#38bdf8',
    },
    bunny: {
      body: '#f1f5f9',
      belly: '#ffffff',
      innerEar: '#fbcfe8',
      cheeks: '#f472b6',
      nose: '#ec4899',
      eyes: '#334155',
      collar: '#a78bfa',
    },
    panda: {
      body: '#ffffff',
      belly: '#f8fafc',
      dark: '#1e293b',
      cheeks: '#f472b6',
      nose: '#0f172a',
      eyes: '#0f172a',
      collar: '#34d399',
    },
  }[companion];

  // SVG eyes based on state
  const renderEyes = () => {
    if (effectiveState === 'sleep') {
      return (
        <g stroke={colors.eyes} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M38 52 Q44 57 50 52" />
          <path d="M70 52 Q76 57 82 52" />
        </g>
      );
    }
    if (effectiveState === 'blink') {
      return (
        <g stroke={colors.eyes} strokeWidth="2.5" strokeLinecap="round">
          <line x1="38" y1="52" x2="50" y2="52" />
          <line x1="70" y1="52" x2="82" y2="52" />
        </g>
      );
    }
    if (effectiveState === 'greeting' || effectiveState === 'playful') {
      return (
        <g stroke={colors.eyes} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M38 53 Q44 47 50 53" />
          <path d="M70 53 Q76 47 82 53" />
        </g>
      );
    }
    // Idle normal eyes with gentle light reflection
    return (
      <g>
        <circle cx="44" cy="52" r="4.5" fill={colors.eyes} />
        <circle cx="42.5" cy="50.5" r="1.5" fill="#ffffff" />
        <circle cx="76" cy="52" r="4.5" fill={colors.eyes} />
        <circle cx="74.5" cy="50.5" r="1.5" fill="#ffffff" />
      </g>
    );
  };

  // Companion specific features
  const renderCat = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none">
      {/* Ears */}
      <polygon points="30,22 48,46 22,46" fill={colors.body} />
      <polygon points="32,26 44,44 26,44" fill={colors.innerEar} opacity="0.8" />
      <polygon points="90,22 72,46 98,46" fill={colors.body} />
      <polygon points="88,26 76,44 94,44" fill={colors.innerEar} opacity="0.8" />

      {/* Tail */}
      <path
        d={effectiveState === 'playful' ? 'M95 90 Q112 75 106 60' : 'M95 90 Q110 95 105 80'}
        stroke={colors.body}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        className={effectiveState === 'playful' ? 'animate-bounce' : ''}
      />

      {/* Body */}
      <ellipse cx="60" cy="85" rx="36" ry="26" fill={colors.body} />
      <ellipse cx="60" cy="87" rx="22" ry="18" fill={colors.belly} />

      {/* Head */}
      <ellipse cx="60" cy="54" rx="34" ry="28" fill={colors.body} />

      {/* Cheeks */}
      <ellipse cx="36" cy="59" rx="5" ry="3" fill={colors.cheeks} opacity="0.5" />
      <ellipse cx="84" cy="59" rx="5" ry="3" fill={colors.cheeks} opacity="0.5" />

      {/* Whiskers */}
      <g stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round">
        <line x1="22" y1="56" x2="33" y2="57" />
        <line x1="22" y1="62" x2="33" y2="61" />
        <line x1="98" y1="56" x2="87" y2="57" />
        <line x1="98" y1="62" x2="87" y2="61" />
      </g>

      {/* Nose & Mouth */}
      <polygon points="60,59 57,56 63,56" fill={colors.nose} />
      <path
        d={effectiveState === 'playful' ? 'M55 62 Q60 68 65 62' : 'M56 61 Q60 64 64 61'}
        stroke="#475569"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eyes */}
      {renderEyes()}

      {/* Front Paws */}
      <ellipse cx="48" cy="98" rx="8" ry="6" fill={colors.belly} stroke={colors.body} strokeWidth="1.5" />
      <ellipse cx="72" cy="98" rx="8" ry="6" fill={colors.belly} stroke={colors.body} strokeWidth="1.5" />
    </svg>
  );

  const renderDog = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none">
      {/* Floppy Ears */}
      <ellipse cx="26" cy="46" rx="10" ry="18" fill={colors.innerEar} transform="rotate(15 26 46)" />
      <ellipse cx="94" cy="46" rx="10" ry="18" fill={colors.innerEar} transform="rotate(-15 94 46)" />

      {/* Tail */}
      <path
        d="M94 92 Q112 85 106 72"
        stroke={colors.body}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body */}
      <ellipse cx="60" cy="86" rx="36" ry="26" fill={colors.body} />
      <ellipse cx="60" cy="88" rx="22" ry="18" fill={colors.belly} />

      {/* Head */}
      <circle cx="60" cy="54" r="32" fill={colors.body} />
      <ellipse cx="60" cy="62" rx="18" ry="14" fill={colors.belly} />

      {/* Cheeks */}
      <ellipse cx="37" cy="60" rx="5" ry="3" fill={colors.cheeks} opacity="0.45" />
      <ellipse cx="83" cy="60" rx="5" ry="3" fill={colors.cheeks} opacity="0.45" />

      {/* Dog Nose & Tongue */}
      <ellipse cx="60" cy="59" rx="5.5" ry="4" fill={colors.nose} />
      {effectiveState === 'playful' ? (
        <path d="M57 65 Q60 74 63 65" fill="#f43f5e" />
      ) : (
        <path d="M57 63 Q60 67 63 63" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}

      {/* Eyes */}
      {renderEyes()}

      {/* Paws */}
      <ellipse cx="48" cy="98" rx="8" ry="6" fill={colors.belly} stroke={colors.body} strokeWidth="1.5" />
      <ellipse cx="72" cy="98" rx="8" ry="6" fill={colors.belly} stroke={colors.body} strokeWidth="1.5" />
    </svg>
  );

  const renderBunny = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none">
      {/* Tall Ears */}
      <ellipse cx="44" cy="24" rx="8" ry="22" fill={colors.body} transform="rotate(-6 44 24)" />
      <ellipse cx="44" cy="24" rx="5" ry="16" fill={colors.innerEar} transform="rotate(-6 44 24)" opacity="0.8" />
      <ellipse cx="76" cy="24" rx="8" ry="22" fill={colors.body} transform="rotate(6 76 24)" />
      <ellipse cx="76" cy="24" rx="5" ry="16" fill={colors.innerEar} transform="rotate(6 76 24)" opacity="0.8" />

      {/* Body */}
      <ellipse cx="60" cy="88" rx="34" ry="24" fill={colors.body} />
      <ellipse cx="60" cy="90" rx="20" ry="16" fill={colors.belly} />

      {/* Head */}
      <ellipse cx="60" cy="58" rx="30" ry="26" fill={colors.body} />

      {/* Cheeks */}
      <ellipse cx="38" cy="63" rx="5" ry="3" fill={colors.cheeks} opacity="0.5" />
      <ellipse cx="82" cy="63" rx="5" ry="3" fill={colors.cheeks} opacity="0.5" />

      {/* Tiny Nose & Mouth */}
      <ellipse cx="60" cy="62" rx="3.5" ry="2.5" fill={colors.nose} />
      <path d="M58 65 Q60 67 62 65" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      {renderEyes()}

      {/* Paws */}
      <ellipse cx="48" cy="98" rx="7" ry="5" fill={colors.belly} stroke={colors.body} strokeWidth="1.5" />
      <ellipse cx="72" cy="98" rx="7" ry="5" fill={colors.belly} stroke={colors.body} strokeWidth="1.5" />
    </svg>
  );

  const renderPanda = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none">
      {/* Round Dark Ears */}
      <circle cx="34" cy="32" r="12" fill={colors.dark} />
      <circle cx="86" cy="32" r="12" fill={colors.dark} />

      {/* Body */}
      <ellipse cx="60" cy="88" rx="36" ry="26" fill={colors.body} />
      <ellipse cx="60" cy="88" rx="36" ry="12" fill={colors.dark} opacity="0.9" />

      {/* Head */}
      <ellipse cx="60" cy="56" rx="34" ry="28" fill={colors.body} />

      {/* Eye Patches */}
      <ellipse cx="44" cy="52" rx="10" ry="13" fill={colors.dark} transform="rotate(-15 44 52)" />
      <ellipse cx="76" cy="52" rx="10" ry="13" fill={colors.dark} transform="rotate(15 76 52)" />

      {/* Cheeks */}
      <ellipse cx="34" cy="64" rx="5" ry="3" fill={colors.cheeks} opacity="0.45" />
      <ellipse cx="86" cy="64" rx="5" ry="3" fill={colors.cheeks} opacity="0.45" />

      {/* Nose & Mouth */}
      <ellipse cx="60" cy="62" rx="4.5" ry="3" fill={colors.nose} />
      <path d="M57 66 Q60 69 63 66" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Eyes (over black patches) */}
      {effectiveState === 'sleep' ? (
        <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M40 52 Q44 56 48 52" />
          <path d="M72 52 Q76 56 80 52" />
        </g>
      ) : effectiveState === 'blink' ? (
        <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
          <line x1="40" y1="52" x2="48" y2="52" />
          <line x1="72" y1="52" x2="80" y2="52" />
        </g>
      ) : (
        <g>
          <circle cx="44" cy="51" r="3" fill="#ffffff" />
          <circle cx="43" cy="50" r="1" fill="#0f172a" />
          <circle cx="76" cy="51" r="3" fill="#ffffff" />
          <circle cx="75" cy="50" r="1" fill="#0f172a" />
        </g>
      )}

      {/* Paws */}
      <ellipse cx="48" cy="98" rx="8" ry="6" fill={colors.dark} />
      <ellipse cx="72" cy="98" rx="8" ry="6" fill={colors.dark} />
    </svg>
  );

  return (
    <div
      onClick={onPet}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPet?.();
        }
      }}
      aria-label={`Your ${companion} companion in ${effectiveState} mood. Tap to interact.`}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-full p-2 ${className}`}
    >
      {/* Sleeping zZz particles */}
      {effectiveState === 'sleep' && (
        <div className="absolute -top-3 right-4 flex flex-col items-center pointer-events-none select-none text-xs font-serif font-bold text-indigo-300/80 animate-pulse">
          <span className="text-[10px] transform translate-x-2">z</span>
          <span className="text-xs transform translate-x-1">Z</span>
          <span className="text-sm">Z</span>
        </div>
      )}

      {/* Playful heart particle */}
      {effectiveState === 'playful' && (
        <div className="absolute -top-4 right-6 pointer-events-none text-rose-400 animate-bounce text-sm">
          ♥
        </div>
      )}

      {/* Greeting wave hint */}
      {effectiveState === 'greeting' && (
        <div className="absolute -top-3 left-4 pointer-events-none text-amber-300 text-xs animate-pulse">
          ✨
        </div>
      )}

      <div className={`${sizeClasses} transition-all duration-300`}>
        {companion === 'cat' && renderCat()}
        {companion === 'dog' && renderDog()}
        {companion === 'bunny' && renderBunny()}
        {companion === 'panda' && renderPanda()}
      </div>

      <div className="mt-1 text-[11px] font-medium tracking-wide uppercase text-slate-400">
        {companion} · {effectiveState}
      </div>
    </div>
  );
};
