import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Removed useThree
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 1000; // Increased particle count

function Swarm() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 120; // Adjusted factor
      const speed = 0.01 + Math.random() / 100; // Adjusted speed
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  useFrame((_state) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      const baseX = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
      const baseY = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
      const baseZ = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

      // Apply mouse interaction
      const mouseInfluence = 0.7; // Increased mouse influence
      const mouseRadius = 20; // Increased mouse radius

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

      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="#9575cd" roughness={0.7} metalness={0.3} /> {/* Updated color and material properties */}
    </instancedMesh>
  );
}

function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#673ab7" intensity={1.5} /> {/* Updated color */}
      <pointLight position={[0, 10, 0]} color="#00bcd4" intensity={1.5} /> {/* Updated color */}
      <Swarm />
    </Canvas>
  );
}

export default ThreeScene;