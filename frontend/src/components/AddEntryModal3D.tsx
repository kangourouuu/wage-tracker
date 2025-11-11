import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import AddEntryModal from './AddEntryModal'; // Import the original AddEntryModal

interface AddEntryModal3DProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const AddEntryModal3D: React.FC<AddEntryModal3DProps> = ({ isOpen, onClose, selectedDate }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      // Slight lift on hover
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, hovered ? 0.3 : 0, 0.1);
    }
  });

  if (!isOpen) return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]} // Center the modal in 3D space
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[5, 5, 0.1]} /> {/* Adjust size as needed for the modal */}
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
      <Html center transform rotation={[0, 0, 0]} position={[0, 0, 0.06]} scale={0.01}> {/* Adjust scale to fit */}
        <div style={{ width: '500px', height: 'auto', background: 'transparent', padding: '20px' }}>
          <AddEntryModal isOpen={isOpen} onClose={onClose} selectedDate={selectedDate} />
        </div>
      </Html>
    </mesh>
  );
};

export default AddEntryModal3D;
