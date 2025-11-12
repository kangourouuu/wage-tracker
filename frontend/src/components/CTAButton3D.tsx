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

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      // Lift on hover
      meshRef.current.position.z = position[2] + THREE.MathUtils.lerp(meshRef.current.position.z, hovered ? 0.2 : 0, 0.1);
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[2.5, 0.8, 0.2]} /> {/* Extruded button mesh */}
        <meshPhysicalMaterial
          color={hovered ? '#FFA500' : '#FFD700'} // Gold gradient effect
          roughness={0.2} // Reduced roughness for more shine
          metalness={0.9} // Increased metalness
          clearcoat={1}
          clearcoatRoughness={0.1} // Reduced clearcoat roughness for more shine
          envMapIntensity={1.5} // Increased environment map intensity for more reflection
        />
        <Text
          position={[0, 0, 0.11]} // Slightly in front of the button face
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </mesh>
      {/* Hidden DOM button for accessibility */}
      <Html position={[0, 0, 0.1]} center>
        <button
          onClick={onClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'transparent',
            cursor: 'pointer',
            width: '250px', // Match 3D button size
            height: '80px', // Match 3D button size
            position: 'absolute',
            top: '-40px', // Adjust to center
            left: '-125px', // Adjust to center
            zIndex: 1000, // Ensure it's clickable
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
