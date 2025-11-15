import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface Coin3DProps {
  position?: [number, number, number];
  scale?: number;
}

const Coin3D = React.forwardRef<THREE.Mesh, Coin3DProps>(({ position = [0, 0, 0], scale = 1 }, ref) => {
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref && 'current' in ref && ref.current) {
      // Enhanced orbiting animation with hover effect
      const speed = hovered ? 0.02 : 0.01;
      ref.current.rotation.y += speed;
      ref.current.rotation.x += speed * 0.5;
      
      // Floating animation with more dynamic movement
      const floatIntensity = hovered ? 0.15 : 0.1;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * floatIntensity * scale;
      ref.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * floatIntensity * scale;
      
      // Scale animation on hover
      const targetScale = hovered ? scale * 1.2 : scale;
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group>
      <Cylinder
        ref={ref}
        args={[0.5 * scale, 0.5 * scale, 0.1 * scale, 32]}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color="#FFD700"
          roughness={0.15}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          emissive="#FFD700"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </Cylinder>
      {/* Add a subtle glow effect */}
      <pointLight
        position={position}
        intensity={hovered ? 0.5 : 0.2}
        distance={2}
        color="#FFD700"
      />
    </group>
  );
});

export default Coin3D;
