import { useEffect, useState } from 'react'

// Celular/tablet (toque). No iPhone isso é true.
export const isTouch = typeof matchMedia !== 'undefined' && matchMedia('(pointer:coarse)').matches

// WebXR AR só existe no Chrome Android e no Meta Quest. No iPhone (Safari/Chrome iOS) nunca existe.
export function useArSupported() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const xr = (navigator as any).xr
    if (!xr?.isSessionSupported) return
    xr.isSessionSupported('immersive-ar').then((v: boolean) => setOk(!!v)).catch(() => setOk(false))
  }, [])
  return ok
}
