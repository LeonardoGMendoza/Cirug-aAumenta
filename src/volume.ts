// Volume de tomografia SINTÉTICO de uma cabeça (pele, crânio, cérebro, ventrículos, tumor).
// Mesmo sistema de coordenadas do modelo 3D do cérebro. Troque por um exame real quando tiver (ver README).
export const N = 80
const R = 1.5
let vol: Uint8Array | null = null
const ell = (x: number, y: number, z: number, cx: number, cy: number, cz: number, a: number, b: number, c: number) =>
  ((x - cx) / a) ** 2 + ((y - cy) / b) ** 2 + ((z - cz) / c) ** 2

export function volume(): Uint8Array {
  if (vol) return vol
  const v = new Uint8Array(N * N * N)
  for (let zi = 0; zi < N; zi++) for (let yi = 0; yi < N; yi++) for (let xi = 0; xi < N; xi++) {
    const x = (xi / (N - 1) * 2 - 1) * R, y = (yi / (N - 1) * 2 - 1) * R, z = (zi / (N - 1) * 2 - 1) * R
    const eb = ell(x, y, z, 0, 0, 0, 1.1, 0.9, 1.3), es = ell(x, y, z, 0, 0, 0, 1.25, 1.05, 1.45), ec = ell(x, y, z, 0, 0, 0, 1.4, 1.2, 1.6)
    let d = 0
    if (ec <= 1) d = es <= 1 ? (eb <= 1 ? 0.55 + 0.05 * Math.sin(x * 14) * Math.sin(y * 12 + z * 9) : 1) : 0.33
    if (eb <= 1) {
      if (ell(x, y, z, 0.18, 0.2, 0.1, 0.12, 0.2, 0.4) <= 1 || ell(x, y, z, -0.18, 0.2, 0.1, 0.12, 0.2, 0.4) <= 1) d = 0.15
      if (ell(x, y, z, 0.3, 0.1, 0.1, 0.22, 0.22, 0.22) <= 1) d = 0.85
    }
    v[(zi * N + yi) * N + xi] = Math.round(d * 255)
  }
  vol = v; return v
}

export const toIdx = (p: [number, number, number]) => {
  const f = (t: number) => Math.min(N - 1, Math.max(0, Math.round((t / R + 1) / 2 * (N - 1))))
  return { xi: f(p[0]), yi: f(p[1]), zi: f(p[2]) }
}
