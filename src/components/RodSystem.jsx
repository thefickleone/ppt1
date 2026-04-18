import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Object3D } from 'three';
import usePresentationStore from '../store/usePresentationStore';

const ROD_LENGTH = 2;
const ROD_RADIUS = 0.05;
const ELECTRON_COUNT = 96;

function buildElectrons() {
  const seeds = new Float32Array(ELECTRON_COUNT);
  const driftSpeeds = new Float32Array(ELECTRON_COUNT);
  const radialAngles = new Float32Array(ELECTRON_COUNT);
  const radialDistances = new Float32Array(ELECTRON_COUNT);
  const phases = new Float32Array(ELECTRON_COUNT);

  for (let i = 0; i < ELECTRON_COUNT; i += 1) {
    seeds[i] = Math.random();
    driftSpeeds[i] = 0.045 + Math.random() * 0.03;
    radialAngles[i] = Math.random() * Math.PI * 2;
    radialDistances[i] = Math.random() * (ROD_RADIUS * 0.62);
    phases[i] = Math.random() * Math.PI * 2;
  }

  return { seeds, driftSpeeds, radialAngles, radialDistances, phases };
}

function RodSystem() {
  const rodGroupRef = useRef(null);
  const rodMaterialRef = useRef(null);
  const electronMeshRef = useRef(null);
  const electronMaterialRef = useRef(null);
  const negativeGlowRef = useRef(null);
  const positiveGlowRef = useRef(null);
  const lenzBlobRef = useRef(null);
  const lenzArrowRef = useRef(null);
  const chargeMixRef = useRef(0);
  const lenzMixRef = useRef(0);
  const prevXRef = useRef(0);

  const electronData = useMemo(() => buildElectrons(), []);
  const electronTemp = useMemo(() => new Object3D(), []);

  const currentStep = usePresentationStore((state) => state.currentStep);

  useFrame(({ clock }, delta) => {
    if (!rodGroupRef.current || !rodMaterialRef.current || !electronMeshRef.current || !electronMaterialRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    const isRodMotionActive = currentStep >= 2;
    const isChargeActive = currentStep >= 3;
    const isLenzActive = currentStep >= 8;

    chargeMixRef.current = MathUtils.damp(chargeMixRef.current, isChargeActive ? 1 : 0, 3.2, delta);
    const chargeMix = chargeMixRef.current;
    lenzMixRef.current = MathUtils.damp(lenzMixRef.current, isLenzActive ? 1 : 0, 3.4, delta);
    const lenzMix = lenzMixRef.current;

    if (isRodMotionActive) {
      const period = 3.6;
      const omega = (Math.PI * 2) / period;
      const baseTargetX = Math.sin(t * omega) * 2;
      const targetX = MathUtils.lerp(baseTargetX, baseTargetX * 0.86, lenzMix);
      const lerpStrength = MathUtils.lerp(0.08, 0.055, lenzMix);
      rodGroupRef.current.position.x = MathUtils.lerp(rodGroupRef.current.position.x, targetX, lerpStrength);
    } else {
      rodGroupRef.current.position.x = MathUtils.lerp(rodGroupRef.current.position.x, 0, 0.1);
    }

    rodGroupRef.current.position.y = 0.03 + Math.sin(t * 0.8) * 0.04;

    const currentX = rodGroupRef.current.position.x;
    const velocity = (currentX - prevXRef.current) / Math.max(delta, 0.0001);
    const direction = velocity === 0 ? 0 : Math.sign(velocity);
    prevXRef.current = currentX;

    if (lenzBlobRef.current) {
      const speed = Math.min(Math.abs(velocity) * 0.05, 0.6);
      const blobScale = MathUtils.lerp(0.25, 0.45, speed) * (0.4 + lenzMix * 0.6);
      lenzBlobRef.current.position.x = currentX + direction * (0.18 + speed * 0.1);
      lenzBlobRef.current.scale.set(blobScale, blobScale * 0.7, blobScale);
      lenzBlobRef.current.visible = lenzMix > 0.01 && direction !== 0;
      lenzBlobRef.current.material.opacity = 0.08 + lenzMix * 0.22 + speed * 0.12;
    }

    if (lenzArrowRef.current) {
      const arrowOpacity = 0.05 + lenzMix * 0.18;
      lenzArrowRef.current.visible = lenzMix > 0.01 && direction !== 0;
      lenzArrowRef.current.position.x = currentX - direction * 0.18;
      lenzArrowRef.current.rotation.z = direction > 0 ? Math.PI : 0;
      lenzArrowRef.current.material.opacity = arrowOpacity;
    }

    rodMaterialRef.current.opacity = MathUtils.lerp(1, 0.62, chargeMix);
    rodMaterialRef.current.metalness = MathUtils.lerp(1, 0.65, chargeMix);
    rodMaterialRef.current.roughness = MathUtils.lerp(0.2, 0.16, chargeMix);
    rodMaterialRef.current.transmission = MathUtils.lerp(0, 0.48, chargeMix);
    rodMaterialRef.current.thickness = MathUtils.lerp(0, 0.55, chargeMix);

    electronMaterialRef.current.opacity = MathUtils.lerp(0, 0.9, chargeMix);
    electronMeshRef.current.visible = electronMaterialRef.current.opacity > 0.01;

    if (negativeGlowRef.current && positiveGlowRef.current) {
      const pulse = 0.86 + Math.sin(t * 1.7) * 0.14;
      negativeGlowRef.current.material.opacity = 0.05 + chargeMix * 0.2 * pulse;
      positiveGlowRef.current.material.opacity = 0.03 + chargeMix * 0.12 * pulse;
      negativeGlowRef.current.material.emissiveIntensity = 0.2 + chargeMix * 1.4 * pulse;
      positiveGlowRef.current.material.emissiveIntensity = 0.15 + chargeMix * 0.8 * pulse;
      negativeGlowRef.current.visible = chargeMix > 0.01;
      positiveGlowRef.current.visible = chargeMix > 0.01;
    }

    if (electronMeshRef.current.visible) {
      const expo = MathUtils.lerp(1, 0.45, chargeMix);

      for (let i = 0; i < ELECTRON_COUNT; i += 1) {
        const p = (electronData.seeds[i] + t * electronData.driftSpeeds[i]) % 1;
        const drifted = Math.pow(p, expo);
        const x = MathUtils.lerp(-ROD_LENGTH * 0.46, ROD_LENGTH * 0.46, drifted);

        const angle = electronData.radialAngles[i] + Math.sin(t * 0.45 + electronData.phases[i]) * 0.12;
        const radius = electronData.radialDistances[i] * (0.88 + Math.sin(t * 0.5 + electronData.phases[i]) * 0.12);
        const y = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        electronTemp.position.set(x, y, z);
        electronTemp.scale.setScalar(1);
        electronTemp.updateMatrix();
        electronMeshRef.current.setMatrixAt(i, electronTemp.matrix);
      }

      electronMeshRef.current.instanceMatrix.needsUpdate = true;
    }
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

      <group ref={rodGroupRef} position={[0, 0.03, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_LENGTH, 32]} />
          <meshPhysicalMaterial
            ref={rodMaterialRef}
            color="#aaaaaa"
            metalness={1}
            roughness={0.2}
            transparent
            opacity={1}
            transmission={0}
            thickness={0}
            ior={1.2}
            clearcoat={0.6}
            clearcoatRoughness={0.22}
          />
        </mesh>

        <instancedMesh ref={electronMeshRef} args={[null, null, ELECTRON_COUNT]}>
          <sphereGeometry args={[0.024, 8, 8]} />
          <meshStandardMaterial
            ref={electronMaterialRef}
            color="#40c4ff"
            emissive="#00bfff"
            emissiveIntensity={1.35}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </instancedMesh>

        <mesh ref={positiveGlowRef} position={[-ROD_LENGTH * 0.52, 0, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color="#ffd7a3"
            emissive="#ffd7a3"
            emissiveIntensity={0.25}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={negativeGlowRef} position={[ROD_LENGTH * 0.52, 0, 0]}>
          <sphereGeometry args={[0.095, 12, 12]} />
          <meshStandardMaterial
            color="#62d4ff"
            emissive="#00bfff"
            emissiveIntensity={0.3}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={lenzBlobRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color="#ff8a5b"
            emissive="#ff5f3f"
            emissiveIntensity={0.9}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={lenzArrowRef} position={[0, -0.04, 0]}>
          <coneGeometry args={[0.03, 0.12, 10]} />
          <meshStandardMaterial
            color="#ff9a6a"
            emissive="#ff6d4f"
            emissiveIntensity={0.7}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

export default RodSystem;

