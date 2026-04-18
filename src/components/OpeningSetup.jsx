import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const START_X = -1.5;
const END_X = 1.5;
const DURATION = 3;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function OpeningSetup({ step }) {
  const rodRef = useRef(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (step === 0) {
      startedRef.current = false;
      completedRef.current = false;
      elapsedRef.current = 0;
      if (rodRef.current) {
        rodRef.current.position.x = 0;
      }
    }
  }, [step]);

  useFrame((_, delta) => {
    if (!rodRef.current) {
      return;
    }

    if (step !== 1) {
      return;
    }

    if (!startedRef.current) {
      startedRef.current = true;
      completedRef.current = false;
      elapsedRef.current = 0;
      rodRef.current.position.x = START_X;
    }

    if (completedRef.current) {
      rodRef.current.position.x = END_X;
      return;
    }

    elapsedRef.current += delta;
    const progress = Math.min(elapsedRef.current / DURATION, 1);
    const eased = easeInOut(progress);
    rodRef.current.position.x = START_X + (END_X - START_X) * eased;

    if (progress >= 1) {
      completedRef.current = true;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.07, 0.12]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.72} roughness={0.38} />
      </mesh>

      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.07, 0.12]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.72} roughness={0.38} />
      </mesh>

      <mesh ref={rodRef} position={[0, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 32]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.86} roughness={0.28} />
      </mesh>
    </group>
  );
}

export default OpeningSetup;

