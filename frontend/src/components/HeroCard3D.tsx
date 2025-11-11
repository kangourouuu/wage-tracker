import React, { useState } from 'react';
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
  position: [number, number, number]; // Changed to tuple
}

const HeroCard3D = React.forwardRef<THREE.Mesh, HeroCard3DProps>(({ user, logout, i18n, changeLanguage, t, position }, ref) => {
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref && 'current' in ref && ref.current) {
      // Floating animation
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Hover lift
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, hovered ? 0.5 : 0, 0.1);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position} // Use the passed position prop
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[10, 3, 0.1]} /> {/* Placeholder geometry for the card */}
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
      <Html center position={[0, 0, 0.06]}> {/* Position slightly above the plane */}
        <header className={styles.header} style={{ width: '800px', padding: '20px', borderRadius: '20px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className={styles.avatarOrb}></div> {/* Avatar Orb Placeholder */}
            <h1 className={styles.welcomeTitle}>{t('welcome', { name: user?.name })}</h1>
          </div>
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
});

export default HeroCard3D;
