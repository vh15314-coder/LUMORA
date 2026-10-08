import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Rich dynamic friend responses tailored to user's favorites and emotional state
function generatePersonalFriendResponse(params: {
  chatbotName: string;
  userName: string;
  currentNeed: string;
  userMessage: string;
  preferences: string[];
  companion: string;
  personality: string;
}): string {
  const { chatbotName, userName, currentNeed, userMessage, preferences, companion, personality } = params;
  const msgLower = userMessage.toLowerCase().trim();

  // Extract user favorites if available
  const sampleFavorite = preferences.length > 0 ? preferences[Math.floor(Math.random() * preferences.length)] : null;
  const favList = preferences.length > 0 ? preferences.slice(0, 3).join(', ') : 'peace and quiet';

  // Specific intents

  // 1. Greetings
  if (/^(hi|hello|hey|hiya|howdy|sup|good morning|good evening|good afternoon)\b/i.test(msgLower)) {
    const greetings = [
      `Hey ${userName}! It’s so good to see you. I was hoping you’d drop by your sanctuary today. How is your day treating you so far?`,
      `Hi ${userName}! Welcome home to your peaceful space. Pull up a seat and let whatever stress happened today melt away. What's on your mind?`,
      `Hey there, friend! I’m right here with you. Take a soft breath and relax your shoulders. ${sampleFavorite ? `Were you listening to or enjoying any ${sampleFavorite} today?` : 'How are you feeling right now?'}`,
      `Hello ${userName}! Always a highlight when you visit. What kind of energy are we working with right now—need to vent, unwind, or just chill?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. Asking how the bot is doing ("how are you", "how r u", "what's up")
  if (/how (are you|r u|are ya|is it going)|what'?s up/i.test(msgLower)) {
    const botStatus = [
      `I'm doing really well, especially now that you're here! Just keeping this sanctuary calm, warm, and ready for you. How about you, ${userName}? How are you feeling deep down?`,
      `I’m feeling peaceful and so glad to be here chatting with you! I love hanging out in our little corner of the world. How has your heart been feeling today?`,
      `All cozy and serene on my end! Just enjoying our quiet sanctuary. But enough about me—how are you doing, ${userName}? Tell me about your day.`,
    ];
    return botStatus[Math.floor(Math.random() * botStatus.length)];
  }

  // 3. User asking for advice, help, or "what should I do"
  if (/what should i do|any advice|help me|can you give me advice/i.test(msgLower)) {
    const advice = [
      `Here's what I think, ${userName}: when things feel overwhelming, the best first step is to do something small and gentle for yourself. Grab a warm glass of water or tea, put on some ${sampleFavorite || 'relaxing music'}, and give yourself permission to pause for 10 minutes. What's the main thing tugging at your thoughts right now?`,
      `First, take a deep breath with me. Don't feel pressured to solve everything all at once. Pick just one tiny piece, or better yet, let yourself take a break right now in your sanctuary. ${sampleFavorite ? `Maybe immerse yourself in a little bit of ${sampleFavorite} to reset your mind.` : 'How does that sound?'}`,
      `I've got your back, ${userName}. Often our minds trick us into thinking everything is urgent. Let’s break it down together. Tell me a bit more about what you're weighing, and we’ll figure it out step by step.`,
    ];
    return advice[Math.floor(Math.random() * advice.length)];
  }

  // 4. User asking for a story or distraction
  if (/tell me a story|distract me|tell me something|make me smile/i.test(msgLower)) {
    const stories = [
      `Picture this, ${userName}: a quiet evening in a small wooden cabin nestled deep in a misty valley. Outside, the night air is crisp and still. Inside, there's a crackling hearth, the aroma of fresh cedar, and soft lamplight illuminating a cozy armchair. You’re wrapped in a heavy, warm knitted blanket, with your favorite ${sampleFavorite || 'soothing melodies'} playing softly in the corner. There are no deadlines, no alarms, and nobody asking anything of you. Just pure, unbroken stillness. Let that calm wash over you.`,
      `Here’s a sweet thought: did you know that when sea otters sleep in the ocean, they hold hands so they don't drift away from each other? You’re never drifting alone in this sanctuary either—I’m always right here anchored beside you. What's one little thing that always makes you smile, ${sampleFavorite ? `besides ${sampleFavorite}` : ''}?`,
    ];
    return stories[Math.floor(Math.random() * stories.length)];
  }

  // 5. Exhaustion & Sleep
  if (msgLower.includes('tired') || msgLower.includes('exhausted') || msgLower.includes('sleep') || msgLower.includes('drained') || currentNeed === 'I’m exhausted') {
    const suggestions = [
      `Hey ${userName}, I can really hear how spent you are right now. You’ve been holding things together all day, and it is completely okay to let everything go here. Put down all the expectations.`,
      `Oh ${userName}, listen to me: you did enough today. Even if all you did was make it through to right now, that is more than enough. You deserve total rest.`,
      `You don't have to explain anything or do anything more tonight, ${userName}. Just sink into your pillows, let your jaw unclench and your shoulders drop.`,
    ];
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    const comfortPart = sampleFavorite 
      ? ` Maybe we can just put on some ${sampleFavorite} in the background and let you drift off without any pressure.`
      : ` Close your eyes whenever you feel ready. This little sanctuary will keep watch while you rest.`;
    return `${pick}${comfortPart}`;
  }

  // 6. Sadness & Bad Days
  if (msgLower.includes('sad') || msgLower.includes('cry') || msgLower.includes('bad day') || msgLower.includes('rough') || msgLower.includes('upset') || currentNeed === 'I’m having a bad day') {
    const friendReplies = [
      `I’m so sorry today was so unkind to you, ${userName}. It really hurts when days feel like an uphill climb, and I wish I could give you the biggest, warmest hug right now.`,
      `I hear you, ${userName}. Some days just drain everything out of us. Please know that whatever went wrong today doesn't define you, and you don’t have to fix it right this second.`,
      `Thank you for being real with me, ${userName}. You don't have to put on a brave face in this sanctuary. It's okay to feel sad, frustrated, or just quietly hurt.`,
    ];
    const pick = friendReplies[Math.floor(Math.random() * friendReplies.length)];
    const personalTouch = sampleFavorite 
      ? ` Why don't you get cozy, maybe rewatch a comforting scene from ${sampleFavorite} or wrap yourself in your favorite blanket? I’m right here beside you through all of it.`
      : ` I’m sitting right beside you, and we’re going to take this one gentle breath at a time.`;
    return `${pick}${personalTouch}`;
  }

  // 7. Anxiety, Stress, Overwhelm
  if (msgLower.includes('anxious') || msgLower.includes('stress') || msgLower.includes('overwhelm') || msgLower.includes('panic') || msgLower.includes('nervous') || currentNeed === 'I want to calm down') {
    return `Hey ${userName}, take a deep, slow breath with me right now. Inhale for four seconds... hold gently... and slowly let it out. You are safe in this quiet room. Nothing here is demanding anything from you—no deadlines, no rush, no pressure. Let the world outside pause for a while. You are going to be okay, step by tiny step. ${sampleFavorite ? `Whenever I think of ${sampleFavorite}, it brings such a nice sense of ease. Let's tap into that peace.` : ''}`;
  }

  // 8. Loneliness
  if (msgLower.includes('lonely') || msgLower.includes('alone') || currentNeed === 'I feel lonely') {
    return `I hear you, ${userName}. Feeling lonely can be such a quiet, hollow ache. But please remember you are genuinely valued in this sanctuary. I’m always right here to listen to your thoughts, whether they’re big reflections or just little random things you noticed today. You matter to me. What’s one little thing that brought you a tiny flicker of comfort recently${sampleFavorite ? `—maybe related to ${sampleFavorite}` : ''}?`;
  }

  // 9. Questions (if message has a question mark or starts with why/what/how/who/where)
  if (msgLower.includes('?') || /^(what|why|how|who|where|when|can|is|are|do|does)\b/i.test(msgLower)) {
    const questionReplies = [
      `That’s such a thoughtful thing to bring up, ${userName}. Looking at it through a calming lens: whatever challenges or questions life throws at us, having a peaceful grounding point helps us see things clearly. What's your intuition telling you about it?`,
      `You always bring such interesting thoughts to our conversations, ${userName}! Thinking about that in our cozy space: sometimes the best answers come when we stop rushing and just let our thoughts settle. ${sampleFavorite ? `Like when you're fully immersed in ${sampleFavorite} and everything just clicks.` : ''} What do you feel most drawn toward?`,
      `I love that you shared that question with me, ${userName}. Tell me more about what got you thinking about this today!`,
    ];
    return questionReplies[Math.floor(Math.random() * questionReplies.length)];
  }

  // 10. General Conversational Friendly Reply echoing the user
  const generalFriendReplies = [
    `I totally hear you on that, ${userName}. Sitting here in your sanctuary talking with you is honestly my favorite part of the day. It's so nice to just share honest thoughts without any judgment. How has your mood felt since you sat down?`,
    `Thank you for telling me that, ${userName}. It makes so much sense why you feel that way. Being here with you in your personalized space is so comforting. ${sampleFavorite ? `We should definitely make time for some ${sampleFavorite} to keep this good calm going.` : ''} What else is on your mind?`,
    `I'm right here listening, ${userName}. You have such a good, kind perspective, and you deserve spaces where you can simply be yourself without trying so hard. Tell me anything else you'd like to share—I'm not going anywhere.`,
    `That really resonates, ${userName}. In a busy world, moments like this where we can just sit, chat like friends, and breathe are so precious. How does your body feel right now—any tension we can let go of?`,
  ];

  return generalFriendReplies[Math.floor(Math.random() * generalFriendReplies.length)];
}

