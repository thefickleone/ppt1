import { Canvas } from '@react-three/fiber';
import Apparatus from './Apparatus';
import usePresentationStore from '../store/usePresentationStore';

function SceneCanvas() {
  const currentStep = usePresentationStore((state) => state.currentStep);

  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        camera={{ fov: 43, near: 0.1, far: 100, position: [1, 0.65, 4.6] }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.03, 0);
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 4, 10]} />
        <ambientLight intensity={0.12} />
        <directionalLight position={[2, 2.6, 2.4]} intensity={0.5} color="#d2d7de" />
        <Apparatus step={currentStep} />
      </Canvas>
    </div>
  );
}

export default SceneCanvas;

