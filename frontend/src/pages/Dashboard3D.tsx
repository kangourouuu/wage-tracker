import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useAspect } from '@react-three/drei';
import * as THREE from 'three';
import { Dashboard } from './Dashboard';

export function Dashboard3D() {
  const groupRef = useRef<THREE.Group>(null!);
  const size = useAspect(1200, 800);

  useFrame((state) => {
    if (groupRef.current) {
      const x = (state.mouse.x * 0.1);
      const y = (state.mouse.y * 0.1);
      groupRef.current.rotation.set(-y, x, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh scale={size}>
        <planeGeometry />
        <meshPhysicalMaterial
          roughness={0.1}
          transmission={1}
          thickness={10}
          ior={1.1}
          chromaticAberration={0.06}
          color="#a2d2ff"
        />
      </mesh>
      <Html
        transform
        occlude
        position={[0, 0, 0.1]}
        style={{
          width: '1200px',
          height: '800px',
        }}
      >
        <Dashboard />
      </Html>
    </group>
  );
}
