import usePresentationStore from '../store/usePresentationStore';
import SceneCanvas from '../components/SceneCanvas';

const STEP_TITLES = {
  0: 'Setup',
  1: 'Motion',
  2: 'Magnetic Field',
  3: 'Charge Motion',
  4: 'Charge Separation',
  5: 'Current',
};

function MainScene() {
  const currentStep = usePresentationStore((state) => state.currentStep);

  const captionTextByStep = {
    0: 'A conducting rod placed on rails',
    1: 'A conducting rod moving with velocity v',
    2: 'The rod moves through a magnetic field',
    3: 'Magnetic force acts on charges inside the rod',
    4: 'Charge separation creates potential difference',
    5: 'Current appears through the closed path',
  };

  const bottomText = captionTextByStep[currentStep] || STEP_TITLES[currentStep] || `Step ${currentStep}`;
  const title = STEP_TITLES[currentStep] || 'Presentation';

  return (
    <section className="space-y-5 md:space-y-6">
      <p className="text-center text-sm tracking-wide text-[#aaaaaa]">
        Step {currentStep}: {title}
      </p>

      <div className="h-[400px] w-full overflow-hidden rounded-[16px] border border-white/10 bg-[#0a0a0a]">
        <SceneCanvas />
      </div>

      <p className="text-center text-sm text-[#cccccc] transition-opacity duration-300">
        {bottomText}
      </p>
    </section>
  );
}

export default MainScene;

