import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils } from 'three';
import usePresentationStore from '../store/usePresentationStore';

const LINE_COUNT = 14;
const SAMPLES_PER_LINE = 36;

function buildFieldSeeds() {
  const yOffsets = new Float32Array(LINE_COUNT);
  const zOffsets = new Float32Array(LINE_COUNT);
  const phases = new Float32Array(LINE_COUNT);

  for (let i = 0; i < LINE_COUNT; i += 1) {
    const t = LINE_COUNT === 1 ? 0 : i / (LINE_COUNT - 1);
    yOffsets[i] = MathUtils.lerp(-0.24, 0.24, t);
    zOffsets[i] = MathUtils.lerp(-0.08, 0.08, Math.sin(t * Math.PI));
    phases[i] = Math.random() * Math.PI * 2;
  }

  return { yOffsets, zOffsets, phases };
}

function ElectricField() {
  const groupRef = useRef(null);
  const linesRef = useRef([]);
  const materialsRef = useRef([]);
  const fadeRef = useRef(0);
  const currentStep = usePresentationStore((state) => state.currentStep);

  const seeds = useMemo(() => buildFieldSeeds(), []);

  useFrame(({ clock }, delta) => {
    const isActive = currentStep >= 4;
    fadeRef.current = MathUtils.damp(fadeRef.current, isActive ? 1 : 0, 3.4, delta);
    const fade = fadeRef.current;

    if (groupRef.current) {
      groupRef.current.visible = fade > 0.005;
    }

    if (!groupRef.current?.visible) {
      return;
    }

    const t = clock.elapsedTime;
    const breathing = 0.9 + Math.sin(t * 0.45) * 0.1;
    const strength = 0.6 + Math.sin(t * 0.18) * 0.15;

    for (let lineIndex = 0; lineIndex < LINE_COUNT; lineIndex += 1) {
      const line = linesRef.current[lineIndex];
      const material = materialsRef.current[lineIndex];
      if (!line || !material) {
        continue;
      }

      const positions = line.geometry.attributes.position.array;
      const yBase = seeds.yOffsets[lineIndex];
      const zBase = seeds.zOffsets[lineIndex];
      const phase = seeds.phases[lineIndex];

      for (let sample = 0; sample < SAMPLES_PER_LINE; sample += 1) {
        const n = sample / (SAMPLES_PER_LINE - 1);
        const x = MathUtils.lerp(-1.02, 1.02, n);
        const envelope = Math.sin(n * Math.PI);
        const flow = t * (0.8 + strength * 0.35) + phase + n * 5.8;

        const y = yBase + Math.sin(flow) * 0.018 * envelope * breathing;
        const z = zBase + Math.cos(flow * 0.92) * 0.022 * envelope;

        const idx = sample * 3;
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;
      }

      line.geometry.attributes.position.needsUpdate = true;

      const centerBias = 1 - Math.abs(lineIndex / (LINE_COUNT - 1) - 0.5) * 1.6;
      material.opacity = (0.06 + centerBias * 0.1) * fade;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.03, -0.08]}>
      {Array.from({ length: LINE_COUNT }, (_, index) => {
        const vertices = new Float32Array(SAMPLES_PER_LINE * 3);

        return (
          <line
            key={index}
            ref={(element) => {
              linesRef.current[index] = element;
            }}
          >
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" array={vertices} count={SAMPLES_PER_LINE} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={(material) => {
                materialsRef.current[index] = material;
              }}
              color="#7ad8ff"
              transparent
              opacity={0}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </line>
        );
      })}
    </group>
  );
}

export default ElectricField;

