import { sc, useS } from './store'

export const Nav = () => {
  const s = useS(), st = sc(s.key).steps[s.step]
  return st ? <div className="nav"><i className={s.dist !== null && s.dist < 15 ? 'g' : ''} />Alvo: {s.dist === null ? 'aponte para o órgão' : `≈ ${s.dist} mm`}</div> : null
}
export const Cutplane = () => {
  const s = useS()
  return <label>Plano de corte (cutplane)<input type="range" min={0} max={100} value={Math.round(s.cut * 100)} onChange={e => s.setCut(+e.target.value / 100)} /></label>
}
