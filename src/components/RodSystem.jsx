import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import usePresentationStore from '../store/usePresentationStore';

function RodSystem() {
  const rodRef = useRef(null);
  const currentStep = usePresentationStore((state) => state.currentStep);

  useFrame(({ clock }) => {
    if (!rodRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    const isMotionActive = currentStep >= 2;

    if (isMotionActive) {
      const period = 3.6;
      const omega = (Math.PI * 2) / period;
      const targetX = Math.sin(t * omega) * 2;
      rodRef.current.position.x = MathUtils.lerp(rodRef.current.position.x, targetX, 0.08);
    } else {
      rodRef.current.position.x = MathUtils.lerp(rodRef.current.position.x, 0, 0.1);
    }

    rodRef.current.position.y = 0.03 + Math.sin(t * 0.8) * 0.04;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.07, 0.12]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.07, 0.12]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.4} />
      </mesh>

      <mesh ref={rodRef} position={[0, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 32]} />
        <meshStandardMaterial color="#aaaaaa" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default RodSystem;

