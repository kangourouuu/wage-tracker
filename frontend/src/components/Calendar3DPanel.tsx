import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import Calendar from 'react-calendar';
import '../styles/Calendar.css'; // Import calendar styles
import styles from '../pages/Dashboard.module.css'; // Import dashboard styles for calendarWrapper

interface Calendar3DPanelProps {
  selectedDate: Date | null;
  onDateChange: (value: Date | Date[] | null | [Date | null, Date | null], event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickDay: (date: Date) => void;
  locale: string;
  position: number[];
}

const Calendar3DPanel: React.FC<Calendar3DPanelProps> = ({ selectedDate, onDateChange, onClickDay, locale }) => {
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
      position={[-4, -2, 0]} // Position the calendar panel
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[3.5, 3.5, 0.1]} /> {/* Adjust size as needed */}
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
        <div className={styles.calendarWrapper} style={{ width: '350px', height: '350px', overflow: 'hidden' }}>
          <Calendar
            onChange={onDateChange}
            value={selectedDate}
            onClickDay={onClickDay}
            locale={locale}
          />
        </div>
      </Html>
    </mesh>
  );
};

export default Calendar3DPanel;
