import { useEffect } from 'react';
import { useAIOverlayStore } from '@/store/aiOverlayStore';
import { speakText } from '@/utils/speech';

const tourSteps = [
  {
    selector: 'input[name="prompt"]',
    message: 'This is your command prompt. You can type any request here.',
    voice: 'This is your command prompt. You can type any request here.',
    delay: 5000,
  },
  {
    selector: '.editor-container',
    message: 'This is your Monaco editor. All code appears here live.',
    voice: 'This is your Monaco editor. All code appears here live.',
    delay: 6000,
  },
  {
    selector: '#sidebar-item-src-App-jsx',
    message: 'Click files here to switch views.',
    voice: 'Click files here to switch views.',
    delay: 5000,
  },
  {
    selector: 'button[type="submit"]',
    message: 'Click this to send your request to DevStream.',
    voice: 'Click this to send your request to DevStream.',
    delay: 4000,
  },
];

function TourManager() {
  const { showOverlay, clearOverlay } = useAIOverlayStore();

  useEffect(() => {
    let i = 0;

    const nextStep = () => {
      if (i >= tourSteps.length) return;
      const step = tourSteps[i];
      showOverlay(step.selector, step.message);
      speakText(step.voice);
      setTimeout(() => {
        clearOverlay();
        i++;
        nextStep();
      }, step.delay);
    };

    const startTour = setTimeout(() => {
      nextStep();
    }, 2000);

    return () => {
      clearTimeout(startTour);
      clearOverlay();
    };
  }, [clearOverlay, showOverlay]);

  return null;
}

export default TourManager;
