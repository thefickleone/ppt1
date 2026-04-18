import { useEffect } from 'react';
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
      <div className="relative grid h-full w-full place-items-center px-8">{children}</div>
    </div>
  );
}

export default Layout;

