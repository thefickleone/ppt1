import { useMemo } from 'react';
import usePresentationStore from '../store/usePresentationStore';

const CAMERA_STEPS = {
  0: {
    position: [0, 0, 5],
    lookAt: [0, 0, 0],
  },
  1: {
    position: [0, 0, 4],
    lookAt: [0, 0, 0],
  },
  2: {
    position: [1, 0.5, 4],
    lookAt: [0, 0, 0],
  },
  3: {
    position: [0, 0, 3],
    lookAt: [0, 0, 0],
  },
};

function useStepCameraTarget() {
  const currentStep = usePresentationStore((state) => state.currentStep);

  return useMemo(() => {
    const step = Math.max(0, Math.min(currentStep, 3));
    return CAMERA_STEPS[step];
  }, [currentStep]);
}

export default useStepCameraTarget;

