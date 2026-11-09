export type ToolId = 'bisturi' | 'pinca' | 'laser' | 'ponteiro'
export type V3 = [number, number, number]
export interface Step { target: number; tool: ToolId; text: string }
export interface Scenario { id: 'rim' | 'coracao' | 'cerebro' | 'rosto'; name: string; pos: V3; scale: number; targets: V3[]; steps: Step[] }

export const TOOLS: { id: ToolId; label: string; color: string }[] = [
  { id: 'bisturi', label: 'Bisturi', color: '#ff6b5e' },
  { id: 'pinca', label: 'Pinça', color: '#dddddd' },
  { id: 'laser', label: 'Laser', color: '#66ccff' },
  { id: 'ponteiro', label: 'Ponteiro', color: '#ffd24a' },
]

export const SCENARIOS: Scenario[] = [
  { id: 'rim', name: 'Rim: pedra nos rins', pos: [0.1, 1.4, 0.05], scale: 0.22,
    targets: [[-0.2, 0.2, 0.48], [0.15, -0.25, 0.1]],
    steps: [
      { target: 0, tool: 'bisturi', text: 'Corte o flanco sobre o ponto marcado (arraste o bisturi)' },
      { target: 1, tool: 'pinca', text: 'Avance a pinça até o cálculo renal' },
      { target: 1, tool: 'laser', text: 'Fragmente a pedra com o laser' }] },
  { id: 'coracao', name: 'Coração: ponte coronária', pos: [-0.2, 1.4, 0], scale: 0.2,
    targets: [[0.35, 0.25, 0.75], [0.55, -0.2, 0.65], [-0.3, 0.1, 0.7]],
    steps: [
      { target: 0, tool: 'bisturi', text: 'Abra o acesso sobre a artéria obstruída (arraste o bisturi)' },
      { target: 1, tool: 'pinca', text: 'Posicione o enxerto da ponte' },
      { target: 2, tool: 'ponteiro', text: 'Confira a válvula com o ponteiro' }] },
  { id: 'cerebro', name: 'Cérebro: tumor', pos: [-0.7, 1.35, 0], scale: 0.15,
    targets: [[0, 0.85, 0.3], [0.3, 0.1, 0.1]],
    steps: [
      { target: 0, tool: 'bisturi', text: 'Incisão no ponto de entrada (arraste o bisturi)' },
      { target: 1, tool: 'ponteiro', text: 'Siga a trajetória até o tumor com o ponteiro' },
      { target: 1, tool: 'laser', text: 'Ressecte o tumor com o laser' }] },
  { id: 'rosto', name: 'Plástica: implante de silicone no rosto', pos: [-0.7, 1.35, 0], scale: 0.15,
    targets: [[-0.55, -0.15, 0.6], [0.55, -0.15, 0.6], [0, -0.05, 0.97]],
    steps: [
      { target: 0, tool: 'bisturi', text: 'Incisão para o implante malar esquerdo (arraste o bisturi)' },
      { target: 0, tool: 'pinca', text: 'Posicione o implante de silicone esquerdo' },
      { target: 1, tool: 'pinca', text: 'Posicione o implante de silicone direito' },
      { target: 2, tool: 'ponteiro', text: 'Confira a simetria tocando o nariz' }] },
]
