import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { XR, createXRStore, useXR } from '@react-three/xr'
import { MOUSE, TOUCH } from 'three'
import { isTouch, useArSupported } from './device'
import { MobileUI } from './Mobile'
import { CT } from './CT'
import { Cutplane, Nav } from './Widgets'

import { SCENARIOS } from './scenarios'
import { sc, useS } from './store'
import { Room } from './Room'
import { Organ } from './Organ'
import { VirtualHands } from './Hands'
import { Board, Exam, Panel } from './Panel'
import { useGamepad } from './useGamepad'

const store = createXRStore({ hand: true, controller: true })

// No celular: aproxima a câmera do órgão da cirurgia escolhida
function CameraRig() {
  const key = useS(s => s.key), controls = useThree(s => s.controls) as any, camera = useThree(s => s.camera)
  useEffect(() => {
    if (!isTouch || !controls) return
    const S = sc(key), d = 4.2 * S.scale + 0.45
    controls.target.set(...S.pos)
    camera.position.set(S.pos[0] + 0.12 * d, S.pos[1] + 0.25 * d, S.pos[2] + d)
    controls.update()
  }, [key, controls, camera])
  return null
}

function Scene() {
  const inXR = useXR(s => s.session != null)
  const mode = useS(s => s.mode)
  useGamepad()
  return <>
    {!inXR && <color attach="background" args={['#0b1418']} />}
    <ambientLight intensity={0.8} /><hemisphereLight args={['#ffffff', '#445566', 0.8]} />
    {!inXR && <Room />}
    <group position={inXR ? [0, 0, -1] : [0, 0, 0]}>
      <Organ />
      {(!isTouch || inXR) && <><Panel /><Board /><Exam /></>}
    </group>
    <VirtualHands />
    <CameraRig />
    <OrbitControls makeDefault enabled={!inXR} target={[0, 1.1, 0]} minDistance={0.4} maxDistance={6}
      mouseButtons={{ LEFT: -1 as any, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }}
      touches={mode === 'cam'
        ? { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }
        : { ONE: -1 as any, TWO: TOUCH.DOLLY_ROTATE }} />
  </>
}

function Hud({ ar, onAR, err }: { ar: boolean; onAR: () => void; err: string }) {
  const s = useS(), S = sc(s.key)
  return <div className="hud">
    <h1>Cirurgia aumentada v6</h1>
    <label>Cirurgia
      <select value={s.key} onChange={e => s.setKey(e.target.value as any)}>
        {SCENARIOS.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select></label>
    <label>Transparência do órgão
      <input type="range" min={10} max={100} value={Math.round(s.opacity * 100)} onChange={e => s.setOpacity(+e.target.value / 100)} /></label>
    <label className="chk"><input type="checkbox" checked={s.hints} onChange={s.toggleHints} />Mostrar dicas (desligue para modo prova)</label>
    <Cutplane /><Nav /><CT />
    <ol>{S.steps.map((x, i) => <li key={i} className={i < s.step ? 'ok' : i === s.step ? 'on' : ''}>{x.text}</li>)}</ol>
    <div className="msg" role="status">{s.msg || err}</div>
    <button onClick={s.reset}>Reiniciar</button>
    {ar ? <button onClick={onAR}>Entrar em RA</button> : <small style={{ display: 'block' }}>RA indisponível neste aparelho (iPhone não suporta WebXR AR).</small>}
    <small>Mouse: botão esquerdo usa a ferramenta (arraste com o bisturi para cortar), direito gira, roda dá zoom. Toque: um dedo usa, dois dedos giram.</small>
    <small>Controle Xbox (aperte um botão): analógico esq. cursor, A usa, LB/RB ferramenta, analógico dir. gira, LT/RT zoom, B reinicia.</small>
  </div>
}

export default function App() {
  const ar = useArSupported(), [err, setErr] = useState('')
  const onAR = () => store.enterAR().catch(() => setErr('RA não suportada neste aparelho'))
  return <>
    {isTouch ? <MobileUI ar={ar} onAR={onAR} err={err} /> : <Hud ar={ar} onAR={onAR} err={err} />}
    <Canvas dpr={[1, 2]} onCreated={({ gl }) => { gl.localClippingEnabled = true }} camera={{ position: [0.3, 1.9, 2.6], fov: 50 }}>
      <XR store={store}><Scene /></XR>
    </Canvas>
  </>
}
