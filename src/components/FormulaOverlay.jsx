import { useEffect, useState } from 'react';
import usePresentationStore from '../store/usePresentationStore';

function FormulaOverlay() {
  const currentStep = usePresentationStore((state) => state.currentStep);

  const [highlightStage, setHighlightStage] = useState(0);
  const [formulaVisible, setFormulaVisible] = useState(false);

  useEffect(() => {
    if (currentStep < 5) {
      setHighlightStage(0);
      setFormulaVisible(false);
      return undefined;
    }

    setHighlightStage(0);
    setFormulaVisible(false);

    const timers = [
      setTimeout(() => setHighlightStage(1), 150),
      setTimeout(() => setHighlightStage(2), 900),
      setTimeout(() => setHighlightStage(3), 1650),
      setTimeout(() => setFormulaVisible(true), 2450),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [currentStep]);

  if (currentStep < 5) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        className="-mt-36 rounded-2xl border border-cyan-200/10 bg-white/5 px-8 py-6 text-center backdrop-blur-sm transition-opacity duration-700"
        style={{ opacity: 1 }}
      >
        <div className="mb-3 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-cyan-100/75">
          <span className={highlightStage >= 1 ? 'text-cyan-200 drop-shadow-[0_0_8px_rgba(0,191,255,0.45)]' : 'text-gray-400'}>ℓ</span>
          <span className={highlightStage >= 2 ? 'text-cyan-200 drop-shadow-[0_0_8px_rgba(0,191,255,0.45)]' : 'text-gray-400'}>
            v -&gt;
          </span>
          <span className={highlightStage >= 3 ? 'text-cyan-200 drop-shadow-[0_0_10px_rgba(0,191,255,0.55)]' : 'text-gray-400'}>
            B
          </span>
        </div>

        <p className={`text-sm text-gray-300 transition-opacity duration-500 ${formulaVisible ? 'opacity-0' : 'opacity-100'}`}>
          rod length, motion, and magnetic field align
        </p>

        <p
          className={`mt-2 text-4xl font-semibold tracking-wide text-cyan-100 drop-shadow-[0_0_16px_rgba(0,191,255,0.25)] transition-opacity duration-700 md:text-5xl ${formulaVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          ε = B ℓ v
        </p>
      </div>
    </div>
  );
}

export default FormulaOverlay;

