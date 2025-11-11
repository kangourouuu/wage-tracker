import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface MainDashboardPanel3DProps {
  children: React.ReactNode;
  position?: [number, number, number]; // Changed to tuple
  scale?: number;
}

const MainDashboardPanel3D = React.forwardRef<THREE.Mesh, MainDashboardPanel3DProps>(({ children, position = [0, 0, 0], scale = 1 }, ref) => {
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref && 'current' in ref && ref.current) {
      // Subtle floating animation
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.05 * scale;
      // Hover depth animation (scale 1.02)
      const targetScale = hovered ? 1.02 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      // Subtle rim light glow (handled by material properties and scene lighting)
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[8 * scale, 5 * scale, 0.1 * scale]} /> {/* Adjust size as needed */}
      <meshPhysicalMaterial
        color="#ffffff" // Base color for the glass
        transparent
        opacity={0.2} // Slightly increased opacity for frosted look
        roughness={0.3} // Increased roughness for frosted look
        metalness={0.5} // Adjusted metalness
        transmission={0.9} // For refraction
        thickness={0.5} // Added thickness for better refraction
        clearcoat={1}
        clearcoatRoughness={0.5} // Increased clearcoat roughness for frosted look
        envMapIntensity={1}
      />
      <Html center transform rotation={[0, 0, 0]} position={[0, 0, 0.06 * scale]} scale={0.01 * scale}>
        <div style={{ width: `${800 * scale}px`, height: `${500 * scale}px`, background: 'transparent', padding: '20px' }}>
          {children}
        </div>
      </Html>
    </mesh>
  );
});

export default MainDashboardPanel3D;
