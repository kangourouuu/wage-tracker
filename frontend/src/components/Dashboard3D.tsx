import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber'; // Removed useFrame
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Dashboard3DProps {
  workEntries: any[]; // Replace 'any' with actual WorkEntry type
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  t: (key: string, options?: any) => string;
}

// Placeholder for 3D Calendar with liquid glass effect
const Calendar3D = ({ selectedDate, onDateClick, t }: { selectedDate: Date | null; onDateClick: (date: Date) => void; t: (key: string) => string }) => {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh ref={ref} position={[-4, 0, 0]} onClick={() => onDateClick(new Date())}>
      <boxGeometry args={[3, 3, 0.1]} />
      <meshStandardMaterial
        color="white"
        transparent
        opacity={0.2} // Increased transparency for liquid glass
        roughness={0.1}
        metalness={0.9} // Increased metalness for reflectivity
        envMapIntensity={1} // Environment map intensity for reflections
      />
      <Text position={[0, 0.5, 0.06]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {t('date')}
      </Text>
      <Text position={[0, -0.5, 0.06]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
        {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
      </Text>
    </mesh>
  );
};

// Placeholder for 3D Work Entry
const WorkEntry3D = ({ entry, position, t }: { entry: any; position: [number, number, number]; t: (key: string) => string }) => {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[2.5, 0.8, 0.1]} />
      <meshStandardMaterial color="lightgreen" transparent opacity={0.7} />
      <Text position={[0, 0.2, 0.06]} fontSize={0.15} color="white" anchorX="left" anchorY="middle">
        {t('date')}: {new Date(entry.startTime).toLocaleDateString()}
      </Text>
      <Text position={[0, -0.2, 0.06]} fontSize={0.15} color="white" anchorX="left" anchorY="middle">
        {t('hoursWorked')}: {((new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime() - entry.breakDuration * 60 * 1000) / (1000 * 60 * 60)).toFixed(2)}
      </Text>
    </mesh>
  );
};


const Dashboard3D: React.FC<Dashboard3DProps> = ({ workEntries, selectedDate, onDateClick, t }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* Calendar */}
      <Calendar3D selectedDate={selectedDate} onDateClick={onDateClick} t={t} />

      {/* Work Entries */}
      {workEntries.map((entry, index) => (
        <WorkEntry3D key={entry.id} entry={entry} position={[4, 2 - index * 1, 0]} t={t} />
      ))}
    </Canvas>
  );
};

export default Dashboard3D;
