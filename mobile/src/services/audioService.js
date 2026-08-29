import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { getAudioTtsUrl } from './api';

let currentSound = null;
let isPlaying = false;

export const mobileAudioService = {
  // Clean markdown, citations, chunk numbers, and code blocks
  cleanText: (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/Chunk\s+#\d+/gi, '')
      .replace(/Page\s+\d+/gi, '')
      .replace(/\b\d+%\s+Relevance\b/gi, '')
      .replace(/\b\d+%\s+Grounded\b/gi, '')
      .replace(/\b\d+ms\b/gi, '')
      .replace(/•/g, '')
      .replace(/→/g, '')
      .replace(/>/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Stop any active speech on mobile
  stop: async () => {
    isPlaying = false;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        currentSound = null;
      }
    } catch (e) {
      currentSound = null;
    }
    try {
      Speech.stop();
    } catch (e) {}
  },

  // Play fluent native audio stream in selected language (Telugu, Hindi, Tamil, etc.)
  playNativeSpeech: async (rawText, langCode = 'en', onStart, onEnd, onError) => {
    await mobileAudioService.stop();

    const cleaned = mobileAudioService.cleanText(rawText);
    if (!cleaned) {
      if (onEnd) onEnd();
      return;
    }

    const lang = (langCode || 'en').toLowerCase().split('-')[0];
    const speechChunk = cleaned.slice(0, 600); // Safe length for single audio utterance

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const ttsUrl = getAudioTtsUrl(speechChunk, lang);
      const { sound } = await Audio.Sound.createAsync(
        { uri: ttsUrl },
        { shouldPlay: true }
      );

      currentSound = sound;
      isPlaying = true;
      if (onStart) onStart();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          mobileAudioService.stop();
          if (onEnd) onEnd();
        }
      });
    } catch (err) {
      console.warn('Expo Audio streaming error, attempting native speech synthesis fallback:', err);
      try {
        if (onStart) onStart();
        Speech.speak(speechChunk, {
          language: lang,
          pitch: 1.0,
          rate: 0.95,
          onDone: () => {
            if (onEnd) onEnd();
          },
          onError: () => {
            if (onError) onError();
          },
        });
      } catch (fallbackErr) {
        if (onError) onError(fallbackErr);
      }
    }
  }
};
