import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface SummaryCard3DProps {
  title: string;
  value: string;
  position: [number, number, number];
  color: string;
}

const SummaryCard3D: React.FC<SummaryCard3DProps> = ({ title, value, position, color }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[4, 2, 0.2]} />
      <meshPhysicalMaterial
        color={color} // Base color for the glass, can be tinted
        transparent
        opacity={0.1}
        roughness={0.1}
        metalness={0.9}
        transmission={0.9} // For refraction
        clearcoat={1}
        clearcoatRoughness={0.25}
        envMapIntensity={1}
      />
      <Text position={[0, 0.5, 0.15]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {title}
      </Text>
      <Text position={[0, -0.2, 0.15]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
        {value}
      </Text>
    </mesh>
  );
};

export default SummaryCard3D;
