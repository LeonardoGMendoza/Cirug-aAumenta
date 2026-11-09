import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { TOOLS } from './scenarios'
import { sc, useS } from './store'

const FILTROS: [string, number][] = [['Opaco', 0.9], ['Translúcido', 0.45], ['Raio-x', 0.15]]

// Menu flutuante estilo "Tools / Filters" (funciona com mouse, toque, controle e pinça em RA)
export function Panel() {
  const tool = useS(s => s.tool), op = useS(s => s.opacity)
  const items = [
    ...TOOLS.map(t => ({ k: t.id, label: t.label, on: tool === t.id, go: () => useS.getState().setTool(t.id) })),
    ...FILTROS.map(([l, o]) => ({ k: l, label: l, on: op === o, go: () => useS.getState().setOpacity(o) })),
  ]
  return <group position={[1.3, 1.5, -0.1]} rotation-y={-0.45}>
    {items.map((b, i) => (
      <group key={b.k} position={[0, 0.33 - i * 0.11, 0]} onPointerDown={e => { e.stopPropagation(); b.go() }}>
        <mesh><planeGeometry args={[0.36, 0.095]} /><meshBasicMaterial color={b.on ? '#3fd0b0' : '#14262d'} /></mesh>
        <Text fontSize={0.04} color={b.on ? '#0e1a1f' : '#e8f1f0'} position={[0, 0, 0.002]}>{b.label}</Text>
      </group>))}
  </group>
}

export function Board() {
  const key = useS(s => s.key), step = useS(s => s.step), msg = useS(s => s.msg), S = sc(key), st = S.steps[step]
  const tl = st ? TOOLS.find(t => t.id === st.tool)!.label : ''
  return <group position={[0, 2.05, -0.6]}>
    <mesh><planeGeometry args={[1.5, 0.5]} /><meshBasicMaterial color="#14262d" /></mesh>
    <Text fontSize={0.055} maxWidth={1.4} color="#e8f1f0" anchorX="left" anchorY="top" position={[-0.7, 0.2, 0.002]}>
      {st ? `Passo ${step + 1}/${S.steps.length}\nFerramenta: ${tl}\n${st.text}` : `Cirurgia concluída\n${msg}`}
    </Text>
  </group>
}

// Exame flutuante (ilustrativo). Troque pela imagem de uma tomografia real em /public.
export function Exam() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!
    x.fillStyle = '#05090b'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#3fd0b0'; x.lineWidth = 4; x.strokeRect(2, 2, 252, 252)
    const g = x.createRadialGradient(128, 120, 10, 128, 120, 90); g.addColorStop(0, '#c9d6d8'); g.addColorStop(1, '#3a4a4f')
    x.fillStyle = g; x.beginPath(); x.ellipse(128, 115, 70, 88, 0, 0, 7); x.fill()
    x.fillStyle = '#05090b'; [[100, 105], [156, 105]].forEach(p => { x.beginPath(); x.ellipse(p[0], p[1], 14, 10, 0, 0, 7); x.fill() }); x.fillRect(122, 120, 12, 34)
    x.fillStyle = '#8fa9ad'; x.font = '600 18px sans-serif'; x.fillText('Tomografia (exemplo)', 12, 28)
    return new THREE.CanvasTexture(c)
  }, [])
  return <mesh position={[-1.1, 1.75, -0.2]} rotation-y={0.35}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial map={tex} /></mesh>
}
