import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import useStepCameraTarget from '../hooks/useStepCameraTarget';

function CameraRig() {
  const { camera } = useThree();
  const cameraTarget = useStepCameraTarget();

  const targetPosition = useMemo(() => new Vector3(...cameraTarget.position), [cameraTarget]);
  const targetLookAt = useMemo(() => new Vector3(...cameraTarget.lookAt), [cameraTarget]);
  const currentLookAt = useRef(new Vector3(0, 0, 0));

  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
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
      <Canvas camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 5] }} dpr={[1, 1.5]}>
        <color attach="background" args={['#0b0f14']} />
        <fog attach="fog" args={['#0b0f14', 5, 12]} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 4, 2]} intensity={0.55} color="#b8c7dc" />

        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0f1400] to-[#070a10]/70" />
    </div>
  );
}

export default SceneCanvas;

