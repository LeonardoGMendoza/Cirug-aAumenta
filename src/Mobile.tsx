import { useState } from 'react'
import { SCENARIOS, TOOLS } from './scenarios'
import { sc, useS } from './store'
import { CT } from './CT'
import { Cutplane, Nav } from './Widgets'

// Interface para celular: barra no topo (cirurgia + menu), cartão do passo e ferramentas embaixo.
export function MobileUI({ ar, onAR, err }: { ar: boolean; onAR: () => void; err: string }) {
  const s = useS(), S = sc(s.key), st = S.steps[s.step], [open, setOpen] = useState(false)
  return <div className="m-ui">
    <div className="m-top">
      <select aria-label="Cirurgia" value={s.key} onChange={e => { s.setKey(e.target.value as any); setOpen(false) }}>
        {SCENARIOS.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>
      <button className={open ? 'on' : ''} onClick={() => setOpen(!open)} aria-expanded={open}>☰ Menu</button>
    </div>

    {open && <div className="m-menu">
      <label>Transparência do órgão
        <input type="range" min={10} max={100} value={Math.round(s.opacity * 100)} onChange={e => s.setOpacity(+e.target.value / 100)} /></label>
      <label className="chk"><input type="checkbox" checked={s.hints} onChange={s.toggleHints} />Mostrar dicas (desligue para modo prova)</label>
      <Cutplane /><CT />
      <ol>{S.steps.map((x, i) => <li key={i} className={i < s.step ? 'ok' : i === s.step ? 'on' : ''}>{x.text}</li>)}</ol>
      <div className="m-row">
        <button onClick={() => { s.reset(); setOpen(false) }}>Reiniciar</button>
        {ar ? <button onClick={onAR}>Entrar em RA</button> : <small>RA indisponível no iPhone. Use o modo 3D.</small>}
      </div>
      {err && <small>{err}</small>}
    </div>}

    <div className="m-bottom">
      <div className="m-card" role="status">
        {st ? <><b>Passo {s.step + 1}/{S.steps.length}</b> · {st.text}</> : <b>Cirurgia concluída</b>}
        <Nav />
        {s.msg && <div className="m-msg">{s.msg}</div>}
      </div>
      <div className="m-mode">
        <button className={s.mode === 'cam' ? 'on' : ''} onClick={() => s.setMode('cam')}>🔄 Girar vista</button>
        <button className={s.mode === 'use' ? 'on' : ''} onClick={() => s.setMode('use')}>👆 Operar</button>
      </div>
      <div className="m-tools">
        {TOOLS.map(t => <button key={t.id} className={s.tool === t.id && s.mode === 'use' ? 'on' : ''}
          onClick={() => { s.setTool(t.id); s.setMode('use') }}>
          <i style={{ background: t.color }} />{t.label}</button>)}
      </div>
      <small className="m-hint">{s.mode === 'cam' ? 'Arraste com 1 dedo para girar, 2 dedos para zoom e mover.' : 'Toque no alvo ou arraste o bisturi. 2 dedos giram e dão zoom.'}</small>
    </div>
  </div>
}
