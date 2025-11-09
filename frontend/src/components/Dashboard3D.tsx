import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Dashboard3DProps {
  summary: {
    totalHours: string;
    totalEarnings: string;
  };
  workEntries: any[]; // Replace 'any' with actual WorkEntry type
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onAddEntryClick: () => void;
  t: (key: string, options?: any) => string;
  i18n: any;
}

// Placeholder for 3D Summary Card
const SummaryCard3D = ({ title, value, position }: { title: string; value: string; position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[2, 1, 0.2]} />
      <meshStandardMaterial color="hotpink" transparent opacity={0.7} />
      <Text position={[0, 0.3, 0.11]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {title}
      </Text>
      <Text position={[0, -0.2, 0.11]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {value}
      </Text>
    </mesh>
  );
};

// Placeholder for 3D Calendar
const Calendar3D = ({ selectedDate, onDateClick, t }: { selectedDate: Date | null; onDateClick: (date: Date) => void; t: (key: string) => string }) => {
  const ref = useRef<THREE.Mesh>(null!);
  // This is a very simplified 3D representation. A real 3D calendar would be much more complex.
  return (
    <mesh ref={ref} position={[-4, 0, 0]} onClick={() => onDateClick(new Date())}>
      <boxGeometry args={[3, 3, 0.1]} />
      <meshStandardMaterial color="lightblue" transparent opacity={0.7} />
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


const Dashboard3D: React.FC<Dashboard3DProps> = ({ summary, workEntries, selectedDate, onDateClick, onAddEntryClick, t }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* Summary Cards */}
      <SummaryCard3D title={t('totalHours')} value={summary.totalHours} position={[-2, 3, 0]} />
      <SummaryCard3D title={t('totalEntries')} value={workEntries.length.toString()} position={[0, 3, 0]} />
      <SummaryCard3D title={t('estimatedEarnings')} value={`$${summary.totalEarnings}`} position={[2, 3, 0]} />

      {/* Calendar */}
      <Calendar3D selectedDate={selectedDate} onDateClick={onDateClick} t={t} />

      {/* Work Entries */}
      {workEntries.map((entry, index) => (
        <WorkEntry3D key={entry.id} entry={entry} position={[4, 2 - index * 1, 0]} t={t} />
      ))}

      {/* Add Entry Button - represented as a 3D object */}
      <mesh position={[0, -3, 0]} onClick={onAddEntryClick}>
        <boxGeometry args={[2, 0.5, 0.1]} />
        <meshStandardMaterial color="green" />
        <Text position={[0, 0, 0.06]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
          {t('addEntry')}
        </Text>
      </mesh>
    </Canvas>
  );
};

export default Dashboard3D;
