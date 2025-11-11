import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface Coin3DProps {
  position?: [number, number, number];
  scale?: number;
}

const Coin3D: React.FC<Coin3DProps> = ({ position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      // Orbiting animation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1) * 0.1 * scale;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * 0.1 * scale;
    }
  });

  return (
    <Cylinder ref={meshRef} args={[0.5 * scale, 0.5 * scale, 0.1 * scale, 32]} position={position}>
      <meshPhysicalMaterial
        color="#FFD700" // Gold color
        roughness={0.2}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1}
      />
    </Cylinder>
  );
};

export default Coin3D;
