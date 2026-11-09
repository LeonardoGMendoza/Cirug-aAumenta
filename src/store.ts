import { create } from 'zustand'
import { Vector3 } from 'three'
import { SCENARIOS, TOOLS, Scenario, ToolId, V3 } from './scenarios'

export const sc = (k: string) => SCENARIOS.find(s => s.id === k)!
export const aim = { p: new Vector3(), on: false } // ponto do órgão sob o cursor (mão virtual e ferramenta)

interface S {
  key: Scenario['id']; tool: ToolId; step: number; errs: number; t0: number
  cuts: V3[]; done: number[]; msg: string; opacity: number; hints: boolean; down: boolean; mode: 'cam' | 'use'
  setKey: (k: Scenario['id']) => void; reset: () => void; setTool: (t: ToolId) => void
  setMode: (m: 'cam' | 'use') => void; setOpacity: (o: number) => void; toggleHints: () => void; addCut: (p: V3) => void
  hit: (first: boolean) => void; miss: () => void
}
export const useS = create<S>((set, get) => ({
  key: 'rim', tool: 'bisturi', step: 0, errs: 0, t0: Date.now(), cuts: [], done: [], msg: '', opacity: 0.45, hints: true, down: false, mode: 'cam',
  setKey: k => set({ key: k, step: 0, errs: 0, t0: Date.now(), cuts: [], done: [], msg: '' }),
  reset: () => get().setKey(get().key),
  setTool: t => set({ tool: t, msg: 'Ferramenta: ' + TOOLS.find(x => x.id === t)!.label }),
  setMode: m => set({ mode: m }),
  setOpacity: o => set({ opacity: o }),
  toggleHints: () => set(s => ({ hints: !s.hints })),
  addCut: p => set(s => {
    const l = s.cuts[s.cuts.length - 1]
    if (l && Math.hypot(l[0] - p[0], l[1] - p[1], l[2] - p[2]) < 0.06) return s
    return { cuts: [...s.cuts, p] }
  }),
  hit: first => {
    const s = get(), S = sc(s.key), st = S.steps[s.step]
    if (!st) return
    if (s.tool !== st.tool) { if (first) set({ msg: 'Use ' + TOOLS.find(x => x.id === st.tool)!.label + ' neste passo' }); return }
    const step = s.step + 1
    set({ step, done: [...s.done, st.target],
      msg: step >= S.steps.length ? `Concluída em ${Math.round((Date.now() - s.t0) / 1000)}s, ${s.errs} erro(s). Nota: ${Math.max(0, 100 - s.errs * 10)}` : 'Correto ✓' })
  },
  miss: () => set(s => ({ errs: s.errs + 1, msg: 'Estrutura errada ✗' })),
}))
