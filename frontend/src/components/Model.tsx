import { useFBX } from '@react-three/drei';

export function Model() {
  const fbx = useFBX('/assets/lod.fbx');
  return <primitive object={fbx} scale={0.01} position={[0, -1, 0]} />;
}
