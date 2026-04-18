import { useMemo } from 'react';
import usePresentationStore from '../store/usePresentationStore';

const CAMERA_STEPS = {
  0: {
    position: [0, 0.08, 4.2],
    lookAt: [0, 0.03, 0],
  },
  1: {
    position: [0, 0.08, 3.7],
    lookAt: [0, 0.03, 0],
  },
  2: {
    position: [0.9, 0.45, 3.9],
    lookAt: [0, 0.03, 0],
  },
  3: {
    position: [0, 0.08, 3.2],
    lookAt: [0, 0.03, 0],
  },
  4: {
    position: [0.45, 0.22, 3.35],
    lookAt: [0, 0.03, 0],
  },
  5: {
    position: [0.15, 0.14, 3.1],
    lookAt: [0, 0.03, 0],
  },
};

function useStepCameraTarget() {
  const currentStep = usePresentationStore((state) => state.currentStep);

  return useMemo(() => {
    const step = Math.max(0, Math.min(currentStep, 5));
    return CAMERA_STEPS[step];
  }, [currentStep]);
}

export default useStepCameraTarget;

