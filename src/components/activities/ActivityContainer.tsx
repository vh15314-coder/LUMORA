import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { BubblePop } from './BubblePop';
import { GrowPlant } from './GrowPlant';
import { BreathingGuide } from './BreathingGuide';
import { PetCareActivity } from './PetCareActivity';
import { ColouringActivity } from './ColouringActivity';
import { PeacefulSceneActivity } from './PeacefulSceneActivity';

interface ActivityContainerProps {
  activityId: 'bubble_pop' | 'grow_plant' | 'breathing' | 'pet_care' | 'colouring' | 'peaceful_scene';
}

export const ActivityContainer: React.FC<ActivityContainerProps> = ({ activityId }) => {
  const { setActivePage } = useApp();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 relative z-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('my-world')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <span className="text-xs text-indigo-400 font-medium">Gentle Activity</span>
      </div>

      <div className="mt-2">
        {activityId === 'bubble_pop' && <BubblePop />}
        {activityId === 'grow_plant' && <GrowPlant />}
        {activityId === 'breathing' && <BreathingGuide />}
        {activityId === 'pet_care' && <PetCareActivity />}
        {activityId === 'colouring' && <ColouringActivity />}
        {activityId === 'peaceful_scene' && <PeacefulSceneActivity />}
      </div>
    </div>
  );
};
