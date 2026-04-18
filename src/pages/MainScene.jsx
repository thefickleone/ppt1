import usePresentationStore from '../store/usePresentationStore';
import { motion } from 'framer-motion';
import SceneCanvas from '../components/SceneCanvas';

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

  const captionTextByStep = {
    0: 'A conducting rod placed on rails',
    1: 'A conducting rod moving with velocity v',
    2: 'The rod moves through a magnetic field',
    3: 'Magnetic force acts on charges inside the rod',
    4: 'Charge separation creates potential difference',
  };

  const bottomText = captionTextByStep[currentStep] || STEP_TITLES[currentStep] || `Step ${currentStep}`;

  return (
    <section className="space-y-5 md:space-y-6">
      <p className="text-center text-sm tracking-wide text-[#aaaaaa]">Motional EMF Presentation - Step {currentStep}</p>

      <div className="h-[400px] w-full overflow-hidden rounded-[16px] border border-white/10 bg-[#0a0a0a]">
        <SceneCanvas />
      </div>

      <motion.p
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center text-sm text-[#cccccc]"
      >
        {bottomText}
      </motion.p>
    </section>
  );
}

export default MainScene;

