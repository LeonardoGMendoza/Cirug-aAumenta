import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { aim, useS } from './store'
import { TOOLS } from './scenarios'

// Mãos virtuais (esqueleto com articulações) para PC/celular. Em RA, o @react-three/xr mostra as mãos reais.
const BONES = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]]
const OPEN = [[0,0],[-.28,.18],[-.42,.32],[-.52,.46],[-.58,.58],[-.15,.48],[-.16,.7],[-.17,.86],[-.17,.98],[0,.5],[0,.74],[0,.92],[0,1.05],[.14,.47],[.15,.69],[.16,.84],[.16,.95],[.27,.42],[.3,.58],[.32,.7],[.33,.8]]
const PINCH = [[0,0],[-.28,.18],[-.38,.34],[-.4,.5],[-.3,.62],[-.15,.48],[-.17,.68],[-.25,.78],[-.3,.64],[0,.5],[0,.66],[0,.56],[0,.44],[.14,.47],[.15,.62],[.15,.52],[.14,.41],[.27,.42],[.3,.54],[.3,.45],[.29,.36]]
const HS = 0.16
type Hand = THREE.Group & { pose: (p: number) => void }

function makeHand(): Hand {
  const g = new THREE.Group() as Hand
  const sp = OPEN.map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 8), new THREE.MeshBasicMaterial({ color: 0xcfe9ee, depthTest: false })); m.renderOrder = 9; g.add(m); return m })
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BONES.length * 6), 3))
  const ln = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x8fb4bb, depthTest: false })); ln.renderOrder = 8; ln.frustumCulled = false; g.add(ln)
  g.pose = p => {
    const P = OPEN.map((o, i) => [(o[0] + (PINCH[i][0] - o[0]) * p) * HS, (o[1] + (PINCH[i][1] - o[1]) * p) * HS])
    P.forEach((q, i) => sp[i].position.set(q[0], q[1], 0))
    const a = geo.attributes.position
    BONES.forEach(([i, j], k) => { a.setXYZ(k * 2, P[i][0], P[i][1], 0); a.setXYZ(k * 2 + 1, P[j][0], P[j][1], 0) })
    a.needsUpdate = true
  }
  g.pose(0); return g
}

const TARGET = new THREE.Vector3(0, 1.1, 0)
export function VirtualHands() {
  const inXR = useXR(s => s.session != null)
  const [R, L, tip] = useMemo(() => {
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.09, 12).translate(0, -0.045, 0), new THREE.MeshBasicMaterial())
    t.rotation.x = Math.PI; return [makeHand(), makeHand(), t]
  }, [])
  const o = useMemo(() => ({ rc: new THREE.Raycaster(), v: new THREE.Vector3(), w: new THREE.Vector3(), hp: 0 }), [])
  useFrame(({ camera, pointer }) => {
    R.visible = L.visible = !inXR; tip.visible = !inXR && aim.on
    if (inXR) return
    o.rc.setFromCamera(pointer, camera)
    const tp = aim.on ? aim.p : o.rc.ray.at(camera.position.distanceTo(TARGET), o.v)
    o.hp += ((useS.getState().down ? 1 : 0) - o.hp) * 0.3; R.pose(o.hp)
    R.quaternion.copy(camera.quaternion)
    R.position.copy(tp).add(o.w.set(0.027, -0.157, 0).applyQuaternion(camera.quaternion))
    tip.position.copy(aim.p); (tip.material as THREE.MeshBasicMaterial).color.set(TOOLS.find(t => t.id === useS.getState().tool)!.color)
    L.pose(0); L.scale.x = -1; L.quaternion.copy(camera.quaternion)
    L.position.copy(o.w.set(-0.5, -0.4, -1.1).applyQuaternion(camera.quaternion).add(camera.position))
  })
  return <><primitive object={R} /><primitive object={L} /><primitive object={tip} /></>
}
