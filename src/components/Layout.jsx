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
    <div className="min-h-screen bg-canvas px-4 py-10 text-gray-100 md:py-14">
      <div className="mx-auto w-full max-w-[900px]">{children}</div>
    </div>
  );
}

export default Layout;

