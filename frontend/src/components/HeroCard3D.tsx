import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../pages/Dashboard.module.css'; // Re-use existing CSS for DOM elements

interface HeroCard3DProps {
  user: { name: string } | null;
  logout: () => void;
  i18n: any; // i18n instance
  changeLanguage: (lng: string) => void;
  t: (key: string, options?: any) => string;
  position: number[];
}

const HeroCard3D: React.FC<HeroCard3DProps> = ({ user, logout, i18n, changeLanguage, t }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Hover lift
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, hovered ? 0.5 : 0, 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]} // Adjust position as needed in the 3D scene
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[10, 3, 0.1]} /> {/* Placeholder geometry for the card */}
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
      <Html center position={[0, 0, 0.06]}> {/* Position slightly above the plane */}
        <header className={styles.header} style={{ width: '800px', padding: '20px', borderRadius: '20px', background: 'transparent' }}>
          <h1 className={styles.welcomeTitle}>{t('welcome', { name: user?.name })}</h1>
          <div className={styles.headerActions}>
            <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className={styles.languageSwitcher}>
              <option value="en">English</option>
              <option value="vn">Tiếng Việt</option>
            </select>
            <button onClick={logout} className={styles.logoutButton}>
              {t('logout')}
            </button>
          </div>
        </header>
      </Html>
    </mesh>
  );
};

export default HeroCard3D;
