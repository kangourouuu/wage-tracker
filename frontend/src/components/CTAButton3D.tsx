import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CTAButton3DProps {
  onClick: () => void;
  label: string;
  position?: [number, number, number];
}

const CTAButton3D = React.forwardRef<THREE.Group, CTAButton3DProps>(({ onClick, label, position = [0, 0, 0] }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Enhanced floating animation
      const floatIntensity = hovered ? 0.08 : 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * floatIntensity;
      
      // Smooth lift on hover with more dramatic effect
      const targetZ = hovered ? 0.3 : (clicked ? -0.1 : 0);
      meshRef.current.position.z = position[2] + THREE.MathUtils.lerp(meshRef.current.position.z - position[2], targetZ, 0.15);
      
      // Subtle rotation on hover
      if (hovered) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      }
      
      // Reset click animation
      if (clicked) {
        setTimeout(() => setClicked(false), 200);
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    onClick();
  };

  return (
    <group ref={ref} position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <boxGeometry args={[2.5, 0.8, 0.2]} />
        <meshPhysicalMaterial
          color={hovered ? '#FF8C00' : '#FFD700'}
          roughness={hovered ? 0.1 : 0.2}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={hovered ? 2 : 1.5}
          emissive={hovered ? '#FF8C00' : '#FFD700'}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {label}
        </Text>
      </mesh>
      
      {/* Glow effect on hover */}
      {hovered && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.8}
          distance={3}
          color="#FFD700"
        />
      )}
      
      {/* Hidden DOM button for accessibility */}
      <Html position={[0, 0, 0.1]} center>
        <button
          onClick={handleClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'transparent',
            cursor: 'pointer',
            width: '250px',
            height: '80px',
            position: 'absolute',
            top: '-40px',
            left: '-125px',
            zIndex: 1000,
          }}
          aria-label={label}
        >
          {label}
        </button>
      </Html>
    </group>
  );
});

export default CTAButton3D;
