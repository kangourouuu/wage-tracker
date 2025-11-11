import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsive } from '../contexts/ResponsiveContext'; // Import useResponsive

const PARTICLE_COUNT_PER_COLOR = 1000; // Increased particle count
const COLORS = ['#00FFFF', '#00CED1', '#008B8B', '#FFFFFF']; // Updated colors to match theme (Cyan)

function Swarm() {
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef({ x: 0, y: 0 });
  const { prefersReducedMotion } = useResponsive();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (!prefersReducedMotion) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [prefersReducedMotion]);

  const particles = useMemo(() => {
    const temp = [];
    const count = prefersReducedMotion ? PARTICLE_COUNT_PER_COLOR / 2 : PARTICLE_COUNT_PER_COLOR; // Reduce particles for reduced motion
    for (let c = 0; c < COLORS.length; c++) {
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 20 + Math.random() * 100;
        const speed = 0.001 + Math.random() / 500; // Slower, more subtle movement
        const xFactor = -100 + Math.random() * 200; // Wider spread
        const yFactor = -100 + Math.random() * 200; // Wider spread
        const zFactor = -50 + Math.random() * 100; // Deeper spread
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0, colorIndex: c });
      }
    }
    return temp;
  }, [prefersReducedMotion]);

  useFrame((state, _delta) => {
    if (prefersReducedMotion) return; // Stop animation for reduced motion
    if (!meshRefs.current[0]) return;

    COLORS.forEach((_, c) => {
      const currentMesh = meshRefs.current[c];
      if (!currentMesh) return;

      particles.filter(p => p.colorIndex === c).forEach((particle, i) => {
        let { t } = particle;
        const { factor, speed, xFactor, yFactor, zFactor } = particle;
        t = particle.t += speed;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        const s = Math.cos(t) + Math.sin(t * 0.5) * 0.5 + 0.5;

        particle.mx += (mouse.current.x * state.viewport.width - particle.mx) * 0.005; // Slower mouse influence
        particle.my += (mouse.current.y * state.viewport.height - particle.my) * 0.005;

        const baseX = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
        const baseY = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
        const baseZ = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

        dummy.position.set(baseX, baseY, baseZ);
        dummy.scale.setScalar(s * 0.05 + 0.02); // Smaller particles
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
        <instancedMesh key={c} ref={(el) => (meshRefs.current[c] = el)} args={[undefined, undefined, prefersReducedMotion ? PARTICLE_COUNT_PER_COLOR / 2 : PARTICLE_COUNT_PER_COLOR]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.6} roughness={0.2} metalness={0.8} />
        </instancedMesh>
      ))}
    </>
  );
}

function ThreeSceneContent() {
  const { scene, camera, gl } = useThree();
  const { isMobile, isTablet, prefersReducedMotion } = useResponsive();

  useEffect(() => {
    // Adjust camera based on breakpoints
    if (camera instanceof THREE.PerspectiveCamera) { // Add type guard here
      if (isMobile) {
        camera.fov = 90;
        camera.position.set(0, 0, 20);
      } else if (isTablet) {
        camera.fov = 80;
        camera.position.set(0, 0, 18);
      } else {
        camera.fov = 75;
        camera.position.set(0, 0, 15);
      }
      camera.updateProjectionMatrix();
    }

    // Performance optimization for mobile
    gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));

    // Add/remove volumetric fog based on mobile/reduced motion
    if (isMobile || prefersReducedMotion) {
      scene.fog = null;
    } else {
      scene.fog = new THREE.FogExp2(0x00CED1, 0.005); // Dark Cyan fog
    }

    return () => {
      scene.fog = null; // Clean up on unmount
    };
  }, [isMobile, isTablet, prefersReducedMotion, camera, scene, gl]);

  return (
    <>
      <ambientLight intensity={0.6} /> {/* Adjusted ambient light */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} /> {/* Adjusted directional light */}
      <pointLight position={[-10, -10, -10]} color="#9a4dff" intensity={1} /> {/* Updated point light color */}
      <pointLight position={[0, 10, 0]} color="#FFD700" intensity={1.2} /> {/* Gold accent light */}
      <Swarm />
    </>
  );
}

function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <ThreeSceneContent />
    </Canvas>
  );
}

export default ThreeScene;