import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePresentationStore from '../store/usePresentationStore';
import infoCards from '../data/infoCards';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  pulse: { opacity: 1, scale: [1, 1.02, 1], y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 10 },
};

function InfoCard() {
  const currentStep = usePresentationStore((state) => state.currentStep);
  const card = infoCards[currentStep];
  const isCurrentActive = currentStep >= 7;
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setExpanded(false);
  }, [currentStep]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    window.addEventListener('pointerdown', handleClickOutside);

    return () => {
      window.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  return (
    <AnimatePresence>
      {card ? (
        <motion.aside
          key={currentStep}
          ref={containerRef}
          initial="hidden"
          animate={isCurrentActive ? 'pulse' : 'visible'}
          exit="exit"
          variants={cardVariants}
          transition={
            isCurrentActive
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.35, ease: 'easeOut' }
          }
          className={`pointer-events-auto w-[min(90vw,360px)] rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
            expanded ? 'shadow-[0_28px_80px_rgba(0,0,0,0.45)]' : ''
          }`}
          style={
            isCurrentActive
              ? {
                  borderColor: 'rgba(125, 211, 252, 0.35)',
                  boxShadow: '0 24px 70px rgba(0,0,0,0.4), 0 0 24px rgba(0,191,255,0.12)',
                }
              : undefined
          }
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Step {currentStep}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-300">{card.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:bg-white/15"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {card.bullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  {card.details.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export default InfoCard;

