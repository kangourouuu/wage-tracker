import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import WorkEntryList from './WorkEntryList';
import type { WorkEntry } from '../types/work-entry';


interface WorkEntryList3DProps {
  workEntries: WorkEntry[];
  position: number[];
}

const WorkEntryList3D: React.FC<WorkEntryList3DProps> = ({ workEntries }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      // Slight lift on hover
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, hovered ? 0.2 : 0, 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -4, 0]} // Position the work entry list panel
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[7, 4, 0.1]} /> {/* Adjust size as needed */}
      <meshPhysicalMaterial
        color="#ffffff" // Base color for the glass
        transparent
        opacity={0.1}
        roughness={0.1}
        metalness={0.9}
        transmission={0.9} // For refraction
        clearcoat={1}
        clearcoatRoughness={0.25}
        envMapIntensity={1}
      />
      <Html transform rotation={[0, 0, 0]} position={[0, 0, 0.06]} scale={0.01}> {/* Adjust scale to fit */}
        <div style={{ width: '700px', height: '400px', overflow: 'auto', background: 'transparent', padding: '20px' }}>
          <WorkEntryList workEntries={workEntries} />
        </div>
      </Html>
    </mesh>
  );
};

export default WorkEntryList3D;
