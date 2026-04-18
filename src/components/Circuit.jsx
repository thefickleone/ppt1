import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import usePresentationStore from '../store/usePresentationStore';

const RAIL_LENGTH = 5;
const RAIL_OFFSET_Y = 0.2;
const LOOP_HEIGHT = 0.9;
const LOOP_BACK_Z = -0.08;

function Circuit() {
  const leftRef = useRef(null);
  const topRef = useRef(null);
  const rightRef = useRef(null);
  const progressRef = useRef(0);
  const currentStep = usePresentationStore((state) => state.currentStep);

  useFrame((_, delta) => {
    if (!leftRef.current || !topRef.current || !rightRef.current) {
      return;
    }

    const isActive = currentStep >= 6;
    progressRef.current = MathUtils.damp(progressRef.current, isActive ? 1 : 0, 3.5, delta);
    const progress = progressRef.current;

    const leftProgress = MathUtils.clamp(progress * 1.4, 0, 1);
    const topProgress = MathUtils.clamp((progress - 0.28) * 1.4, 0, 1);
    const rightProgress = MathUtils.clamp((progress - 0.58) * 1.4, 0, 1);

    leftRef.current.scale.y = leftProgress;
    leftRef.current.position.y = RAIL_OFFSET_Y + (LOOP_HEIGHT * leftProgress) / 2;

    topRef.current.scale.x = topProgress;
    topRef.current.position.x = (-RAIL_LENGTH / 2) + (RAIL_LENGTH * topProgress) / 2;

    rightRef.current.scale.y = rightProgress;
    rightRef.current.position.y = RAIL_OFFSET_Y + (LOOP_HEIGHT * rightProgress) / 2;

    const isVisible = progress > 0.01;
    leftRef.current.visible = isVisible;
    topRef.current.visible = isVisible;
    rightRef.current.visible = isVisible;
  });

  return (
    <group position={[0, 0, LOOP_BACK_Z]}>
      <mesh ref={leftRef} position={[-RAIL_LENGTH / 2, RAIL_OFFSET_Y, 0]}>
        <boxGeometry args={[0.06, LOOP_HEIGHT, 0.06]} />
        <meshStandardMaterial color="#3b3b3b" metalness={0.75} roughness={0.4} />
      </mesh>

      <mesh ref={topRef} position={[0, RAIL_OFFSET_Y + LOOP_HEIGHT, 0]}>
        <boxGeometry args={[RAIL_LENGTH, 0.06, 0.06]} />
        <meshStandardMaterial color="#3b3b3b" metalness={0.75} roughness={0.4} />
      </mesh>

      <mesh ref={rightRef} position={[RAIL_LENGTH / 2, RAIL_OFFSET_Y, 0]}>
        <boxGeometry args={[0.06, LOOP_HEIGHT, 0.06]} />
        <meshStandardMaterial color="#3b3b3b" metalness={0.75} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default Circuit;

