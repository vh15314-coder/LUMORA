import React from 'react';
import { useApp } from '../context/AppContext';
import { ChatbotView } from '../components/ChatbotView';

export const ChatPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 relative z-10">
      <ChatbotView onBack={() => setActivePage('my-world')} />
    </div>
  );
};
