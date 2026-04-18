import { useEffect } from 'react';
import FormulaOverlay from './FormulaOverlay';
import InfoCard from './InfoCard';
import SceneCanvas from './SceneCanvas';
import usePresentationStore from '../store/usePresentationStore';

function Layout({ children }) {
  const nextStep = usePresentationStore((state) => state.nextStep);
  const prevStep = usePresentationStore((state) => state.prevStep);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        nextStep();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextStep, prevStep]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-canvas text-gray-100">
      <SceneCanvas />
      <div className="relative z-10 grid h-full w-full place-items-center px-8">{children}</div>
      <FormulaOverlay />
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-end px-6">
        <InfoCard />
      </div>
    </div>
  );
}

export default Layout;

