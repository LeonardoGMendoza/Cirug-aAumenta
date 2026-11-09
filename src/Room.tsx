// Sala cirúrgica procedural (medidas em metros). Troque por um modelo .glb quando tiver um.
const Box = ({ p, s, c, e }: { p: number[]; s: number[]; c: string; e?: string }) => (
  <mesh position={p as any}><boxGeometry args={s as any} /><meshStandardMaterial color={c} emissive={e || '#000'} emissiveIntensity={e ? 1.2 : 0} roughness={0.7} /></mesh>
)
function Light({ x }: { x: number }) {
  return <group position={[x, 2.8, 0]}>
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5]} /><meshStandardMaterial color="#9aa" /></mesh>
    <mesh><cylinderGeometry args={[0.38, 0.38, 0.06, 40]} /><meshStandardMaterial color="#eee" emissive="#ffffff" emissiveIntensity={1.6} /></mesh>
    <pointLight position={[0, -0.3, 0]} intensity={14} distance={6} />
  </group>
}
export function Room() {
  return <group>
    <mesh rotation-x={-Math.PI / 2}><planeGeometry args={[8, 8]} /><meshStandardMaterial color="#7f9490" roughness={0.6} /></mesh>
    <Box p={[0, 1.6, -3]} s={[8, 3.2, 0.1]} c="#cfd8d6" />
    <Box p={[-4, 1.6, 0]} s={[0.1, 3.2, 8]} c="#c4cfcc" />
    <Box p={[4, 1.6, 0]} s={[0.1, 3.2, 8]} c="#c4cfcc" />
    <Light x={-0.5} /><Light x={0.9} />
    {/* mesa e paciente */}
    <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.08, 0.14, 0.9]} /><meshStandardMaterial color="#556" /></mesh>
    <Box p={[0, 0.9, 0]} s={[2.3, 0.08, 0.7]} c="#3a5560" />
    <mesh position={[0, 1.12, 0]} rotation-z={Math.PI / 2}><capsuleGeometry args={[0.17, 0.5, 8, 16]} /><meshStandardMaterial color="#6f8a96" transparent opacity={0.55} /></mesh>
    <mesh position={[-0.62, 1.12, 0]}><sphereGeometry args={[0.11, 24, 18]} /><meshStandardMaterial color="#d9b49a" /></mesh>
    {[-0.09, 0.09].map(z => <mesh key={z} position={[0.75, 1.06, z]} rotation-z={Math.PI / 2}><capsuleGeometry args={[0.08, 0.7, 6, 12]} /><meshStandardMaterial color="#2f8f6f" /></mesh>)}
    {/* monitores e armário */}
    <Box p={[-1.8, 1.5, -2.9]} s={[0.9, 0.55, 0.05]} c="#111" e="#103a3a" />
    <Box p={[1.8, 1.5, -2.9]} s={[0.9, 0.55, 0.05]} c="#111" e="#14315a" />
    <Box p={[2.9, 0.9, -1.2]} s={[0.6, 1.8, 1.6]} c="#9fb4c0" />
    <Box p={[-3, 0.9, -1.5]} s={[0.5, 1.8, 1.2]} c="#9fb4c0" />
  </group>
}
