import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Removed useThree
import * as THREE from 'three';

const PARTICLE_COUNT = 2000; // Increased particle count

function Swarm() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef({ x: 0, y: 0 });

  // Removed useEffect for mouse movement to stop particle interaction
  // useEffect(() => {
  //   const handleMouseMove = (event: MouseEvent) => {
  //     mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
  //     mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * 100;
      const factor = 10 + Math.random() * 60; // Adjusted factor for less spread
      const speed = 0; // Set speed to 0 to stop movement
      const xFactor = -20 + Math.random() * 40; // Reduced spread
      const yFactor = -20 + Math.random() * 40; // Reduced spread
      const zFactor = -20 + Math.random() * 40; // Reduced spread
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  useFrame((_state) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      let { t, factor, xFactor, yFactor, zFactor } = particle;
      // t = particle.t += speed / 2; // Removed movement
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      // const s = Math.cos(t); // Removed dynamic scaling

      const baseX = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
      const baseY = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
      const baseZ = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

      // Apply mouse interaction
      const mouseInfluence = 1.5; // Increased mouse influence for stronger repulsion
      const mouseRadius = 15; // Adjusted mouse radius

      const distanceX = baseX - mouse.current.x * mouseRadius;
      const distanceY = baseY - mouse.current.y * mouseRadius;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      let repulsionX = 0;
      let repulsionY = 0;

      if (distance < mouseRadius) {
        const repulsionForce = (1 - distance / mouseRadius) * mouseInfluence;
        repulsionX = (distanceX / distance) * repulsionForce;
        repulsionY = (distanceY / distance) * repulsionForce;
      }

      dummy.position.set(
        baseX + repulsionX,
        baseY + repulsionY,
        baseZ
      );

      dummy.scale.setScalar(0.015); // Fixed smaller scale for particles
      // dummy.rotation.set(s * 5, s * 5, s * 5); // Removed rotation
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.015, 16, 16]} /> {/* Even smaller sphere geometry */}
      <meshStandardMaterial color="#90EE90" transparent opacity={0.7} roughness={0.2} metalness={0.1} /> {/* Light green, transparent, glassy material */}
    </instancedMesh>
  );
}

function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#98FB98" intensity={1.5} /> {/* Pale green point light */}
      <pointLight position={[0, 10, 0]} color="#ADFF2F" intensity={1.5} /> {/* Green yellow point light */}
      <Swarm />
    </Canvas>
  );
}

export default ThreeScene;