import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils } from 'three';
import usePresentationStore from '../store/usePresentationStore';

function buildFieldData() {
  const xCount = 21;
  const yCount = 9;
  const zCount = 5;
  const count = xCount * yCount * zCount;

  const basePositions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const amplitudes = new Float32Array(count);

  let i = 0;
  for (let xi = 0; xi < xCount; xi += 1) {
    for (let yi = 0; yi < yCount; yi += 1) {
      for (let zi = 0; zi < zCount; zi += 1) {
        const x = MathUtils.lerp(-2.4, 2.4, xi / (xCount - 1));
        const y = MathUtils.lerp(-0.7, 0.7, yi / (yCount - 1));
        const z = MathUtils.lerp(-0.8, 0.8, zi / (zCount - 1));

        const idx = i * 3;
        basePositions[idx] = x;
        basePositions[idx + 1] = y;
        basePositions[idx + 2] = z;

        phases[i] = Math.random() * Math.PI * 2;
        amplitudes[i] = 0.02 + Math.random() * 0.03;
        i += 1;
      }
    }
  }

  return { count, basePositions, phases, amplitudes };
}

function MagneticField() {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const currentStep = usePresentationStore((state) => state.currentStep);

  const fieldData = useMemo(() => buildFieldData(), []);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || !materialRef.current) {
      return;
    }

    const isActive = currentStep >= 1;
    const targetOpacity = isActive ? 0.24 : 0;
    materialRef.current.opacity = MathUtils.damp(materialRef.current.opacity, targetOpacity, 3.5, delta);

    if (groupRef.current) {
      groupRef.current.visible = materialRef.current.opacity > 0.005;
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.06;
    }

    if (!groupRef.current?.visible) {
      return;
    }

    const t = clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < fieldData.count; i += 1) {
      const idx = i * 3;
      const baseX = fieldData.basePositions[idx];
      const baseY = fieldData.basePositions[idx + 1];
      const baseZ = fieldData.basePositions[idx + 2];
      const phase = fieldData.phases[i];
      const amp = fieldData.amplitudes[i];

      const swayY = Math.sin(t * 0.65 + phase + baseX * 0.8) * amp;
      const swayX = Math.cos(t * 0.42 + phase * 0.8 + baseZ * 1.2) * amp * 0.45;
      const swayZ = Math.sin(t * 0.5 + phase + baseY * 0.6) * amp * 0.3;

      positions[idx] = baseX + swayX;
      positions[idx + 1] = baseY + swayY;
      positions[idx + 2] = baseZ + swayZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.35]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={fieldData.basePositions}
            count={fieldData.count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color="#00bfff"
          size={0.03}
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default MagneticField;

