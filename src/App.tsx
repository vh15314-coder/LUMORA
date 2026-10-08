import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AtmosphereBackdrop } from './components/AtmosphereBackdrop';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { WelcomePage } from './pages/WelcomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MyWorldPage } from './pages/MyWorldPage';
import { ComfortsPage } from './pages/ComfortsPage';
import { PlayPage } from './pages/PlayPage';
import { ChatPage } from './pages/ChatPage';
import { HearMePage } from './pages/HearMePage';
import { MomentsPage } from './pages/MomentsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { ActivityContainer } from './components/activities/ActivityContainer';

const MainAppContent: React.FC = () => {
  const { user, activePage, setActivePage, worldConfig } = useApp();
  const [isOnboarding, setIsOnboarding] = useState(false);

  // If no user is signed in:
  if (!user) {
    if (isOnboarding) {
      return (
        <div
          className="relative min-h-screen text-slate-100 transition-colors duration-500"
          style={{ backgroundColor: worldConfig?.colorPalette?.bg || '#0a0d18' }}
        >
          <AtmosphereBackdrop />
          <OnboardingPage onComplete={() => setIsOnboarding(false)} />
          <Toast />
        </div>
      );
    }
    return (
      <div
        className="relative min-h-screen text-slate-100 transition-colors duration-500"
        style={{ backgroundColor: worldConfig?.colorPalette?.bg || '#0a0d18' }}
      >
        <AtmosphereBackdrop />
        <WelcomePage onStartOnboarding={() => setIsOnboarding(true)} />
        <Toast />
      </div>
    );
  }

  // Active Signed-in Sanctuary Experience
  return (
    <div
      className="relative min-h-screen pb-24 md:pb-12 text-slate-100 flex flex-col transition-colors duration-500"
      style={{ backgroundColor: worldConfig?.colorPalette?.bg || '#0a0d18' }}
    >
      <AtmosphereBackdrop />
      <Navigation />

      <main className="flex-1 w-full flex flex-col">
        {activePage === 'my-world' && <MyWorldPage />}
        {activePage === 'onboarding' && <OnboardingPage onComplete={() => setActivePage('my-world')} />}
        {activePage === 'comforts' && <ComfortsPage />}
        {activePage === 'play' && <PlayPage />}
        {activePage === 'chat' && <ChatPage />}
        {activePage === 'moments' && <MomentsPage />}
        {activePage === 'profile' && <ProfileSettingsPage />}
        {activePage === 'hear-me' && <HearMePage />}
        {activePage === 'activity-bubbles' && <ActivityContainer activityId="bubble_pop" />}
        {activePage === 'activity-plant' && <ActivityContainer activityId="grow_plant" />}
        {activePage === 'activity-breathe' && <ActivityContainer activityId="breathing" />}
        {activePage === 'activity-pet' && <ActivityContainer activityId="pet_care" />}
        {activePage === 'activity-colouring' && <ActivityContainer activityId="colouring" />}
        {activePage === 'activity-scene' && <ActivityContainer activityId="peaceful_scene" />}
      </main>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
