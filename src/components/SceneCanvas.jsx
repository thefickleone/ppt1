import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Vector3 } from 'three';
import RodSystem from './RodSystem';
import useStepCameraTarget from '../hooks/useStepCameraTarget';

function CameraRig() {
  const { camera } = useThree();
  const cameraTarget = useStepCameraTarget();

  const targetPosition = useMemo(() => new Vector3(...cameraTarget.position), [cameraTarget]);
  const targetLookAt = useMemo(() => new Vector3(...cameraTarget.lookAt), [cameraTarget]);
  const currentLookAt = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    camera.position.set(0, 0.1, 4.2);
    camera.lookAt(0, 0.03, 0);
  }, [camera]);

  useFrame((_, delta) => {
    const smoothing = 1 - Math.exp(-4 * delta);
    camera.position.lerp(targetPosition, smoothing);
    currentLookAt.current.lerp(targetLookAt, smoothing);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

function SceneCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas shadows camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0.1, 4.2] }} dpr={[1, 1.5]}>
        <color attach="background" args={['#0b0f14']} />
        <fog attach="fog" args={['#0b0f14', 4, 10]} />

        <ambientLight intensity={0.08} />
        <directionalLight
          castShadow
          position={[2.5, 3, 2]}
          intensity={0.75}
          color="#c7d5ea"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0002}
        />
        <Environment preset="studio" intensity={0.35} />

        <RodSystem />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0f1400] to-[#070a10]/70" />
    </div>
  );
}

export default SceneCanvas;

