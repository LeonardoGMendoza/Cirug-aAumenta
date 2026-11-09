# Cirurgia Aumentada

Simulador de cirurgia em realidade aumentada para estudo. React + TypeScript + Three.js (react-three-fiber) + WebXR.

## Rodar
```
npm install
npm run dev      # abre em http://localhost:5173/Cirug-aAumenta/
```

## Publicar
Push na branch `main`. O GitHub Actions faz o build e publica no Pages.
No repositório: Settings > Pages > Source: **GitHub Actions**.

## Estrutura
- `src/scenarios.ts`: cirurgias (alvos, passos, ferramentas). Para uma nova cirurgia, adicione um item aqui e um modelo em `Organ.tsx`.
- `src/store.ts`: estado (ferramenta, passo, erros, cortes).
- `src/Room.tsx`: sala cirúrgica. `src/Organ.tsx`: órgãos e interação (corte, alvos).
- `src/Hands.tsx`: mãos virtuais no PC/celular. Em RA, as mãos reais vêm do @react-three/xr.
- `src/Panel.tsx`: menu flutuante Tools/Filters, quadro de passos e exame.
- `src/useGamepad.ts`: controle de Xbox.

## Próximos passos
Trocar órgãos procedurais por modelos .glb reais (useGLTF), carregar exames DICOM/NIfTI, instrumentos com colisão e pontuação por passo.
