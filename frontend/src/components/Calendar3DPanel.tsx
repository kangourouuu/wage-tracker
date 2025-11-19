import React, { useState } from 'react';
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
  position: [number, number, number]; // Changed to tuple
}

const Calendar3DPanel = React.forwardRef<THREE.Mesh, Calendar3DPanelProps>(({ selectedDate, onDateChange, onClickDay, position }, ref) => {
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref && 'current' in ref && ref.current) {
      // Subtle floating animation
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      // Slight lift on hover
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, hovered ? 0.2 : 0, 0.1);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position} // Use the passed position prop
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[3.5, 3.5, 0.1]} /> {/* Adjust size as needed */}
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
      <Html transform rotation={[0, 0, 0]} position={[0, 0, 0.06]} scale={0.01}> {/* Adjust scale to fit */}
        <div className={styles.calendarWrapper} style={{ width: '100%', minWidth: '320px', overflow: 'visible' }}>
          <Calendar
            onChange={onDateChange}
            value={selectedDate}
            onClickDay={onClickDay}
            locale="en-US"
            calendarType="gregory"
            showNeighboringMonth={false}
            formatShortWeekday={(_locale, date) => {
              const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
              return weekdays[date.getDay()];
            }}
          />
        </div>
      </Html>
    </mesh>
  );
});

export default Calendar3DPanel;
