import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { XR, createXRStore, useXR } from '@react-three/xr'
import { MOUSE, TOUCH } from 'three'
import { SCENARIOS } from './scenarios'
import { sc, useS } from './store'
import { Room } from './Room'
import { Organ } from './Organ'
import { VirtualHands } from './Hands'
import { Board, Exam, Panel } from './Panel'
import { useGamepad } from './useGamepad'

const store = createXRStore({ hand: true, controller: true })

function Scene() {
  const inXR = useXR(s => s.session != null)
  useGamepad()
  return <>
    {!inXR && <color attach="background" args={['#0b1418']} />}
    <ambientLight intensity={0.8} /><hemisphereLight args={['#ffffff', '#445566', 0.8]} />
    {!inXR && <Room />}
    <group position={inXR ? [0, 0, -1] : [0, 0, 0]}>
      <Organ /><Panel /><Board /><Exam />
    </group>
    <VirtualHands />
    <OrbitControls makeDefault enabled={!inXR} target={[0, 1.1, 0]}
      mouseButtons={{ LEFT: -1 as any, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }}
      touches={{ ONE: -1 as any, TWO: TOUCH.DOLLY_ROTATE }} />
  </>
}

function Hud() {
  const s = useS(), S = sc(s.key), [err, setErr] = useState('')
  return <div className="hud">
    <h1>Cirurgia aumentada v6</h1>
    <label>Cirurgia
      <select value={s.key} onChange={e => s.setKey(e.target.value as any)}>
        {SCENARIOS.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select></label>
    <label>Transparência do órgão
      <input type="range" min={10} max={100} value={Math.round(s.opacity * 100)} onChange={e => s.setOpacity(+e.target.value / 100)} /></label>
    <label className="chk"><input type="checkbox" checked={s.hints} onChange={s.toggleHints} />Mostrar dicas (desligue para modo prova)</label>
    <ol>{S.steps.map((x, i) => <li key={i} className={i < s.step ? 'ok' : i === s.step ? 'on' : ''}>{x.text}</li>)}</ol>
    <div className="msg" role="status">{s.msg || err}</div>
    <button onClick={s.reset}>Reiniciar</button>
    <button onClick={() => store.enterAR().catch(() => setErr('RA não suportada neste aparelho'))}>Entrar em RA</button>
    <small>Mouse: botão esquerdo usa a ferramenta (arraste com o bisturi para cortar), direito gira, roda dá zoom. Toque: um dedo usa, dois dedos giram.</small>
    <small>Controle Xbox (aperte um botão): analógico esq. cursor, A usa, LB/RB ferramenta, analógico dir. gira, LT/RT zoom, B reinicia.</small>
  </div>
}

export default function App() {
  return <>
    <Hud />
    <Canvas camera={{ position: [0.3, 1.9, 2.6], fov: 50 }}>
      <XR store={store}><Scene /></XR>
    </Canvas>
  </>
}
