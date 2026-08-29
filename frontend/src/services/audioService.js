let currentAudio = null;
let isPlayingQueue = false;
let audioQueue = [];
let currentQueueIndex = 0;

export const audioService = {
  // Clean markdown, citations, timestamps, and technical symbols
  cleanText: (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/```[\s\S]*?```/g, '') // code blocks
      .replace(/`([^`]+)`/g, '$1')     // inline code
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
      .replace(/\*([^*]+)\*/g, '$1')     // italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/Chunk\s+#\d+/gi, '')    // chunk markers
      .replace(/Page\s+\d+/gi, '')      // page markers
      .replace(/\b\d+%\s+Relevance\b/gi, '') // relevance score
      .replace(/\b\d+%\s+Grounded\b/gi, '')
      .replace(/\b\d+ms\b/gi, '')
      .replace(/•/g, '')
      .replace(/→/g, '')
      .replace(/>/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Detect script of the text to prevent phonetic garbling
  detectLanguageScript: (text, preferredLang = 'en') => {
    // Unicode ranges for Indic scripts
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const hindiRegex = /[\u0900-\u097F]/;
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const kannadaRegex = /[\u0C80-\u0CFF]/;
    const malayalamRegex = /[\u0D00-\u0D7F]/;
    const bengaliRegex = /[\u0980-\u09FF]/;
    const gujaratiRegex = /[\u0A80-\u0AFF]/;

    if (teluguRegex.test(text)) return 'te';
    if (hindiRegex.test(text)) return 'hi';
    if (tamilRegex.test(text)) return 'ta';
    if (kannadaRegex.test(text)) return 'kn';
    if (malayalamRegex.test(text)) return 'ml';
    if (bengaliRegex.test(text)) return 'bn';
    if (gujaratiRegex.test(text)) return 'gu';

    // If preferred language matches and text has non-ascii or preferred is Western
    return preferredLang || 'en';
  },

  // Split text into short, natural sentence chunks under 150 characters
  splitIntoSentences: (text, maxLen = 140) => {
    const rawSentences = text.match(/[^.?!।\n]+[.?!।\n]+|[^.?!।\n]+$/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (let s of rawSentences) {
      s = s.trim();
      if (!s) continue;

      if ((currentChunk + ' ' + s).trim().length <= maxLen) {
        currentChunk = (currentChunk + ' ' + s).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        // If single sentence is itself too long, split by words
        if (s.length > maxLen) {
          const words = s.split(' ');
          let temp = '';
          for (let w of words) {
            if ((temp + ' ' + w).trim().length <= maxLen) {
              temp = (temp + ' ' + w).trim();
            } else {
              if (temp) chunks.push(temp);
              temp = w;
            }
          }
          if (temp) chunks.push(temp);
          currentChunk = '';
        } else {
          currentChunk = s;
        }
      }
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  },

  // Stop any active speech playback
  stop: () => {
    isPlayingQueue = false;
    audioQueue = [];
    currentQueueIndex = 0;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // Play natural native speech sequentially
  playNativeSpeech: (rawText, preferredLangCode = 'en', onStart, onEnd, onError) => {
    audioService.stop();

    const cleaned = audioService.cleanText(rawText);
    if (!cleaned) {
      if (onEnd) onEnd();
      return;
    }

    // Determine actual script to speak cleanly without gibberish
    const lang = audioService.detectLanguageScript(cleaned, preferredLangCode);
    const chunks = audioService.splitIntoSentences(cleaned);

    if (chunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    audioQueue = chunks;
    currentQueueIndex = 0;
    isPlayingQueue = true;

    if (onStart) onStart();

    const targetLang = (preferredLangCode || 'en').toLowerCase().split('-')[0];

    const playNextChunk = () => {
      if (!isPlayingQueue || currentQueueIndex >= audioQueue.length) {
        audioService.stop();
        if (onEnd) onEnd();
        return;
      }

      const chunkText = audioQueue[currentQueueIndex];
      currentQueueIndex++;

      const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
      const ttsUrl = `${baseUrl}/ai/tts?text=${encodeURIComponent(chunkText)}&lang=${targetLang}`;
      const audio = new Audio(ttsUrl);
      currentAudio = audio;

      audio.onended = () => {
        playNextChunk();
      };

      audio.onerror = () => {
        console.warn('Backend neural TTS streaming error, falling back to Web Speech API...');
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(chunkText);
          utterance.lang = preferredLangCode || 'en-US';
          utterance.onend = () => playNextChunk();
          utterance.onerror = () => playNextChunk();
          window.speechSynthesis.speak(utterance);
        } else {
          playNextChunk();
        }
      };

      audio.play().catch((err) => {
        console.warn('Audio play error, using browser speech synthesis:', err);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(chunkText);
          utterance.lang = preferredLangCode || 'en-US';
          utterance.onend = () => playNextChunk();
          utterance.onerror = () => playNextChunk();
          window.speechSynthesis.speak(utterance);
        } else {
          playNextChunk();
        }
      });
    };

    playNextChunk();
  }
};
