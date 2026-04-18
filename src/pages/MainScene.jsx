import usePresentationStore from '../store/usePresentationStore';
import { AnimatePresence, motion } from 'framer-motion';

const STEP_TITLES = {
  0: 'Intro',
  1: 'System Setup',
  2: 'Motion Begins',
  3: 'Charge Separation',
  4: 'Electric Field Forms',
  5: 'Formula Emerges',
  6: 'Circuit Forms',
  7: 'Current Flow',
  8: "Lenz's Law",
};

function MainScene() {
  const currentStep = usePresentationStore((state) => state.currentStep);
  const maxSteps = usePresentationStore((state) => state.maxSteps);

  const currentTitle = STEP_TITLES[currentStep] || `Step ${currentStep}`;

  if (currentStep <= 2) {
    const captionTextByStep = {
      0: 'A conducting rod placed on rails',
      1: 'A conducting rod moving with velocity v',
      2: 'The rod moves through a magnetic field',
    };
    const captionText = captionTextByStep[currentStep];

    return (
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-[#cccccc]"
        >
          {captionText}
        </motion.p>
      </AnimatePresence>
    );
  }

  return (
    <>
      <p className="absolute left-6 top-6 text-sm text-gray-400">
        Step {currentStep} / {maxSteps}
      </p>

      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-gray-100 md:text-7xl">{currentTitle}</h1>
        <p className="mt-5 text-base text-gray-400 md:text-lg">Use Left/Right arrows or Space to navigate</p>
      </div>
    </>
  );
}

export default MainScene;