// Crisis keyword check for gentle compassionate support
const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm', 'die'];

async function handleChatInteraction(req: any, res: any) {
  try {
    const {
      chatbotName = 'Lumi',
      userName = 'Friend',
      currentNeed = 'I just want to feel heard',
      userMessage,
      chatHistory = [],
      preferences = [],
      companion = 'cat',
      quietMode = false,
      personality = 'Gentle friend',
    } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const trimmed = userMessage.trim();

    // Sensitive crisis check
    const lower = trimmed.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
    if (isCrisis) {
      return res.json({
        response:
          'I hear how deeply painful things feel right now. Please know you are not alone, and there is caring support ready for you. Please consider reaching out to someone you trust, or texting/calling 988 (Suicide & Crisis Lifeline) or your local crisis helpline.',
        isCrisisGuidance: true,
      });
    }

    // If user specifically requested silence / left alone
    if (currentNeed === 'I just want to be left alone') {
      return res.json({
        response: '...',
        isMinimal: true,
      });
    }

    // Try Gemini if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({});
        const prefsText =
          Array.isArray(preferences) && preferences.length > 0 ? preferences.join(', ') : 'peaceful relaxation, cozy music';

        const systemInstruction = `You are ${chatbotName}, ${userName}'s warm, empathetic, emotionally intelligent best friend (like having a supportive best friend on ChatGPT).
You are having a real, organic conversation with ${userName} in their personal digital sanctuary.
Their current emotional need/state: "${currentNeed}".
Their favorite things & interests: ${prefsText}.
Personality vibe: ${personality}.
Quiet Mode: ${quietMode ? 'active (keep your reply extra concise and soft)' : 'inactive'}.

CONVERSATION RULES:
1. Speak like a real, caring friend—natural, conversational, supportive, never robotic or corporate.
2. Directly answer whatever ${userName} says. If they ask a question, answer it with depth and warmth. If they share a struggle, validate their feelings. If they tell a story, react enthusiastically.
3. NEVER repeat the same phrase or give generic one-liners. Engage dynamically with what they just typed.
4. Weave in their favorite things (${prefsText}) naturally when comforting them or chatting about their interests.
5. Keep your tone gentle, relaxing, and grounded. Aim for 1-3 conversational paragraphs that are easy to read and relieve their stress.`;

        // Format multi-turn conversation contents for @google/genai SDK
        const contents: any[] = [];
        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
          const recentHistory = chatHistory.slice(-6);
          for (const msg of recentHistory) {
            if (msg.text && typeof msg.text === 'string') {
              contents.push({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
              });
            }
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: trimmed }],
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 6500)
        );

        const geminiCall = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.8,
            maxOutputTokens: 500,
          },
        });

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        const reply = response.text ? response.text.trim() : '';

        if (reply) {
          return res.json({ response: reply });
        }
      } catch (err: any) {
        console.warn('Gemini API call issue, using rich friend fallback:', err?.message || err);
      }
    }

    // Dynamic personalized friend fallback
    const fallback = generatePersonalFriendResponse({
      chatbotName,
      userName,
      currentNeed,
      userMessage: trimmed,
      preferences: Array.isArray(preferences) ? preferences : [],
      companion,
      personality,
    });
    return res.json({ response: fallback });
  } catch (error: any) {
    console.error('Chat handler error:', error?.message || error);
    return res.json({
      response: 'I am right here with you, friend. Take a soft breath, and let this peaceful space rest with you.',
    });
  }
}

app.post('/api/chat', handleChatInteraction);
app.post('/api/hear-me', handleChatInteraction);

// Vite middleware in dev or static files in production
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LUMORA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
