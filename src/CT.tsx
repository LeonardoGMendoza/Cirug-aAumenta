import { useEffect, useRef, useState } from 'react'
import { sc, useS } from './store'
import { N, toIdx, volume } from './volume'

type Axis = 'axial' | 'coronal' | 'sagittal'
type P = { xi: number; yi: number; zi: number }
const NAMES: Record<Axis, string> = { axial: 'AXIAL', coronal: 'CORONAL', sagittal: 'SAGITAL' }

function draw(c: HTMLCanvasElement, axis: Axis, p: P, mark: P) {
  const ctx = c.getContext('2d'); if (!ctx) return
  const v = volume(), img = ctx.createImageData(N, N)
  for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) {
    const xi = axis === 'sagittal' ? p.xi : q
    const yi = axis === 'axial' ? p.yi : N - 1 - r
    const zi = axis === 'axial' ? N - 1 - r : axis === 'coronal' ? p.zi : q
    const g = v[(zi * N + yi) * N + xi], o = (r * N + q) * 4
    img.data[o] = img.data[o + 1] = img.data[o + 2] = g; img.data[o + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  const cx = axis === 'sagittal' ? mark.zi : mark.xi, cy = axis === 'axial' ? N - 1 - mark.zi : N - 1 - mark.yi
  const near = axis === 'axial' ? mark.yi === p.yi : axis === 'coronal' ? mark.zi === p.zi : mark.xi === p.xi
  ctx.strokeStyle = near ? '#3fd0b0' : 'rgba(63,208,176,.35)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, N); ctx.moveTo(0, cy); ctx.lineTo(N, cy); ctx.stroke()
}

function Slice({ axis, p, mark, set }: { axis: Axis; p: P; mark: P; set: (i: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const idx = axis === 'axial' ? p.yi : axis === 'coronal' ? p.zi : p.xi
  useEffect(() => { if (ref.current) draw(ref.current, axis, p, mark) })
  return <div className="ct-cell">
    <canvas ref={ref} width={N} height={N} />
    <span>{NAMES[axis]} {idx + 1} / {N}</span>
    <input type="range" min={0} max={N - 1} value={idx} onChange={e => set(+e.target.value)} aria-label={NAMES[axis]} />
  </div>
}

// Cortes de tomografia (axial, coronal, sagital) com a mira no alvo do passo atual. Só aparece no cérebro.
export function CT() {
  const key = useS(s => s.key), step = useS(s => s.step), S = sc(key), st = S.steps[step]
  const mark = toIdx(S.targets[st ? st.target : S.steps[S.steps.length - 1].target])
  const [p, setP] = useState<P>(mark)
  useEffect(() => { setP(mark) }, [key, step]) // eslint-disable-line
  if (key !== 'cerebro') return null
  return <div className="ct">
    <Slice axis="axial" p={p} mark={mark} set={i => setP({ ...p, yi: i })} />
    <Slice axis="coronal" p={p} mark={mark} set={i => setP({ ...p, zi: i })} />
    <Slice axis="sagittal" p={p} mark={mark} set={i => setP({ ...p, xi: i })} />
  </div>
}
