import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { TOOLS } from './scenarios'
import { useS } from './store'

// Controle de Xbox: analógico esq. = cursor, A = usar/cortar, LB/RB = ferramenta, analógico dir. = girar, LT/RT = zoom, B = reiniciar
export function useGamepad() {
  const gl = useThree(s => s.gl), get = useThree(s => s.get)
  const z = useRef({ cx: innerWidth * 0.6, cy: innerHeight * 0.5, pv: [] as boolean[], cur: null as HTMLDivElement | null })
  useEffect(() => {
    const d = document.createElement('div')
    d.style.cssText = 'position:fixed;z-index:3;width:20px;height:20px;margin:-10px;border:2px solid #3fd0b0;border-radius:50%;pointer-events:none;display:none'
    document.body.appendChild(d); z.current.cur = d; return () => d.remove()
  }, [])
  useFrame(({ camera }) => {
    const g = [...navigator.getGamepads()].find(x => x); if (!g) return
    const s = z.current, dz = (v: number) => (Math.abs(v) > 0.15 ? v : 0)
    const bt = (i: number) => !!g.buttons[i]?.pressed, edge = (i: number) => bt(i) && !s.pv[i]
    s.cx = Math.min(innerWidth, Math.max(0, s.cx + dz(g.axes[0]) * 14)); s.cy = Math.min(innerHeight, Math.max(0, s.cy + dz(g.axes[1]) * 14))
    s.cur!.style.display = 'block'; s.cur!.style.left = s.cx + 'px'; s.cur!.style.top = s.cy + 'px'
    const send = (t: string) => gl.domElement.dispatchEvent(new PointerEvent(t, { clientX: s.cx, clientY: s.cy, button: 0, buttons: bt(0) ? 1 : 0, pointerId: 7, pointerType: 'mouse', bubbles: true }))
    send(edge(0) ? 'pointerdown' : 'pointermove'); if (s.pv[0] && !bt(0)) send('pointerup')
    const i = TOOLS.findIndex(t => t.id === useS.getState().tool)
    if (edge(5)) useS.getState().setTool(TOOLS[(i + 1) % 4].id)
    if (edge(4)) useS.getState().setTool(TOOLS[(i + 3) % 4].id)
    if (edge(1)) useS.getState().reset()
    const c: any = get().controls
    if (c) {
      const o = camera.position.clone().sub(c.target), sp = new THREE.Spherical().setFromVector3(o)
      sp.theta -= dz(g.axes[2]) * 0.03; sp.phi = Math.min(3, Math.max(0.2, sp.phi + dz(g.axes[3]) * 0.03))
      sp.radius = Math.max(0.8, sp.radius + ((g.buttons[6]?.value || 0) - (g.buttons[7]?.value || 0)) * 0.06)
      camera.position.copy(c.target).add(o.setFromSpherical(sp)); c.update()
    }
    s.pv = g.buttons.map(b => b.pressed)
  })
}
