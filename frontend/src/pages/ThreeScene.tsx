import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT_PER_COLOR = 500; // Total particles 2000 / 4 colors
const COLORS = ['#C3E4FB', '#94CEF7', '#82C6F6', '#FFFFFF'];

function Swarm() {
  const meshRefs = useRef([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp = [];
    for (let c = 0; c < COLORS.length; c++) {
      for (let i = 0; i < PARTICLE_COUNT_PER_COLOR; i++) {
        const t = Math.random() * 100;
        const factor = 10 + Math.random() * 60;
        const speed = 0;
        const xFactor = -20 + Math.random() * 40;
        const yFactor = -20 + Math.random() * 40;
        const zFactor = -20 + Math.random() * 40;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0, colorIndex: c });
      }
    }
    return temp;
  }, []);

  useFrame((_state) => {
    if (!meshRefs.current[0]) return;

    COLORS.forEach((_, c) => {
      const currentMesh = meshRefs.current[c];
      if (!currentMesh) return;

      particles.filter(p => p.colorIndex === c).forEach((particle, i) => {
        let { t, factor, xFactor, yFactor, zFactor } = particle;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;

        const baseX = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
        const baseY = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
        const baseZ = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

        const mouseInfluence = 1.5;
        const mouseRadius = 15;

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

        dummy.scale.setScalar(0.015);
        dummy.updateMatrix();
        currentMesh.setMatrixAt(i, dummy.matrix);
      });
      currentMesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <>
      {COLORS.map((color, c) => (
        <instancedMesh key={c} ref={(el) => (meshRefs.current[c] = el)} args={[undefined, undefined, PARTICLE_COUNT_PER_COLOR]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.3} roughness={0.2} metalness={0.1} />
        </instancedMesh>
      ))}
    </>
  );
}

function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#98FB98" intensity={1.5} />
      <pointLight position={[0, 10, 0]} color="#ADFF2F" intensity={1.5} />
      <Swarm />
    </Canvas>
  );
}

export default ThreeScene;