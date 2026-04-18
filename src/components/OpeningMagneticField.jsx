import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

const LINE_COUNT = 6;
const SAMPLES_PER_LINE = 24;

function buildLineVertices(y, z) {
  const vertices = new Float32Array(SAMPLES_PER_LINE * 3);

  for (let i = 0; i < SAMPLES_PER_LINE; i += 1) {
    const t = i / (SAMPLES_PER_LINE - 1);
    const x = MathUtils.lerp(-2.2, 2.2, t);
    const idx = i * 3;
    vertices[idx] = x;
    vertices[idx + 1] = y;
    vertices[idx + 2] = z;
  }

  return vertices;
}

function OpeningMagneticField({ step }) {
  const materialsRef = useRef([]);
  const opacityRef = useRef(0);

  const lineData = useMemo(() => {
    return Array.from({ length: LINE_COUNT }, (_, index) => {
      const ratio = LINE_COUNT === 1 ? 0 : index / (LINE_COUNT - 1);
      const y = MathUtils.lerp(-0.55, 0.55, ratio);
      const z = MathUtils.lerp(-0.14, 0.14, ratio);
      return buildLineVertices(y, z);
    });
  }, []);

  useFrame((_, delta) => {
    const targetOpacity = step === 2 ? 0.22 : 0;
    opacityRef.current = MathUtils.damp(opacityRef.current, targetOpacity, 2.2, delta);

    for (let i = 0; i < materialsRef.current.length; i += 1) {
      const material = materialsRef.current[i];
      if (!material) {
        continue;
      }

      material.opacity = opacityRef.current;
    }
  });

  return (
    <group>
      {lineData.map((vertices, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={vertices} count={SAMPLES_PER_LINE} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(material) => {
              materialsRef.current[index] = material;
            }}
            color="#3b82f6"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}

export default OpeningMagneticField;

