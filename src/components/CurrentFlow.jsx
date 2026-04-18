import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Object3D, Vector3 } from 'three';
import usePresentationStore from '../store/usePresentationStore';

const RAIL_LENGTH = 5;
const RAIL_OFFSET_Y = 0.2;
const LOOP_HEIGHT = 0.9;
const LOOP_BACK_Z = -0.08;
const PARTICLE_COUNT = 42;

function buildPath() {
  const leftX = -RAIL_LENGTH / 2;
  const rightX = RAIL_LENGTH / 2;
  const topY = RAIL_OFFSET_Y + LOOP_HEIGHT;
  const bottomY = RAIL_OFFSET_Y;
  const z = LOOP_BACK_Z + 0.02;

  return [
    new Vector3(leftX, bottomY, z),
    new Vector3(rightX, bottomY, z),
    new Vector3(rightX, topY, z),
    new Vector3(leftX, topY, z),
  ];
}

function CurrentFlow() {
  const currentStep = usePresentationStore((state) => state.currentStep);
  const flowRef = useRef(null);
  const materialRef = useRef(null);
  const progressRef = useRef(0);

  const tempObject = useMemo(() => new Object3D(), []);
  const pathPoints = useMemo(() => buildPath(), []);

  useFrame(({ clock }, delta) => {
    if (!flowRef.current || !materialRef.current) {
      return;
    }

    const isActive = currentStep >= 7;
    progressRef.current = MathUtils.damp(progressRef.current, isActive ? 1 : 0, 4.2, delta);
    const visibility = progressRef.current;

    materialRef.current.opacity = MathUtils.lerp(0, 0.8, visibility);
    flowRef.current.visible = visibility > 0.01;

    if (!flowRef.current.visible) {
      return;
    }

    const t = clock.elapsedTime * 0.18;
    const spacing = 1 / PARTICLE_COUNT;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const offset = (t + i * spacing) % 1;
      const progress = offset < 0 ? offset + 1 : offset;

      const perimeter = (RAIL_LENGTH * 2) + (LOOP_HEIGHT * 2);
      const travel = progress * perimeter;

      let x = pathPoints[0].x;
      let y = pathPoints[0].y;
      const z = pathPoints[0].z;

      if (travel <= RAIL_LENGTH) {
        x = MathUtils.lerp(pathPoints[0].x, pathPoints[1].x, travel / RAIL_LENGTH);
        y = pathPoints[0].y;
      } else if (travel <= RAIL_LENGTH + LOOP_HEIGHT) {
        x = pathPoints[1].x;
        y = MathUtils.lerp(pathPoints[1].y, pathPoints[2].y, (travel - RAIL_LENGTH) / LOOP_HEIGHT);
      } else if (travel <= RAIL_LENGTH * 2 + LOOP_HEIGHT) {
        x = MathUtils.lerp(pathPoints[2].x, pathPoints[3].x, (travel - RAIL_LENGTH - LOOP_HEIGHT) / RAIL_LENGTH);
        y = pathPoints[2].y;
      } else {
        x = pathPoints[3].x;
        y = MathUtils.lerp(pathPoints[3].y, pathPoints[0].y, (travel - RAIL_LENGTH * 2 - LOOP_HEIGHT) / LOOP_HEIGHT);
      }

      const phase = i * 0.4 + t * 6;
      const pulse = 0.9 + Math.sin(phase) * 0.1;

      tempObject.position.set(x, y, z);
      tempObject.scale.setScalar(pulse);
      tempObject.updateMatrix();
      flowRef.current.setMatrixAt(i, tempObject.matrix);
    }

    flowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={flowRef} args={[null, null, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.03, 10, 10]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#53d3ff"
        emissive="#00bfff"
        emissiveIntensity={1.6}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export default CurrentFlow;

