import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { aim, sc, useS } from './store'

function Part({ geo, pos = [0, 0, 0], scale = [1, 1, 1], rot = [0, 0, 0], color, children }: any) {
  const op = useS(s => s.opacity)
  return (
    <mesh position={pos} scale={scale} rotation={rot} userData={{ shell: true }}>
      {geo ? <primitive object={geo} attach="geometry" /> : children}
      <meshPhysicalMaterial color={color} transparent opacity={op} depthWrite={false} roughness={0.5} clearcoat={0.35} />
    </mesh>
  )
}
const sph = <sphereGeometry args={[1, 48, 32]} />

function Rim() {
  const bean = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 48, 32), p = g.attributes.position
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); if (x > 0) p.setX(i, x * (1 - 0.5 * Math.exp(-y * y * 8))) }
    g.computeVertexNormals(); return g
  }, [])
  return <>
    <Part geo={bean} scale={[0.8, 1.3, 0.55]} color="#a5483e" />
    <Part pos={[0.5, -0.8, 0]} rot={[0, 0, 0.3]} color="#e3b562"><cylinderGeometry args={[0.1, 0.14, 0.9, 24]} /></Part>
    <Part pos={[0.55, 0.2, 0]} rot={[0, 0, 1.45]} color="#5a78b0"><cylinderGeometry args={[0.12, 0.12, 0.8, 24]} /></Part>
  </>
}
function Heart() {
  return <>
    <Part scale={[0.95, 1.1, 0.85]} color="#b5303a">{sph}</Part>
    <Part pos={[0.2, 1.15, 0]} rot={[0, 0, -0.3]} color="#d9a0a0"><cylinderGeometry args={[0.18, 0.22, 0.9, 24]} /></Part>
    <Part pos={[-0.45, 1.1, -0.1]} color="#4a6fa5"><cylinderGeometry args={[0.14, 0.14, 0.8, 24]} /></Part>
  </>
}
function Brain() {
  const g = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 64, 48), p = g.attributes.position
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.05 * Math.sin(x * 9) * Math.sin(y * 8 + z * 6); p.setXYZ(i, x * k, y * k, z * k) }
    g.computeVertexNormals(); return g
  }, [])
  return <>
    <Part geo={g} scale={[1.1, 0.9, 1.3]} color="#d7a3a8" />
    <Part pos={[0, -0.6, -0.9]} scale={[0.45, 0.32, 0.45]} color="#c48a90">{sph}</Part>
    <Part pos={[0, -0.85, -0.3]} rot={[0.4, 0, 0]} color="#c48a90"><cylinderGeometry args={[0.14, 0.12, 0.8, 24]} /></Part>
  </>
}
function Face() {
  return <>
    <Part scale={[0.8, 1.05, 0.85]} color="#e0b090">{sph}</Part>
    <Part pos={[0, -0.05, 0.85]} rot={[Math.PI / 2, 0, 0]} color="#e0b090"><cylinderGeometry args={[0, 0.13, 0.4, 24]} /></Part>
    {[-0.3, 0.3].map(x => <Part key={x} pos={[x, 0.2, 0.78]} scale={[0.08, 0.08, 0.08]} color="#222222">{sph}</Part>)}
  </>
}
const MODELS = { rim: Rim, coracao: Heart, cerebro: Brain, rosto: Face }

export function Organ() {
  const key = useS(s => s.key), step = useS(s => s.step), cuts = useS(s => s.cuts), done = useS(s => s.done), hints = useS(s => s.hints)
  const S = sc(key), st = S.steps[step], Model = MODELS[key], g = useRef<THREE.Group>(null!)

  const on = (e: ThreeEvent<PointerEvent>, first: boolean) => {
    e.stopPropagation()
    const s = useS.getState(), surf = e.intersections.find(i => i.object.userData.shell)
    aim.on = !!surf; if (surf) aim.p.copy(surf.point)
    if (first) useS.setState({ down: true })
    if (!(first || s.down) || !st) return
    if (surf && s.tool === 'bisturi') { const v = g.current.worldToLocal(surf.point.clone()); s.addCut([v.x, v.y, v.z]) }
    if (e.intersections.some(i => i.object.userData.t === st.target)) s.hit(first)
    else if (first && surf) s.miss()
  }
  return (
    <group ref={g} position={S.pos} scale={S.scale}
      onPointerDown={e => on(e, true)} onPointerMove={e => on(e, false)}
      onPointerUp={() => useS.setState({ down: false })}
      onPointerOut={() => { aim.on = false; useS.setState({ down: false }) }}>
      <Model />
      {S.targets.map((p, i) => (
        <mesh key={i} position={p} userData={{ t: i }} renderOrder={5}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshBasicMaterial color={done.includes(i) ? '#7dd87d' : '#3fd0b0'} transparent depthTest={false}
            opacity={done.includes(i) || (hints && st?.target === i) ? 1 : 0} />
        </mesh>))}
      {done.length > 1 && <Line points={done.map(i => S.targets[i])} color="#ffd24a" lineWidth={2} depthTest={false} />}
      {cuts.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color="#ff3b30" depthTest={false} /></mesh>)}
    </group>
  )
}
