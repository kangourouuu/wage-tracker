import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT_PER_COLOR = 500;
const COLORS = ['#C3E4FB', '#94CEF7', '#82C6F6', '#FFFFFF'];

function Swarm() {
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
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
    for (let c = 0; c < COLORS.length; c++) {
      for (let i = 0; i < PARTICLE_COUNT_PER_COLOR; i++) {
        const t = Math.random() * 100;
        const factor = 20 + Math.random() * 100;
        const speed = 0.005 + Math.random() / 200;
        const xFactor = -50 + Math.random() * 100;
        const yFactor = -50 + Math.random() * 100;
        const zFactor = -20 + Math.random() * 40;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0, colorIndex: c });
      }
    }
    return temp;
  }, []);

  useFrame((state, _delta) => {
    if (!meshRefs.current[0]) return;

    COLORS.forEach((_, c) => {
      const currentMesh = meshRefs.current[c];
      if (!currentMesh) return;

      particles.filter(p => p.colorIndex === c).forEach((particle, i) => {
        let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
        t = particle.t += speed;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        const s = Math.cos(t) + Math.sin(t * 0.5) * 0.5 + 0.5;

        particle.mx += (mouse.current.x * state.viewport.width - particle.mx) * 0.01;
        particle.my += (mouse.current.y * state.viewport.height - particle.my) * 0.01;

        const baseX = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
        const baseY = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
        const baseZ = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

        dummy.position.set(baseX, baseY, baseZ);
        dummy.scale.setScalar(s * 0.1 + 0.05);
        dummy.rotation.set(s * 5, s * 5, s * 5);
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
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.1} metalness={0.9} />
        </instancedMesh>
      ))}
    </>
  );
}

function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#98FB98" intensity={1.5} />
      <pointLight position={[0, 10, 0]} color="#ADFF2F" intensity={1.5} />
      <Swarm />
    </Canvas>
  );
}

export default ThreeScene;