import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function Model() {
  const gltf = useGLTF('/lod.glb');
  const modelRef = useRef<any>(null);

  // Add animation and interactivity
  useFrame((state) => {
    if (modelRef.current) {
      // Gentle floating animation
      modelRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Subtle rotation for dynamic effect
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={0.01}
      position={[0, -1, 0]}
      castShadow
      receiveShadow
    />
  );
}
