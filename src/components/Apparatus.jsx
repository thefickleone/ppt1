import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

const ROD_START_X = -1.3;
const ROD_END_X = 1.3;
const ELECTRON_BASE_X = [-0.4, 0, 0.4];
const ELECTRON_SHIFT_X = 0.28;

const FIELD_LINE_COUNT = 5;
const FIELD_SAMPLES = 20;

function buildFieldVertices(y, z) {
  const vertices = new Float32Array(FIELD_SAMPLES * 3);

  for (let i = 0; i < FIELD_SAMPLES; i += 1) {
    const t = i / (FIELD_SAMPLES - 1);
    const x = MathUtils.lerp(-2.1, 2.1, t);
    const idx = i * 3;
    vertices[idx] = x;
    vertices[idx + 1] = y;
    vertices[idx + 2] = z;
  }

  return vertices;
}

function Apparatus({ step }) {
  const rodGroupRef = useRef(null);
  const electronRefs = useRef([]);
  const fieldMaterialRefs = useRef([]);
  const currentMaterialRef = useRef(null);
  const negativeEndRef = useRef(null);
  const positiveEndRef = useRef(null);

  const rodProgressRef = useRef(0);
  const electronProgressRef = useRef(0);
  const fieldMixRef = useRef(0);
  const separationMixRef = useRef(0);
  const currentMixRef = useRef(0);

  const fieldLines = useMemo(
    () =>
      Array.from({ length: FIELD_LINE_COUNT }, (_, index) => {
        const ratio = FIELD_LINE_COUNT === 1 ? 0 : index / (FIELD_LINE_COUNT - 1);
        const y = MathUtils.lerp(-0.5, 0.5, ratio);
        const z = MathUtils.lerp(-0.12, 0.12, ratio);
        return buildFieldVertices(y, z);
      }),
    []
  );

  useFrame((_, delta) => {
    if (!rodGroupRef.current) {
      return;
    }

    const rodTarget = step >= 1 ? 1 : 0;
    const electronTarget = step >= 3 ? 1 : 0;
    const fieldTarget = step >= 2 ? 1 : 0;
    const separationTarget = step >= 4 ? 1 : 0;
    const currentTarget = step >= 5 ? 1 : 0;

    rodProgressRef.current = MathUtils.damp(rodProgressRef.current, rodTarget, 2.4, delta);
    electronProgressRef.current = MathUtils.damp(electronProgressRef.current, electronTarget, 3.2, delta);
    fieldMixRef.current = MathUtils.damp(fieldMixRef.current, fieldTarget, 3.2, delta);
    separationMixRef.current = MathUtils.damp(separationMixRef.current, separationTarget, 3.2, delta);
    currentMixRef.current = MathUtils.damp(currentMixRef.current, currentTarget, 3.2, delta);

    const rodX = MathUtils.lerp(ROD_START_X, ROD_END_X, rodProgressRef.current);
    rodGroupRef.current.position.x = rodX;

    for (let i = 0; i < ELECTRON_BASE_X.length; i += 1) {
      const electron = electronRefs.current[i];
      if (!electron) {
        continue;
      }

      electron.visible = step >= 3;
      electron.position.x = MathUtils.lerp(
        ELECTRON_BASE_X[i],
        ELECTRON_BASE_X[i] + ELECTRON_SHIFT_X,
        electronProgressRef.current
      );
    }

    for (let i = 0; i < fieldMaterialRefs.current.length; i += 1) {
      const material = fieldMaterialRefs.current[i];
      if (material) {
        material.opacity = 0.18 * fieldMixRef.current;
      }
    }

    if (negativeEndRef.current && positiveEndRef.current) {
      negativeEndRef.current.visible = separationMixRef.current > 0.01;
      positiveEndRef.current.visible = separationMixRef.current > 0.01;
      negativeEndRef.current.material.opacity = 0.14 * separationMixRef.current;
      positiveEndRef.current.material.opacity = 0.08 * separationMixRef.current;
    }

    if (currentMaterialRef.current) {
      currentMaterialRef.current.opacity = 0.3 * currentMixRef.current;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.07, 0.12]} />
        <meshStandardMaterial color="#4b4b4b" metalness={0.7} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.07, 0.12]} />
        <meshStandardMaterial color="#4b4b4b" metalness={0.7} roughness={0.4} />
      </mesh>

      {fieldLines.map((vertices, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={vertices} count={FIELD_SAMPLES} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(element) => {
              fieldMaterialRefs.current[index] = element;
            }}
            color="#3b82f6"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </line>
      ))}

      <group ref={rodGroupRef} position={[ROD_START_X, 0.03, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 2, 24]} />
          <meshStandardMaterial color="#999999" metalness={0.84} roughness={0.3} />
        </mesh>

        {ELECTRON_BASE_X.map((x, index) => (
          <mesh
            key={index}
            ref={(element) => {
              electronRefs.current[index] = element;
            }}
            position={[x, 0, 0]}
            visible={false}
          >
            <sphereGeometry args={[0.023, 10, 10]} />
            <meshStandardMaterial
              color="#67d5ff"
              emissive="#3b82f6"
              emissiveIntensity={0.7}
              transparent
              opacity={0.75}
              depthWrite={false}
            />
          </mesh>
        ))}

        <mesh ref={positiveEndRef} position={[-1.02, 0, 0]} visible={false}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#ffb089"
            emissive="#ffb089"
            emissiveIntensity={0.2}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={negativeEndRef} position={[1.02, 0, 0]} visible={false}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial
            color="#87cbff"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group position={[0, 0, -0.08]}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([-2.5, 0.2, 0, 2.5, 0.2, 0, 2.5, 1.1, 0, -2.5, 1.1, 0, -2.5, 0.2, 0])}
              count={5}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial ref={currentMaterialRef} color="#4dc8ff" transparent opacity={0} depthWrite={false} />
        </line>
      </group>
    </group>
  );
}

export default Apparatus;

