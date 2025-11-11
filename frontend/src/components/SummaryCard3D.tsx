import React, { useRef, useState } from 'react';
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
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Small floating animation (sin-based up/down motion)
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Rise slightly on hover
      meshRef.current.position.z = position[2] + THREE.MathUtils.lerp(meshRef.current.position.z, hovered ? 0.3 : 0, 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[4, 2, 0.2]} />
      <meshPhysicalMaterial
        color={color} // Base color for the glass, can be tinted
        transparent
        opacity={0.2} // Slightly increased opacity
        roughness={0.3} // Increased roughness for frosted look
        metalness={0.5} // Adjusted metalness
        transmission={0.9} // For refraction
        thickness={0.5} // Added thickness for better refraction
        clearcoat={1}
        clearcoatRoughness={0.5} // Increased clearcoat roughness
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
