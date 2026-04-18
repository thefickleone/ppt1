import usePresentationStore from '../store/usePresentationStore';

const STEP_TITLES = {
  0: 'Intro',
  1: 'System Setup',
  2: 'Motion Begins',
  3: 'Charge Separation',
  4: 'Electric Field Forms',
  5: 'Formula Emerges',
};

function MainScene() {
  const currentStep = usePresentationStore((state) => state.currentStep);
  const maxSteps = usePresentationStore((state) => state.maxSteps);

  const currentTitle = STEP_TITLES[currentStep] || `Step ${currentStep}`;

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

