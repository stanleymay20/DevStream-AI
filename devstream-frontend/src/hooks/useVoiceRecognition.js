const useVoiceRecognition = (onFinalTranscript) => {
  let recognition;

  const isSupported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (isSupported) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (onFinalTranscript) onFinalTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
    };
  }

  return {
    startListening: () => recognition?.start(),
    stopListening: () => recognition?.stop(),
  };
};

export default useVoiceRecognition;
